/**
 * Merges SAIL-computed classes with optional override className
 * 
 * This utility provides a consistent way to allow className overrides
 * while maintaining SAIL parameter integrity across all components.
 * 
 * @param sailClasses - Classes computed from SAIL parameters
 * @param override - Optional Tailwind classes to append/override
 * @returns Merged class string
 * 
 * @example
 * const sailClasses = "px-4 py-2 bg-blue-500 text-white"
 * const override = "bg-red-500 rounded-lg"
 * mergeClasses(sailClasses, override) // "px-4 py-2 bg-blue-500 text-white bg-red-500 rounded-lg"
 * // Note: Later classes override earlier ones due to CSS specificity
 */
export const mergeClasses = (sailClasses: string, override?: string): string => {
  return override ? `${sailClasses} ${override}` : sailClasses
}
