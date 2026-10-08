/**
 * Icon hover animations
 *
 * Every Lucide icon gets an animation chosen from its name, so the motion says
 * something about the concept: cogs turn, magnifiers sweep, bells swing, chevrons
 * nudge the way they point. Icons with no obvious motion (objects, animals, food)
 * fall back to `draw`, which strokes the outline on.
 *
 * The CSS lives in `src/index.css` as `.sw-icon-*` utilities, triggered by Tailwind's
 * `group` class on the hover target. All of it stops under `prefers-reduced-motion`.
 */

export type IconAnimation =
  | 'draw'        // strokes draw on — the fallback
  | 'slash'       // draws the line through a disabled/off icon
  | 'spin'        // one full turn: cogs, loaders, refresh
  | 'pulse'       // scale in and out: plus, minus, dots, badges
  | 'pop'         // quick overshoot: people, messages, reactions
  | 'beat'        // double thump: hearts, vitals
  | 'sweep'       // short search gesture: magnifiers
  | 'scribble'    // small wander, as if writing: pens, brushes
  | 'swing'       // rocks side to side: bells, alarms, phones
  | 'shake'       // quick jitter: warnings, errors, bugs, trash
  | 'blink'       // squints shut and opens: eyes
  | 'tick'        // hands advance: clocks, timers
  | 'rays'        // outer rays flare: suns
  | 'twinkle'     // accessory shapes pop: sparkles, stars
  | 'wave'        // arcs light up in sequence: signal, audio, battery
  | 'fall'        // accessory shapes drop: rain, snow, downloads in motion
  | 'pile'        // shapes stack into place: layers, lists, copies
  | 'grow'        // bars rise from the baseline: charts
  | 'flip'        // opens like a cover: files, folders, books, mail
  | 'drift'       // floats gently sideways: clouds, boats, balloons
  | 'drop'        // lands from above: pins, map markers
  | 'latch'       // shackle lifts: locks, keys, shields
  | 'nudge-up'
  | 'nudge-down'
  | 'nudge-left'
  | 'nudge-right'
  | 'swap-x'      // two-way horizontal shift: left-right arrows
  | 'swap-y'      // two-way vertical shift: up-down arrows, move
  | 'align-left'      // objects slide left until they line up
  | 'align-right'     // objects slide right until they line up
  | 'align-up'        // objects slide up until they line up
  | 'align-down'      // objects slide down until they line up
  | 'align-center-x'  // objects close in from both sides onto a vertical guide
  | 'align-center-y'  // objects close in from above and below onto a horizontal guide

/**
 * Which part of the SVG an animation is applied to.
 * - `icon` — the whole `<svg>`
 * - `parts` — every shape, staggered
 * - `accessory` — every shape except the first (the small extras)
 * - `last` / `lastTwo` — the shapes Lucide draws last (slash lines, clock hands, magnifiers)
 * - `objects` — the shapes being arranged, not the guide: the `<rect>`s in an align icon
 *   when it has any, otherwise every shape (the text lines in `align-left` and friends)
 */
export type IconAnimationTarget = 'icon' | 'parts' | 'accessory' | 'last' | 'lastTwo' | 'objects'

export const iconAnimationTargets: Record<IconAnimation, IconAnimationTarget> = {
  draw: 'parts',
  slash: 'last',
  spin: 'icon',
  pulse: 'icon',
  pop: 'icon',
  beat: 'icon',
  sweep: 'lastTwo',
  scribble: 'icon',
  swing: 'icon',
  shake: 'icon',
  blink: 'icon',
  tick: 'last',
  rays: 'accessory',
  twinkle: 'accessory',
  wave: 'parts',
  fall: 'accessory',
  pile: 'parts',
  grow: 'parts',
  flip: 'icon',
  drift: 'icon',
  drop: 'icon',
  latch: 'last',
  'nudge-up': 'icon',
  'nudge-down': 'icon',
  'nudge-left': 'icon',
  'nudge-right': 'icon',
  'swap-x': 'icon',
  'swap-y': 'icon',
  'align-left': 'objects',
  'align-right': 'objects',
  'align-up': 'objects',
  'align-down': 'objects',
  'align-center-x': 'objects',
  'align-center-y': 'objects',
}

/**
 * Animations where the shapes come in from opposite sides, so alternating shapes need
 * the `-alt` class to start from the other direction.
 */
export const alternatingAnimations: ReadonlySet<IconAnimation> = new Set([
  'align-center-x',
  'align-center-y',
])

/** Animations that need `pathLength="1"` so the dash covers the whole path. */
export const strokeDrawAnimations: ReadonlySet<IconAnimation> = new Set(['draw', 'slash'])

/** Human-readable summary of each animation, used by the Storybook page. */
export const iconAnimationDescriptions: Record<IconAnimation, string> = {
  draw: 'Strokes draw themselves on, shape after shape. The fallback for icons with no motion of their own.',
  slash: 'Draws just the line through the icon, so “off” reads as the thing being cut.',
  spin: 'One full turn — the motion the object actually makes.',
  pulse: 'Scales up and settles, for small marks that signal rather than move.',
  pop: 'A quick overshoot, as if arriving.',
  beat: 'Two thumps, faster than a pulse.',
  sweep: 'A short searching gesture across the icon.',
  scribble: 'A small wander, as if the tip were writing.',
  swing: 'Rocks side to side from the top, like something ringing.',
  shake: 'A quick jitter to read as a problem.',
  blink: 'Squints shut and opens again.',
  tick: 'The hands advance.',
  rays: 'The outer rays flare out from the middle.',
  twinkle: 'The small accessory shapes pop, leaving the main shape still.',
  wave: 'Arcs light up in sequence, from the source outward.',
  fall: 'The loose shapes drop.',
  pile: 'Shapes stack into place from above, one after another.',
  grow: 'Bars rise from the baseline.',
  flip: 'Tilts open like a cover.',
  drift: 'Floats gently sideways.',
  drop: 'Lands from above and settles.',
  latch: 'The shackle lifts and closes.',
  'nudge-up': 'A short push up, the way it points.',
  'nudge-down': 'A short push down, the way it points.',
  'nudge-left': 'A short push left, the way it points.',
  'nudge-right': 'A short push right, the way it points.',
  'swap-x': 'Shifts both ways horizontally.',
  'swap-y': 'Shifts both ways vertically.',
  'align-left': 'The objects slide left until they line up on the guide.',
  'align-right': 'The objects slide right until they line up on the guide.',
  'align-up': 'The objects slide up until they line up on the guide.',
  'align-down': 'The objects slide down until they line up on the guide.',
  'align-center-x': 'The objects close in from both sides until they centre on the guide.',
  'align-center-y': 'The objects close in from above and below until they centre on the guide.',
}

/**
 * Normalize any accepted icon name to the kebab-case form Lucide publishes:
 * `Volume2` → `volume-2`, `AArrowDown` → `a-arrow-down`, `Axis3d` → `axis-3d`.
 */
export function toIconSlug(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d+)/, '$1-$2')
    .toLowerCase()
}

/**
 * Name patterns mapped to animations, in priority order — the first match wins.
 *
 * Order matters: `-off` outranks everything (the slash is the message), direction
 * outranks the object being pointed at, and specific concepts outrank generic shape
 * wrappers like `square-` and `circle-`.
 */
const rules: ReadonlyArray<readonly [RegExp, IconAnimation]> = [
  // ── Disabled states: the slash is the whole point ──────────────────────────
  [/(^|-)off$/, 'slash'],
  [/(^|-)slash($|-)/, 'slash'],
  [/(^|-)ban($|-)/, 'slash'],

  // ── Two-way arrows and folds ───────────────────────────────────────────────
  [/arrow-(up-down|down-up)/, 'swap-y'],
  [/arrow-(left-right|right-left)/, 'swap-x'],
  [/(unfold|fold|flip)-vertical/, 'swap-y'],
  [/(unfold|fold|flip)-horizontal/, 'swap-x'],
  [/(^|-)move($|-3d$)/, 'swap-y'],
  [/(^|-)move-(vertical|diagonal)/, 'swap-y'],
  [/(^|-)move-horizontal/, 'swap-x'],
  [/(^|-)(git-compare|arrow-left-right|replace|shuffle|repeat-2|iteration)($|-)/, 'swap-x'],

  // ── Alignment: the objects move until they match the guide ─────────────────
  // Lucide draws the guide as a line and the objects as rects, so only the rects move.
  // A horizontal guide (`*-horizontal`) means the objects travel vertically, and a
  // vertical guide (`*-vertical`) means they travel horizontally.
  [/^align-start-horizontal($|-)/, 'align-up'],
  [/^align-end-horizontal($|-)/, 'align-down'],
  [/^align-center-horizontal($|-)/, 'align-center-y'],
  [/^align-start-vertical($|-)/, 'align-left'],
  [/^align-end-vertical($|-)/, 'align-right'],
  [/^align-center-vertical($|-)/, 'align-center-x'],
  [/^align-horizontal-/, 'align-center-x'],
  [/^align-vertical-/, 'align-center-y'],
  [/^align-left($|-)/, 'align-left'],
  [/^align-right($|-)/, 'align-right'],
  [/^align-(center|justify)($|-)/, 'align-center-x'],
  [/^(indent-increase|list-start)($|-)/, 'align-right'],
  [/^(indent-decrease|list-end)($|-)/, 'align-left'],

  // ── Rotation ───────────────────────────────────────────────────────────────
  [/(^|-)(cog|settings|settings-2|loader|loader-circle|refresh-cw|refresh-ccw|rotate-cw|rotate-ccw|rotate-3d|recycle|repeat|infinity|orbit|atom|fan|windmill|tornado|lasso|compass|disc|disc-2|disc-3|circle-dashed|circle-dot-dashed|loader-pinwheel|life-buoy|ship-wheel|steering-wheel|gauge|drum|hard-drive|rotate-cw-square|rotate-ccw-square)($|-)/, 'spin'],
  [/^(rotate|refresh)($|-)/, 'spin'],

  // ── Search and inspection ──────────────────────────────────────────────────
  [/(^|-)(search|zoom-in|zoom-out|scan-search|telescope|binoculars|microscope|search-check|search-code|search-slash|search-x)($|-)/, 'sweep'],
  [/^file-search/, 'sweep'],
  [/^folder-search/, 'sweep'],

  // ── Writing and drawing ────────────────────────────────────────────────────
  [/(^|-)(pen|pencil|pen-tool|pen-line|pen-off|brush|paintbrush|paintbrush-vertical|highlighter|signature|edit|edit-2|edit-3|feather|eraser|pencil-line|pencil-ruler|notebook-pen|square-pen|book-pen|file-pen|clipboard-pen|stamp)($|-)/, 'scribble'],

  // ── Sparkle and celebrate ──────────────────────────────────────────────────
  [/(^|-)(sparkle|sparkles|star|stars|wand|wand-2|wand-sparkles|party-popper|gem|diamond|award|badge-check|medal|trophy|crown|glasses|shell|snowflake)($|-)/, 'twinkle'],
  [/^star-/, 'twinkle'],

  // ── Sound the icon makes ───────────────────────────────────────────────────
  [/(^|-)(bell|bell-ring|bell-dot|bell-plus|bell-minus|alarm|alarm-clock|alarm-clock-check|alarm-clock-plus|alarm-clock-minus|alarm-smoke|siren|megaphone|phone|phone-call|phone-incoming|phone-outgoing|phone-forwarded|phone-missed|vibrate|church|bird)($|-)/, 'swing'],

  // ── Vitals and affection ───────────────────────────────────────────────────
  [/(^|-)(heart|heart-pulse|heart-handshake|heart-crack|activity|stethoscope|pill|syringe)($|-)/, 'beat'],
  [/^heart-/, 'beat'],

  // ── Signal, audio, power ───────────────────────────────────────────────────
  [/(^|-)(wifi|signal|rss|radio|radio-tower|radio-receiver|antenna|volume|volume-1|volume-2|volume-x|audio-waveform|audio-lines|waves|radar|cast|nfc|bluetooth|bluetooth-connected|bluetooth-searching|music|music-2|music-3|music-4|headphones|speaker|mic|mic-vocal|megaphone-off|podcast|airplay|battery|battery-charging|battery-full|battery-low|battery-medium|battery-plus|battery-warning|wave-sine|wave-square|activity-square|equalizer)($|-)/, 'wave'],
  [/^(wifi|signal|battery|volume|music|radio|bluetooth)($|-)/, 'wave'],

  // ── Time ───────────────────────────────────────────────────────────────────
  [/(^|-)(clock|timer|timer-off|timer-reset|watch|hourglass|history|calendar-clock)($|-)/, 'tick'],
  [/^clock-/, 'tick'],

  // ── Weather ────────────────────────────────────────────────────────────────
  [/(^|-)(sun|sun-dim|sun-medium|sunrise|sunset|sun-snow|haze|flame|flame-kindling|lightbulb|lamp|lamp-ceiling|lamp-desk|lamp-floor|lamp-wall-down|lamp-wall-up|zap|bolt|torus)($|-)/, 'rays'],
  [/(^|-)(cloud-rain|cloud-drizzle|cloud-snow|cloud-hail|cloud-rain-wind|cloud-lightning|droplet|droplets|umbrella|shower-head|coffee)($|-)/, 'fall'],
  [/(^|-)(cloud|cloudy|cloud-sun|cloud-moon|cloud-fog|wind|sailboat|ship|boat|plane|plane-takeoff|plane-landing|balloon|feather|leaf|moon|moon-star|snail|fish|waves-ladder)($|-)/, 'drift'],
  [/^cloud($|-)/, 'drift'],

  // ── Marks that are only a stroke: let them draw ────────────────────────────
  [/^(x|check|check-check|delete|minus|equal|divide)$/, 'draw'],
  [/^(circle|square|badge)-(x|check|minus)($|-)/, 'draw'],
  [/(^|-)(x|check|check-check)-(mark)?$/, 'draw'],

  // ── Covers that open ───────────────────────────────────────────────────────
  [/(^|-)(file|file-text|file-plus|file-minus|file-check|file-x|folder|folder-open|folder-plus|folder-minus|folder-check|folder-x|book|book-open|book-open-text|book-marked|book-text|notebook|notebook-tabs|notebook-text|mail|mail-open|mail-plus|mail-check|mail-x|mail-warning|mail-question|mails|envelope|inbox|archive|archive-restore|archive-x|calendar|calendar-days|calendar-check|calendar-plus|calendar-minus|calendar-x|calendar-range|calendar-heart|calendar-search|clipboard|clipboard-check|clipboard-copy|clipboard-paste|door-open|door-closed|briefcase|luggage|folder-tree|panel-top-open|panel-bottom-open)($|-)/, 'flip'],
  [/^(file|folder|book|mail|calendar|clipboard|notebook)($|-)/, 'flip'],

  // ── Stacks, lists, and text ────────────────────────────────────────────────
  [/(^|-)(layers|layers-2|layers-3|copy|copy-plus|copy-minus|copy-check|copy-slash|copy-x|files|library|book-copy|album|gallery-thumbnails|gallery-horizontal|gallery-vertical|boxes|group|blocks|component|panels-top-left|panels-left-bottom|panels-right-bottom|stretch-vertical|stretch-horizontal|sheet|receipt|receipt-text|newspaper|scroll|scroll-text|wallet-cards|credit-card|banknote|layout-list|kanban|rows|rows-2|rows-3|rows-4|table|table-2|table-properties|list|list-ordered|list-checks|list-todo|list-tree|list-plus|list-minus|list-x|list-check|list-video|list-music|list-collapse|list-filter|list-restart|list-start|list-end|text|text-quote|text-select|text-cursor|indent-increase|indent-decrease|menu|equal-approximately|whole-word|type|type-outline|heading|heading-1|heading-2|heading-3|heading-4|heading-5|heading-6|pilcrow|quote|letter-text|notepad-text|between-horizontal-start|between-horizontal-end|between-vertical-start|between-vertical-end)($|-)/, 'pile'],
  [/^(list|text|table|rows|heading|notepad)($|-)/, 'pile'],

  // ── Charts ─────────────────────────────────────────────────────────────────
  [/(^|-)(chart-bar|chart-column|chart-area|chart-line|chart-spline|chart-candlestick|chart-no-axes-column|chart-no-axes-combined|bar-chart|area-chart|line-chart|trending-up|trending-down|trending-up-down|signal-high|signal-low|signal-medium|activity-log)($|-)/, 'grow'],
  [/^(chart|bar-chart|area-chart|line-chart)($|-)/, 'grow'],
  [/(^|-)(chart-pie|pie-chart|chart-donut|donut|circle-percent|loader-2)($|-)/, 'spin'],

  // ── Covers that open ───────────────────────────────────────────────────────
  [/^(file|folder|book|mail|calendar|clipboard|notebook)($|-)/, 'flip'],

  // ── Landing and locating ───────────────────────────────────────────────────
  [/(^|-)(map-pin|map-pinned|pin|pin-off|navigation|navigation-2|locate|locate-fixed|locate-off|crosshair|goal|target|flag|flag-triangle-left|flag-triangle-right|milestone|tent|anchor|magnet|paperclip|bookmark|bookmark-plus|bookmark-minus|bookmark-check|bookmark-x)($|-)/, 'drop'],
  [/^(map|pin|bookmark|flag)($|-)/, 'drop'],

  // ── Security ───────────────────────────────────────────────────────────────
  [/(^|-)(lock|lock-open|lock-keyhole|lock-keyhole-open|unlock|key|key-round|key-square|shield|shield-check|shield-alert|shield-ban|shield-half|shield-plus|shield-minus|shield-question|shield-x|shield-user|fingerprint|scan-face|id-card|vault|safe)($|-)/, 'latch'],
  [/^(lock|shield|key)($|-)/, 'latch'],

  // ── Problems ───────────────────────────────────────────────────────────────
  [/(^|-)(trash|trash-2|bug|bug-play|bug-off|alert|triangle-alert|octagon-alert|circle-alert|octagon-x|shield-alert|frown|angry|annoyed|construction|hammer|axe|drill|wrench|biohazard|radiation|skull|bomb|circle-slash|test-tube-diagonal|cctv)($|-)/, 'shake'],
  [/^(alert|trash|bug)($|-)/, 'shake'],

  // ── Vision ─────────────────────────────────────────────────────────────────
  [/(^|-)(eye|eye-closed|scan-eye|view|glasses-2)($|-)/, 'blink'],

  // ── People, messages, reactions ────────────────────────────────────────────
  [/(^|-)(user|users|user-plus|user-minus|user-check|user-x|user-round|users-round|contact|contact-round|smile|smile-plus|laugh|meh|thumbs-up|thumbs-down|hand|hand-heart|hand-metal|handshake|baby|person-standing|gift|cake|party|message-circle|message-square|messages-square|message-circle-plus|message-square-plus|mail-heart|speech|quote-message|circle-user|square-user|badge-plus|badge-minus|badge-alert|badge-dollar-sign|ticket|ticket-check|ticket-plus|ticket-percent|ticket-slash|ticket-x|bot|bot-message-square|cpu|brain|brain-circuit|footprints|dog|cat|rabbit|squirrel|turtle|bug-play-2)($|-)/, 'pop'],
  [/^(user|message|smile|thumbs|badge|ticket)($|-)/, 'pop'],

  // ── Movement with a clear direction ────────────────────────────────────────
  [/(^|-)(play|play-circle|fast-forward|skip-forward|step-forward|redo|redo-2|redo-dot|log-out|share|share-2|send|send-horizontal|forward|external-link|arrow-big-right|rocket|circle-play|square-play|door-open-2)($|-)/, 'nudge-right'],
  [/(^|-)(rewind|skip-back|step-back|undo|undo-2|undo-dot|log-in|reply|reply-all|arrow-big-left|corner-up-left|corner-down-left|import)($|-)/, 'nudge-left'],
  [/(^|-)(download|arrow-down-to-line|arrow-big-down|chevrons-down|chevrons-down-up|hard-drive-download|cloud-download|folder-down|file-down|monitor-down|smartphone-down)($|-)/, 'nudge-down'],
  [/(^|-)(upload|arrow-up-to-line|arrow-big-up|chevrons-up|chevrons-up-down|hard-drive-upload|cloud-upload|folder-up|file-up|monitor-up|smartphone-up|trending-up-2)($|-)/, 'nudge-up'],

  // ── Anything else that names a direction goes that way ─────────────────────
  [/(-|^)right($|-)/, 'nudge-right'],
  [/(-|^)left($|-)/, 'nudge-left'],
  [/(-|^)up($|-)/, 'nudge-up'],
  [/(-|^)down($|-)/, 'nudge-down'],
  [/(-|^)(east|next|forward)($|-)/, 'nudge-right'],
  [/(-|^)(west|previous|back)($|-)/, 'nudge-left'],
  [/(-|^)(north|top|ascending)($|-)/, 'nudge-up'],
  [/(-|^)(south|bottom|descending)($|-)/, 'nudge-down'],

  // ── Small marks that signal ────────────────────────────────────────────────
  [/(^|-)(plus|minus|dot|circle-dot|asterisk|hash|percent|equal-not|divide|toggle-left|toggle-right|power|scan|scan-line|scan-barcode|scan-qr-code|qr-code|barcode|sigma|pi|omega|radical|binary|braces|brackets|parentheses|code|code-xml|terminal|command|option|bitcoin|dollar-sign|euro|pound-sterling|japanese-yen|indian-rupee|russian-ruble|swiss-franc|circle-help|help-circle|info|circle-ellipsis|ellipsis|ellipsis-vertical|more-horizontal|more-vertical|grip|grip-horizontal|grip-vertical|grip-lines|monitor-dot|nfc-dot)($|-)/, 'pulse'],
  [/^(circle-|square-)?(plus|minus|dot)($|-)/, 'pulse'],
  [/^(zap|flame|coins|coin|piggy-bank|banknote-arrow)($|-)/, 'pulse'],
]

/**
 * Pick the animation for an icon. Accepts a Lucide component name (`ChevronRight`) or
 * its kebab-case slug (`chevron-right`). Always returns an animation — `draw` when
 * nothing more specific fits.
 */
export function getIconAnimation(iconName: string): IconAnimation {
  const slug = toIconSlug(iconName)
  for (const [pattern, animation] of rules) {
    if (pattern.test(slug)) return animation
  }
  return 'draw'
}
