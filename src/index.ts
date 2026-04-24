/**
 * Sailwind - Appian SAIL components for React
 *
 * A component library that brings Appian SAIL interface patterns to React,
 * enabling rapid prototyping of Appian-style interfaces.
 *
 * @packageDocumentation
 */

// Import CSS so it gets processed and emitted by the library build
import './index.css'

// Export all components
export * from './components'

// Export all types
export * from './types/sail'

// Export color utilities
export { resolveColorClass, isSemanticColor, isPaletteColor, semanticColorClasses } from './utils/colorResolver'
export { paletteColorMap } from './types/palette-colors.generated'
