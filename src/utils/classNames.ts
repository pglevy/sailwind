/**
 * Merges SAIL-computed classes with optional override className
 * 
 * This utility provides a consistent way to allow className overrides
 * while maintaining SAIL parameter integrity across all components.
 * 
 * When override classes conflict with SAIL classes (same prefix like bg-, text-, etc.),
 * the override classes take precedence and conflicting SAIL classes are removed.
 * 
 * @param sailClasses - Classes computed from SAIL parameters
 * @param override - Optional Tailwind classes to append/override
 * @returns Merged class string with conflicts resolved
 * 
 * @example
 * const sailClasses = "px-4 py-2 bg-blue-500 text-white"
 * const override = "bg-red-500 rounded-lg"
 * mergeClasses(sailClasses, override) // "px-4 py-2 text-white bg-red-500 rounded-lg"
 * // Note: bg-blue-500 removed because bg-red-500 overrides it
 */
export const mergeClasses = (sailClasses: string, override?: string): string => {
  if (!override) return sailClasses

  const sailClassArray = sailClasses.split(' ').filter(Boolean)
  const overrideClassArray = override.split(' ').filter(Boolean)

  // Get prefixes from override classes (e.g., "bg-red-500" -> "bg-", "hover:bg-blue-100" -> "bg-")
  const overridePrefixes = new Set(
    overrideClassArray
      .map(cls => {
        // Handle responsive/state prefixes like "hover:bg-blue-500" -> "bg-"
        const baseClass = cls.includes(':') ? cls.split(':').pop() : cls
        const match = baseClass?.match(/^([a-z-]+)-/)
        return match ? match[1] + '-' : null
      })
      .filter(Boolean)
  )

  // Remove conflicting SAIL classes
  const filteredSailClasses = sailClassArray.filter(cls => {
    // Handle responsive/state prefixes like "hover:bg-blue-500" -> "bg-"
    const baseClass = cls.includes(':') ? cls.split(':').pop() : cls
    const match = baseClass?.match(/^([a-z-]+)-/)
    const prefix = match ? match[1] + '-' : null
    return !prefix || !overridePrefixes.has(prefix)
  })

  return [...filteredSailClasses, ...overrideClassArray].join(' ')
}
