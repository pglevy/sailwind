import {
  ArrowLeftRight, Binary, Bot, Brain, Braces, Briefcase, Cable, ChartColumn, ChartLine, ChartPie, CircleCheck, Clock, Cloud, Code, Database,
  Equal, FileCheck, FileJson, FileSearch, FileText, Files, Filter, FlaskConical, Flag, Folder, FolderKanban, GitBranch, Globe, Hash, History,
  Image as ImageIcon, Inbox, Layers, LayoutDashboard, Link2, ListChecks, Mail, MessageSquare, Network, Play, Plug, Receipt, Rows3, ScanText, Search, Send,
  Server, Sigma, Sparkles, SquareCheck, SquareFunction, SquareStack, Table2, Tag, Tags, TextCursorInput, ToggleLeft, Type, Users, Variable,
  Webhook, Workflow, Wrench, Zap, Gauge, Activity, ChevronRight, Square, User, Ellipsis, Bookmark, UserPlus, UserRound, CircleUser,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * The pre-baked illustrations, one entry each. Everything is measured from the centre of the
 * picture, in the units of the 400 × 176 box it is drawn in.
 */

export type IllustrationName =
  | 'TEST_CASES'
  | 'TRIGGERS'
  | 'HISTORY'
  | 'NO_DATA'
  | 'PROCESS_MODELS'
  | 'RECORD_TYPES'
  | 'INTERFACES'
  | 'EXPRESSION_RULES'
  | 'AI_SKILLS'
  | 'AI_AGENTS'
  | 'CASES'
  | 'DASHBOARDS'
  | 'DOCUMENT_PROCESSING'
  | 'INTEGRATIONS'
  | 'TASK_LIST'
  | 'SEARCH_RESULTS'
  | 'DOCUMENT_LIST'
  | 'CONVERSATION'
  | 'AI_CHAT'
  | 'COMMENTS'
  | 'USERS'

/** A small tile in the picture: where it sits from the centre, its icon and how strongly it shows */
export interface IllustrationTile {
  x: number
  y: number
  icon: LucideIcon
  opacity: number
  /** Filled a soft grey rather than white, so a scatter of tiles reads as different people */
  tint?: boolean
}

/**
 * A picture ringed round a centre tile: small tiles, with connectors from the centre when the
 * picture is about things joined together. Most of the illustrations are drawn this way.
 */
export interface RadialSpec {
  kind?: 'RADIAL'
  /** Icon in the centre tile */
  centreIcon: LucideIcon
  /** The centre tile is drawn in the accent colour (a step the picture is about) rather than grey */
  accent: boolean
  /** Rings out from the centre tile, as radii with how strongly each is drawn */
  rings: { r: number; opacity: number }[]
  tiles: IllustrationTile[]
  /** Connectors from the centre outwards, as SVG paths */
  lines: string[]
  /** Whether the lines end in arrowheads, so they read as something passing along */
  arrows: boolean
  /**
   * Timing for a picture that plays as a sequence (the source appears, a line carries it to
   * the centre, the centre lights, lines carry it on). Pictures without one settle in
   * together. Milliseconds.
   */
  sequence?: {
    tiles: number[]
    lines: { delay: number; duration: number }[]
    centre: number
  }
}

/** One row of a list, or one bubble of a conversation, in a picture drawn as a stack */
export interface StackItem {
  /** Top left corner, from the centre of the picture */
  x: number
  y: number
  width: number
  height: number
  /** Radius of the corners */
  radius: number
  /** Outlined in the accent colour (the one that matters) rather than grey, as the centre tile of a ringed picture is */
  accent: boolean
  /** How strongly it shows, so a list can fade away down the picture */
  opacity: number
  /** Icon in a badge at the start, inside the item */
  badge?: { icon: LucideIcon; shape: 'TILE' | 'AVATAR' }
  /** Icon in an avatar outside the item, beside its lower corner: who is speaking */
  avatar?: { icon: LucideIcon; side: 'START' | 'END' }
  /** Icon at the end, inside the item */
  trailingIcon?: LucideIcon
  /** Widths of the lines of text, as bars. Leave empty for a typing indicator. */
  bars: number[]
  /** Three dots instead of lines of text: someone is typing */
  typing?: boolean
}

/**
 * A picture with no centre: rows of a list, or bubbles of a conversation, each a lightly drawn
 * card with the same semi-rounded corners as a tile, a badge and lines of text standing in for
 * words. They are grey, with at most one in the accent colour. They settle in one after another.
 */
export interface StackSpec {
  kind: 'STACK'
  items: StackItem[]
  /** Rings behind the cards, centred on the picture, as in a ringed picture */
  rings?: { r: number; opacity: number }[]
  /** Small tiles floating round the cards, as in a ringed picture */
  tiles?: IllustrationTile[]
}

export type IllustrationSpec = RadialSpec | StackSpec

const RADIAL_RINGS = [
  { r: 42, opacity: 1 },
  { r: 76, opacity: 0.7 },
  { r: 110, opacity: 0.45 },
  { r: 144, opacity: 0.25 },
]

const NEAR_RINGS = RADIAL_RINGS.slice(0, 2)

/** Where the eight tiles of a ringed picture sit, nearest the centre first, and how strongly each shows */
const RADIAL_SLOTS = [
  { x: -122, y: -36, opacity: 0.95 },
  { x: -90, y: 40, opacity: 0.6 },
  { x: -58, y: -70, opacity: 0.8 },
  { x: 112, y: -28, opacity: 0.9 },
  { x: 86, y: 44, opacity: 0.55 },
  { x: 56, y: -72, opacity: 0.7 },
  { x: -152, y: 12, opacity: 0.4 },
  { x: 142, y: 20, opacity: 0.4 },
]

/** Eight icons, placed in the slots above */
const radialTiles = (icons: LucideIcon[]): IllustrationTile[] => RADIAL_SLOTS.map((slot, index) => ({ ...slot, icon: icons[index] }))

/** Four connectors from the centre to two tiles each side, as in TEST_CASES */
const FOUR_LINES = [
  'M -22 -6 C -60 -6, -76 -46, -98 -46',
  'M -22 6 C -60 6, -84 44, -110 44',
  'M 22 -6 C 60 -6, 76 -46, 98 -46',
  'M 22 6 C 60 6, 84 44, 110 44',
]

/** Four tiles for FOUR_LINES to reach, then two faint ones beyond them */
const fourTiles = (icons: LucideIcon[]): IllustrationTile[] => [
  { x: -112, y: -46, icon: icons[0], opacity: 0.95 },
  { x: -124, y: 44, icon: icons[1], opacity: 0.7 },
  { x: 112, y: -46, icon: icons[2], opacity: 0.95 },
  { x: 124, y: 44, icon: icons[3], opacity: 0.7 },
  { x: -170, y: -2, icon: icons[4], opacity: 0.35 },
  { x: 172, y: -2, icon: icons[5], opacity: 0.35 },
]

/** One tile in, the centre, and two tiles out, with a faint tile beyond each end, as in TRIGGERS */
const fanOutTiles = (icons: LucideIcon[]): IllustrationTile[] => [
  { x: -130, y: 0, icon: icons[0], opacity: 0.95 },
  { x: 128, y: -40, icon: icons[1], opacity: 0.95 },
  { x: 128, y: 40, icon: icons[2], opacity: 0.8 },
  { x: -178, y: 0, icon: icons[3], opacity: 0.35 },
  { x: 176, y: 0, icon: icons[4], opacity: 0.35 },
]
const FAN_OUT_LINES = ['M -114 0 L -26 0', 'M 26 0 C 70 0, 76 -40, 112 -40', 'M 26 0 C 70 0, 76 40, 112 40']
const FAN_OUT_SEQUENCE = {
  tiles: [100, 640, 690, 50, 760],
  lines: [
    { delay: 180, duration: 280 },
    { delay: 430, duration: 300 },
    { delay: 445, duration: 300 },
  ],
  centre: 360,
}

/** A row of a list: a badge, two lines of text and, where it has somewhere to go, an arrow */
const row = (y: number, opacity: number, item: Partial<StackItem> & Pick<StackItem, 'badge' | 'bars'>): StackItem => ({
  x: -120,
  y,
  width: 240,
  height: 32,
  radius: 4,
  accent: false,
  opacity,
  ...item,
})

/** A bubble of a conversation: the speaker's avatar sits outside it, on the side it speaks from */
const bubble = (
  side: 'START' | 'END',
  y: number,
  width: number,
  height: number,
  opacity: number,
  item: Partial<StackItem> & Pick<StackItem, 'avatar'>
): StackItem => ({
  x: side === 'START' ? -120 : 150 - width,
  y,
  width,
  height,
  radius: 4,
  accent: false,
  opacity,
  bars: [],
  ...item,
})

export const ILLUSTRATIONS: Record<IllustrationName, IllustrationSpec> = {
  /** The centre joined to the data it is tried with */
  TEST_CASES: {
    centreIcon: FlaskConical,
    accent: true,
    rings: NEAR_RINGS,
    tiles: fourTiles([Database, Table2, FileJson, Rows3, Database, Table2]),
    lines: FOUR_LINES,
    arrows: false,
  },
  /** A step that starts other things: what leads in, the step, and what it starts */
  TRIGGERS: {
    centreIcon: Zap,
    accent: true,
    rings: NEAR_RINGS,
    tiles: fanOutTiles([FileText, Workflow, Send, Database, Layers]),
    lines: FAN_OUT_LINES,
    arrows: true,
    sequence: FAN_OUT_SEQUENCE,
  },
  /** Things from the past, ringed round a clock face */
  HISTORY: {
    centreIcon: History,
    accent: false,
    rings: RADIAL_RINGS,
    tiles: radialTiles([History, Layers, Clock, History, Layers, Clock, History, Layers]),
    lines: [],
    arrows: false,
  },
  /** Nothing to show, in general: an empty tray ringed by the kinds of thing that would fill it */
  NO_DATA: {
    centreIcon: Inbox,
    accent: false,
    rings: RADIAL_RINGS,
    tiles: radialTiles([FileText, Folder, Tag, SquareCheck, Clock, Layers, Sparkles, FileSearch]),
    lines: [],
    arrows: false,
  },
  /** A flow: a start, a task, the step itself, a decision and the end, each handing on to the next */
  PROCESS_MODELS: {
    centreIcon: Workflow,
    accent: true,
    rings: NEAR_RINGS,
    tiles: [
      { x: -160, y: 0, icon: Play, opacity: 0.95 },
      { x: -84, y: 0, icon: ListChecks, opacity: 0.95 },
      { x: 84, y: 0, icon: GitBranch, opacity: 0.95 },
      { x: 160, y: 0, icon: CircleCheck, opacity: 0.8 },
    ],
    lines: ['M -143 0 L -101 0', 'M -67 0 L -28 0', 'M 28 0 L 67 0', 'M 101 0 L 143 0'],
    arrows: true,
    sequence: {
      tiles: [40, 400, 1020, 1380],
      lines: [
        { delay: 140, duration: 240 },
        { delay: 480, duration: 240 },
        { delay: 800, duration: 240 },
        { delay: 1120, duration: 240 },
      ],
      centre: 700,
    },
  },
  /** The data fabric: a record type joined to the tables, relationships and views it draws on */
  RECORD_TYPES: {
    centreIcon: Database,
    accent: true,
    rings: NEAR_RINGS,
    tiles: fourTiles([Table2, Link2, Rows3, Network, Database, Table2]),
    lines: FOUR_LINES,
    arrows: false,
  },
  /** An interface: the controls it is built from, ringed round the interface itself */
  INTERFACES: {
    centreIcon: LayoutDashboard,
    accent: true,
    rings: RADIAL_RINGS,
    tiles: radialTiles([Type, ToggleLeft, TextCursorInput, ImageIcon, SquareStack, ListChecks, Tag, Layers]),
    lines: [],
    arrows: false,
  },
  /** An expression rule: the functions and values that go into one */
  EXPRESSION_RULES: {
    centreIcon: SquareFunction,
    accent: false,
    rings: RADIAL_RINGS,
    tiles: radialTiles([Braces, Code, Sigma, Hash, Variable, Equal, Binary, Filter]),
    lines: [],
    arrows: false,
  },
  /** An AI skill: a document goes in, and what the skill finds in it comes out */
  AI_SKILLS: {
    centreIcon: Brain,
    accent: true,
    rings: NEAR_RINGS,
    tiles: fanOutTiles([FileText, Tags, MessageSquare, Mail, Sparkles]),
    lines: FAN_OUT_LINES,
    arrows: true,
    sequence: FAN_OUT_SEQUENCE,
  },
  /** An AI agent: the tools, data and prompts it has to work with, ringed round the agent */
  AI_AGENTS: {
    centreIcon: Bot,
    accent: true,
    rings: RADIAL_RINGS,
    tiles: radialTiles([Wrench, Database, Search, MessageSquare, Plug, Workflow, Sparkles, Globe]),
    lines: [],
    arrows: false,
  },
  /** Case management: a case with its tasks, people, deadlines and documents around it */
  CASES: {
    centreIcon: FolderKanban,
    accent: false,
    rings: RADIAL_RINGS,
    tiles: radialTiles([Briefcase, Users, ListChecks, Clock, FileText, Flag, Tags, MessageSquare]),
    lines: [],
    arrows: false,
  },
  /** A report or dashboard: the charts and figures that would fill it */
  DASHBOARDS: {
    centreIcon: ChartColumn,
    accent: false,
    rings: RADIAL_RINGS,
    tiles: radialTiles([ChartPie, ChartLine, Gauge, Activity, Table2, Filter, Hash, Layers]),
    lines: [],
    arrows: false,
  },
  /** Document processing: the kinds of document it reads, ringed round the scanner */
  DOCUMENT_PROCESSING: {
    centreIcon: ScanText,
    accent: true,
    rings: RADIAL_RINGS,
    tiles: radialTiles([FileText, Receipt, Mail, FileCheck, Files, Tags, Table2, Database]),
    lines: [],
    arrows: false,
  },
  /** An integration: an Appian connection joined to the systems on the other side */
  INTEGRATIONS: {
    centreIcon: Plug,
    accent: false,
    rings: NEAR_RINGS,
    tiles: fourTiles([Cloud, Server, Webhook, ArrowLeftRight, Cable, Globe]),
    lines: FOUR_LINES,
    arrows: false,
  },
  /** A list of tasks: the first, the one to do next, ahead of those after it */
  TASK_LIST: {
    kind: 'STACK',
    items: [
      row(-72, 0.95, { accent: true, badge: { icon: SquareCheck, shape: 'TILE' }, bars: [120, 70], trailingIcon: ChevronRight }),
      row(-32, 0.75, { badge: { icon: Square, shape: 'TILE' }, bars: [96, 56], trailingIcon: ChevronRight }),
      row(8, 0.5, { badge: { icon: Square, shape: 'TILE' }, bars: [136, 80], trailingIcon: ChevronRight }),
    ],
  },
  /** A search that found nothing yet: the box it was typed in, then the kind of result that would appear */
  SEARCH_RESULTS: {
    kind: 'STACK',
    items: [
      row(-72, 0.95, { accent: true, height: 28, radius: 14, badge: { icon: Search, shape: 'AVATAR' }, bars: [110] }),
      row(-34, 0.7, { badge: { icon: FileText, shape: 'TILE' }, bars: [128, 72] }),
      row(6, 0.45, { badge: { icon: Table2, shape: 'TILE' }, bars: [100, 60] }),
    ],
  },
  /** A list of documents, each with its menu */
  DOCUMENT_LIST: {
    kind: 'STACK',
    items: [
      row(-72, 0.95, { badge: { icon: FileText, shape: 'TILE' }, bars: [124, 64], trailingIcon: Ellipsis }),
      row(-32, 0.75, { badge: { icon: FileCheck, shape: 'TILE' }, bars: [100, 52], trailingIcon: Ellipsis }),
      row(8, 0.5, { badge: { icon: Files, shape: 'TILE' }, bars: [132, 76], trailingIcon: Ellipsis }),
    ],
  },
  /** A conversation: three messages from three people, the one that matters outlined, with more people around them */
  CONVERSATION: {
    kind: 'STACK',
    rings: RADIAL_RINGS,
    tiles: [
      { x: -150, y: -44, icon: UserRound, opacity: 0.9, tint: true },
      { x: -164, y: 12, icon: User, opacity: 0.6 },
      { x: -128, y: 44, icon: CircleUser, opacity: 0.4, tint: true },
      { x: 146, y: -44, icon: User, opacity: 0.6 },
      { x: 158, y: 8, icon: UserRound, opacity: 0.9, tint: true },
      { x: 124, y: 44, icon: CircleUser, opacity: 0.4 },
    ],
    items: [
      row(-54, 0.95, { x: -100, width: 200, badge: { icon: User, shape: 'AVATAR' }, bars: [88, 52], trailingIcon: Ellipsis }),
      row(-18, 0.95, { x: -100, width: 200, accent: true, badge: { icon: User, shape: 'AVATAR' }, bars: [100, 60], trailingIcon: Ellipsis }),
      row(18, 0.95, { x: -100, width: 200, badge: { icon: User, shape: 'AVATAR' }, bars: [80, 48], trailingIcon: Ellipsis }),
    ],
  },
  /** A chat with an assistant: a short question, a longer answer, and the assistant still writing */
  AI_CHAT: {
    kind: 'STACK',
    items: [
      bubble('END', -72, 112, 28, 0.95, { accent: true, avatar: { icon: User, side: 'END' }, bars: [72] }),
      bubble('START', -36, 196, 54, 0.95, { avatar: { icon: Sparkles, side: 'START' }, bars: [158, 132, 84] }),
      bubble('START', 28, 50, 26, 0.6, { avatar: { icon: Sparkles, side: 'START' }, typing: true }),
    ],
  },
  /** Comments on something, with a reply set in under the first */
  COMMENTS: {
    kind: 'STACK',
    items: [
      row(-72, 0.95, { x: -130, width: 260, height: 36, badge: { icon: User, shape: 'AVATAR' }, bars: [150, 90] }),
      row(-28, 0.75, { x: -106, width: 236, accent: true, badge: { icon: User, shape: 'AVATAR' }, bars: [128, 70], trailingIcon: Bookmark }),
      row(12, 0.5, { x: -130, width: 260, badge: { icon: User, shape: 'AVATAR' }, bars: [140, 76] }),
    ],
  },
  /** People: a user to add in the centre, with the people already known scattered across the rings */
  USERS: {
    centreIcon: UserPlus,
    accent: false,
    rings: [...RADIAL_RINGS, { r: 178, opacity: 0.12 }],
    tiles: [
      { x: -70, y: -58, icon: UserRound, opacity: 0.95, tint: true },
      { x: 56, y: -52, icon: User, opacity: 0.9 },
      { x: -108, y: 30, icon: CircleUser, opacity: 0.85, tint: true },
      { x: 92, y: -4, icon: UserRound, opacity: 0.9, tint: true },
      { x: -46, y: 40, icon: User, opacity: 0.8 },
      { x: -150, y: -34, icon: UserRound, opacity: 0.6 },
      { x: 130, y: 38, icon: CircleUser, opacity: 0.6, tint: true },
      { x: 152, y: -40, icon: User, opacity: 0.4 },
      { x: -182, y: 2, icon: CircleUser, opacity: 0.35, tint: true },
      { x: 180, y: -64, icon: UserRound, opacity: 0.3 },
    ],
    lines: [],
    arrows: false,
  },
}
