import * as React from 'react'
import { ILLUSTRATIONS } from './illustrationSpecs'
import type { IllustrationName, IllustrationTile, RadialSpec, StackSpec } from './illustrationSpecs'

export interface IllustrationProps {
  /** Which illustration to draw */
  name: IllustrationName
  /** Whether the illustration draws itself in when it appears */
  showAnimation?: boolean
  /** Size, shape and other classes from ImageField */
  className?: string
}

/** The picture is drawn in a box this size, and carries it as its natural size */
const WIDTH = 400
const HEIGHT = 176

/** Half the width and height of the tile around each small icon, in the picture's own units */
const TILE_HALF = 13
const TILE_ICON = 14
const CENTRE_HALF = 24
const CENTRE_ICON = 20

/** The soft shadow under the centre tile, and under the card that matters in a list or conversation */
const CARD_SHADOW = 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))'

/** Rings out from the centre of the picture, nearest first */
const Rings: React.FC<{ rings: { r: number; opacity: number }[] }> = ({ rings }) => (
  <>
    {rings.map((ring, index) => (
      <circle
        key={ring.r}
        className="sw-ill-ring fill-none stroke-gray-200"
        r={ring.r}
        opacity={ring.opacity}
        strokeWidth="1"
        style={{ animationDelay: `${40 + index * 60}ms` }}
      />
    ))}
  </>
)

/** Small tiles with an icon each. `sequence` times them one by one; without it they settle in together. */
const Tiles: React.FC<{ tiles: IllustrationTile[]; sequence?: number[] }> = ({ tiles, sequence }) => (
  <>
    {tiles.map((tile, index) => {
      const TileIcon = tile.icon
      return (
        <g key={index} transform={`translate(${tile.x} ${tile.y})`}>
          <g className="sw-ill-tile" opacity={tile.opacity} style={{ animationDelay: `${sequence ? sequence[index] : 120 + index * 45}ms` }}>
            <rect
              x={-TILE_HALF}
              y={-TILE_HALF}
              width={TILE_HALF * 2}
              height={TILE_HALF * 2}
              rx="4"
              className={`${tile.tint ? 'fill-gray-100' : 'fill-white'} stroke-gray-200`}
              strokeWidth="1"
            />
            <TileIcon x={-TILE_ICON / 2} y={-TILE_ICON / 2} size={TILE_ICON} className="stroke-gray-500" />
          </g>
        </g>
      )
    })}
  </>
)

/** A picture ringed round a centre tile */
const RadialPicture: React.FC<{ spec: RadialSpec }> = ({ spec }) => {
  // React 18's useId gives ids like ":r0:", and React 19's contain other punctuation. A colon in
  // url(#id) can stop the arrowhead being found, so keep only characters that are safe there.
  const markerId = `sw-ill-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const sequence = spec.sequence
  const CentreIcon = spec.centreIcon

  return (
    <>
      {spec.arrows && (
        <defs>
          {/* One arrowhead per line, so each can appear as its own line arrives */}
          {spec.lines.map((_, index) => (
            <marker
              key={index}
              id={`${markerId}-${index}`}
              viewBox="0 0 8 8"
              refX="6"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                className="sw-ill-arrow stroke-gray-500"
                style={sequence ? { animationDelay: `${sequence.lines[index].delay + sequence.lines[index].duration * 0.85}ms` } : undefined}
                d="M 1 1 L 6 4 L 1 7"
                fill="none"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </marker>
          ))}
        </defs>
      )}

      <Rings rings={spec.rings} />

      {spec.lines.map((path, index) => (
        <path
          key={path}
          className="sw-ill-line fill-none stroke-gray-300"
          pathLength={1}
          d={path}
          strokeWidth="1.25"
          strokeLinecap="round"
          markerEnd={spec.arrows ? `url(#${markerId}-${index})` : undefined}
          style={
            sequence
              ? { animationDelay: `${sequence.lines[index].delay}ms`, animationDuration: `${sequence.lines[index].duration}ms` }
              : { animationDelay: `${160 + index * 50}ms` }
          }
        />
      ))}

      <Tiles tiles={spec.tiles} sequence={sequence?.tiles} />

      <g className="sw-ill-centre" style={sequence ? { animationDelay: `${sequence.centre}ms` } : undefined}>
        <rect
          x={-CENTRE_HALF}
          y={-CENTRE_HALF}
          width={CENTRE_HALF * 2}
          height={CENTRE_HALF * 2}
          rx="4"
          className={`fill-white ${spec.accent ? 'stroke-blue-200' : 'stroke-gray-200'}`}
          strokeWidth="1.5"
          style={{ filter: CARD_SHADOW }}
        />
        <CentreIcon
          x={-CENTRE_ICON / 2}
          y={-CENTRE_ICON / 2}
          size={CENTRE_ICON}
          className={spec.accent ? 'stroke-blue-700' : 'stroke-gray-700'}
        />
      </g>
    </>
  )
}

/** Badge, lines of text and trailing icon sizes, in the picture's own units */
const BADGE = 20
const BADGE_ICON = 12
const BAR_HEIGHT = 5
const BAR_GAP = 6
/** When the first card arrives, and how long after one the next follows, in milliseconds */
const CARD_START = 120
const CARD_STEP = 160
const AVATAR_R = 10
const AVATAR_GAP = 6

/** A list or a conversation: lightly drawn cards with lines of text standing in for words */
const StackPicture: React.FC<{ spec: StackSpec }> = ({ spec }) => (
  <>
    {spec.rings && <Rings rings={spec.rings} />}
    {spec.tiles && <Tiles tiles={spec.tiles} />}
    {spec.items.map((item, index) => {
      const BadgeIcon = item.badge?.icon
      const AvatarIcon = item.avatar?.icon
      const TrailingIcon = item.trailingIcon
      const textStart = BadgeIcon ? 8 + BADGE + 8 : 12
      const textHeight = item.bars.length * BAR_HEIGHT + Math.max(item.bars.length - 1, 0) * BAR_GAP
      const textTop = (item.height - textHeight) / 2
      const avatarX = item.avatar?.side === 'END' ? item.width + AVATAR_GAP + AVATAR_R : -(AVATAR_GAP + AVATAR_R)

      return (
        <g key={index} transform={`translate(${item.x} ${item.y})`}>
          <g className="sw-ill-card" opacity={item.opacity} style={{ animationDelay: `${CARD_START + index * CARD_STEP}ms` }}>
            <rect
              width={item.width}
              height={item.height}
              rx={item.radius}
              className={item.accent ? 'fill-white stroke-blue-200' : 'fill-white stroke-gray-200'}
              strokeWidth={item.accent ? '1.5' : '1'}
              style={item.accent ? { filter: CARD_SHADOW } : undefined}
            />

            {BadgeIcon && (
              <>
                {item.badge?.shape === 'AVATAR' ? (
                  <circle cx={8 + BADGE / 2} cy={item.height / 2} r={BADGE / 2} className="fill-white stroke-gray-200" strokeWidth="1" />
                ) : (
                  <rect
                    x={8}
                    y={(item.height - BADGE) / 2}
                    width={BADGE}
                    height={BADGE}
                    rx="4"
                    className="fill-white stroke-gray-200"
                    strokeWidth="1"
                  />
                )}
                <BadgeIcon
                  x={8 + (BADGE - BADGE_ICON) / 2}
                  y={(item.height - BADGE_ICON) / 2}
                  size={BADGE_ICON}
                  className={item.accent ? 'stroke-blue-700' : 'stroke-gray-500'}
                />
              </>
            )}

            {item.bars.map((width, barIndex) => (
              <rect
                key={barIndex}
                // Each line is written after its card has arrived, one after another
                className={`sw-ill-bar ${barIndex === 0 ? 'fill-gray-200' : 'fill-gray-100'}`}
                style={{ animationDelay: `${CARD_START + index * CARD_STEP + 200 + barIndex * 90}ms` }}
                x={textStart}
                y={textTop + barIndex * (BAR_HEIGHT + BAR_GAP)}
                width={width}
                height={BAR_HEIGHT}
                rx={BAR_HEIGHT / 2}
              />
            ))}

            {item.typing &&
              [0, 1, 2].map((dot) => (
                <circle
                  key={dot}
                  cx={item.width / 2 + (dot - 1) * 10}
                  cy={item.height / 2}
                  r="2.5"
                  className="sw-ill-dot fill-gray-300"
                  style={{ animationDelay: `${CARD_START + index * CARD_STEP + 300 + dot * 160}ms` }}
                />
              ))}

            {TrailingIcon && (
              <TrailingIcon
                x={item.width - 8 - BADGE_ICON}
                y={(item.height - BADGE_ICON) / 2}
                size={BADGE_ICON}
                className="stroke-gray-500"
              />
            )}

            {AvatarIcon && (
              <>
                <circle cx={avatarX} cy={item.height - AVATAR_R} r={AVATAR_R} className="fill-white stroke-gray-200" strokeWidth="1" />
                <AvatarIcon
                  x={avatarX - BADGE_ICON / 2}
                  y={item.height - AVATAR_R - BADGE_ICON / 2}
                  size={BADGE_ICON}
                  className="stroke-gray-500"
                />
              </>
            )}
          </g>
        </g>
      )
    })}
  </>
)

/**
 * Draws one of the pre-baked illustrations. ImageField draws it for an image of type
 * `illustration`; it is not exported from the library.
 *
 * It is one decorative SVG, hidden from assistive technology, so put the words that say what
 * it means beside it. Its size comes from ImageField's `size`. The outer rings run past the
 * edge of the picture; put it in a parent that clips if that matters.
 */
export const Illustration: React.FC<IllustrationProps> = ({ name, showAnimation = true, className }) => {
  const spec = ILLUSTRATIONS[name]
  // A name that is not in the list (a typo, or a value from outside TypeScript) draws nothing
  // rather than throwing, so one bad name cannot blank the whole page
  if (!spec) return null

  return (
    <svg
      viewBox={`${-WIDTH / 2} ${-HEIGHT / 2} ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      className={['block h-auto max-w-full overflow-visible', showAnimation ? 'sw-illustration-animated' : '', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
      {spec.kind === 'STACK' ? <StackPicture spec={spec} /> : <RadialPicture spec={spec} />}
    </svg>
  )
}
