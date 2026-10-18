import { describe, it, expect } from 'vitest'
import { loadI18nBundle } from './bundleLoader'

// =============================================================================
// Example tests for `.properties` keys named after Object.prototype members
// (#173). Assigning a `__proto__` key onto a plain `{}` goes through the
// prototype setter instead of creating an entry, so the loader must store
// entries in maps where every key is an ordinary own entry.
// =============================================================================

describe('prototype-named .properties keys (#173)', () => {
  it('loads a __proto__ key as a normal entry in the default bundle', () => {
    const lookup = loadI18nBundle({
      './bundles/components.properties': '__proto__=x\nbutton.loading=Loading',
    })
    expect(() => lookup('en-us', '__proto__')).not.toThrow()
    expect(lookup('en-us', '__proto__')).toBe('x')
    expect(lookup('en-us', 'button.loading')).toBe('Loading')
  })

  it('loads a __proto__ key as a normal entry in a locale bundle', () => {
    const lookup = loadI18nBundle({
      './bundles/components_es.properties': '__proto__=x\nbutton.loading=Cargando',
    })
    expect(() => lookup('es', '__proto__')).not.toThrow()
    expect(lookup('es', '__proto__')).toBe('x')
    expect(lookup('es', 'button.loading')).toBe('Cargando')
  })

  // A string can't replace a prototype, so the setter ignores it. Before #173
  // the visible defect was the dropped entry, which the tests above catch.
  // This test pins that loading `__proto__` leaves prototypes alone.
  it('does not change any prototype', () => {
    const lookup = loadI18nBundle({ './bundles/components.properties': '__proto__=x' })
    expect(() => lookup('en-us', 'toString')).not.toThrow()
    expect(lookup('en-us', 'toString')).toBe('toString')
    expect(() => lookup('en-us', 'hasOwnProperty')).not.toThrow()
    expect(lookup('en-us', 'hasOwnProperty')).toBe('hasOwnProperty')
    expect('x' in {}).toBe(false)
  })

  it('loads other Object.prototype names as normal entries', () => {
    const lookup = loadI18nBundle({
      './bundles/components.properties':
        'toString=A\nconstructor=B\nhasOwnProperty=C\nvalueOf=D',
    })
    expect(lookup('en-us', 'toString')).toBe('A')
    expect(lookup('en-us', 'constructor')).toBe('B')
    expect(lookup('en-us', 'hasOwnProperty')).toBe('C')
    expect(lookup('en-us', 'valueOf')).toBe('D')
  })
})
