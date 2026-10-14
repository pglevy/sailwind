import { Clock, Database, FileJson, FileSearch, FileText, FlaskConical, Folder, History, Inbox, Layers, Rows3, Send, Sparkles, Table2, Tag, SquareCheck, Workflow, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/**
 * The illustrations Illustration can draw, one entry each. Everything is measured from the
 * centre of the picture, in the units of the 400 × 176 box it is drawn in.
 */

export type IllustrationName = 'TEST_CASES' | 'TRIGGERS' | 'HISTORY' | 'NO_DATA'

/** A small tile in the picture: where it sits from the centre, its icon and how strongly it shows */
export interface IllustrationTile {
  x: number
  y: number
  icon: LucideIcon
  opacity: number
}

export interface IllustrationSpec {
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

const RADIAL_RINGS = [
  { r: 42, opacity: 1 },
  { r: 76, opacity: 0.7 },
  { r: 110, opacity: 0.45 },
  { r: 144, opacity: 0.25 },
]

const NEAR_RINGS = RADIAL_RINGS.slice(0, 2)

export const ILLUSTRATIONS: Record<IllustrationName, IllustrationSpec> = {
  /** The centre joined to the data it is tried with */
  TEST_CASES: {
    centreIcon: FlaskConical,
    accent: true,
    rings: NEAR_RINGS,
    tiles: [
      { x: -112, y: -46, icon: Database, opacity: 0.95 },
      { x: -124, y: 44, icon: Table2, opacity: 0.7 },
      { x: 112, y: -46, icon: FileJson, opacity: 0.95 },
      { x: 124, y: 44, icon: Rows3, opacity: 0.7 },
      { x: -170, y: -2, icon: Database, opacity: 0.35 },
      { x: 172, y: -2, icon: Table2, opacity: 0.35 },
    ],
    lines: [
      'M -22 -6 C -60 -6, -76 -46, -98 -46',
      'M -22 6 C -60 6, -84 44, -110 44',
      'M 22 -6 C 60 -6, 76 -46, 98 -46',
      'M 22 6 C 60 6, 84 44, 110 44',
    ],
    arrows: false,
  },
  /** A step that starts other things: what leads in, the step, and what it starts */
  TRIGGERS: {
    centreIcon: Zap,
    accent: true,
    rings: NEAR_RINGS,
    tiles: [
      { x: -130, y: 0, icon: FileText, opacity: 0.95 },
      { x: 128, y: -40, icon: Workflow, opacity: 0.95 },
      { x: 128, y: 40, icon: Send, opacity: 0.8 },
      { x: -178, y: 0, icon: Database, opacity: 0.35 },
      { x: 176, y: 0, icon: Layers, opacity: 0.35 },
    ],
    lines: ['M -114 0 L -26 0', 'M 26 0 C 70 0, 76 -40, 112 -40', 'M 26 0 C 70 0, 76 40, 112 40'],
    arrows: true,
    sequence: {
      tiles: [100, 640, 690, 50, 760],
      lines: [
        { delay: 180, duration: 280 },
        { delay: 430, duration: 300 },
        { delay: 445, duration: 300 },
      ],
      centre: 360,
    },
  },
  /** Things from the past, ringed round a clock face */
  HISTORY: {
    centreIcon: History,
    accent: false,
    rings: RADIAL_RINGS,
    tiles: [
      { x: -122, y: -36, icon: History, opacity: 0.95 },
      { x: -90, y: 40, icon: Layers, opacity: 0.6 },
      { x: -58, y: -70, icon: Clock, opacity: 0.8 },
      { x: 112, y: -28, icon: History, opacity: 0.9 },
      { x: 86, y: 44, icon: Layers, opacity: 0.55 },
      { x: 56, y: -72, icon: Clock, opacity: 0.7 },
      { x: -152, y: 12, icon: History, opacity: 0.4 },
      { x: 142, y: 20, icon: Layers, opacity: 0.4 },
    ],
    lines: [],
    arrows: false,
  },
  /** Nothing to show, in general: an empty tray ringed by the kinds of thing that would fill it */
  NO_DATA: {
    centreIcon: Inbox,
    accent: false,
    rings: RADIAL_RINGS,
    tiles: [
      { x: -122, y: -36, icon: FileText, opacity: 0.95 },
      { x: -90, y: 40, icon: Folder, opacity: 0.6 },
      { x: -58, y: -70, icon: Tag, opacity: 0.8 },
      { x: 112, y: -28, icon: SquareCheck, opacity: 0.9 },
      { x: 86, y: 44, icon: Clock, opacity: 0.55 },
      { x: 56, y: -72, icon: Layers, opacity: 0.7 },
      { x: -152, y: 12, icon: Sparkles, opacity: 0.4 },
      { x: 142, y: 20, icon: FileSearch, opacity: 0.4 },
    ],
    lines: [],
    arrows: false,
  },
}
