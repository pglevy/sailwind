import * as React from 'react'
import { ILLUSTRATIONS } from './illustrationSpecs'
import type { IllustrationName, IllustrationSpec } from './illustrationSpecs'
import type { SvgImageComponentProps } from '../SvgImage'

export interface IllustrationProps extends SvgImageComponentProps {
  /** Whether the illustration draws itself in when it appears. Not in SAIL. */
  showAnimation?: boolean
}

/** The picture is drawn in a box this size, and carries it as its natural size */
const WIDTH = 400
const HEIGHT = 176

/** Half the width and height of the tile around each small icon, in the picture's own units */
const TILE_HALF = 13
const TILE_ICON = 14
const CENTRE_HALF = 24
const CENTRE_ICON = 20

/**
 * Draws one of the pre-baked illustrations from its spec. Not exported: use the named
 * components below, which are SvgImage components for ImageField.
 */
const IllustrationDrawing: React.FC<IllustrationProps & { spec: IllustrationSpec }> = ({ spec, className, showAnimation = true }) => {
  const markerId = React.useId()
  const sequence = spec.sequence
  const CentreIcon = spec.centreIcon

  return (
    <svg
      viewBox={`${-WIDTH / 2} ${-HEIGHT / 2} ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      className={['block h-auto max-w-full overflow-visible', showAnimation ? 'sw-illustration-animated' : '', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
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

      {spec.rings.map((ring, index) => (
        <circle
          key={ring.r}
          className="sw-ill-ring fill-none stroke-gray-200"
          r={ring.r}
          opacity={ring.opacity}
          strokeWidth="1"
          style={{ animationDelay: `${40 + index * 60}ms` }}
        />
      ))}

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

      {spec.tiles.map((tile, index) => {
        const TileIcon = tile.icon
        return (
          <g key={index} transform={`translate(${tile.x} ${tile.y})`}>
            <g
              className="sw-ill-tile"
              opacity={tile.opacity}
              style={{ animationDelay: `${sequence ? sequence.tiles[index] : 120 + index * 45}ms` }}
            >
              <rect
                x={-TILE_HALF}
                y={-TILE_HALF}
                width={TILE_HALF * 2}
                height={TILE_HALF * 2}
                rx="4"
                className="fill-white stroke-gray-200"
                strokeWidth="1"
              />
              <TileIcon x={-TILE_ICON / 2} y={-TILE_ICON / 2} size={TILE_ICON} className="stroke-gray-500" />
            </g>
          </g>
        )
      })}

      <g className="sw-ill-centre" style={sequence ? { animationDelay: `${sequence.centre}ms` } : undefined}>
        <rect
          x={-CENTRE_HALF}
          y={-CENTRE_HALF}
          width={CENTRE_HALF * 2}
          height={CENTRE_HALF * 2}
          rx="4"
          className={`fill-white ${spec.accent ? 'stroke-blue-200' : 'stroke-gray-200'}`}
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))' }}
        />
        <CentreIcon
          x={-CENTRE_ICON / 2}
          y={-CENTRE_ICON / 2}
          size={CENTRE_ICON}
          className={spec.accent ? 'stroke-blue-700' : 'stroke-gray-700'}
        />
      </g>
    </svg>
  )
}

const createIllustration = (name: IllustrationName, displayName: string) => {
  const Illustration: React.FC<IllustrationProps> = (props) => <IllustrationDrawing spec={ILLUSTRATIONS[name]} {...props} />
  Illustration.displayName = displayName
  return Illustration
}

/**
 * Pre-baked illustrations for ImageField's SVG image type. Not in SAIL.
 *
 * Pass one as the `component` of an SVG image:
 * `{ imageType: 'svg', component: NoDataIllustration }`. Each is one decorative SVG that
 * takes its size from ImageField's `size` and draws itself in unless `showAnimation` is
 * turned off (through the image's `componentProps`). The outer rings run past the edge of
 * the picture; put it in a parent that clips if that matters.
 */

/** The centre joined to the data it is tried with */
export const TestCasesIllustration = createIllustration('TEST_CASES', 'TestCasesIllustration')
/** A step that starts other things: what leads in, the step, and what it starts */
export const TriggersIllustration = createIllustration('TRIGGERS', 'TriggersIllustration')
/** Things from the past, ringed round a clock face */
export const HistoryIllustration = createIllustration('HISTORY', 'HistoryIllustration')
/** Nothing to show, in general: an empty tray ringed by what would fill it */
export const NoDataIllustration = createIllustration('NO_DATA', 'NoDataIllustration')
