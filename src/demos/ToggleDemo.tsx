import { useState } from 'react'
import { CardLayout, HeadingField, TagField, ToggleField } from '../components'

export default function ToggleDemo() {
  const [boldToggled, setBoldToggled] = useState(false)
  const [italicToggled, setItalicToggled] = useState(false)
  const [favoriteToggled, setFavoriteToggled] = useState(true)
  const [solidToggled, setSolidToggled] = useState(false)
  const [outlineToggled, setOutlineToggled] = useState(false)
  const [ghostToggled, setGhostToggled] = useState(false)
  const [filterToggled, setFilterToggled] = useState(false)
  const [searchToggled, setSearchToggled] = useState(false)
  const [accentToggled, setAccentToggled] = useState(false)
  const [positiveToggled, setPositiveToggled] = useState(false)
  const [negativeToggled, setNegativeToggled] = useState(false)
  const [secondaryToggled, setSecondaryToggled] = useState(false)

  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="POSITIVE"
    >
      <div className="flex items-center gap-2 mb-4">
        <HeadingField
          text="Toggle Component"
          size="LARGE"
          headingTag="H2"
          marginBelow="NONE"
        />
        <TagField
          tags={[{ text: "NEW SAIL", backgroundColor: "#9333EA", textColor: "#FFFFFF" }]}
          size="SMALL"
        />
      </div>
      <p className="text-sm text-gray-700 mb-4">
        Not available in public SAIL - button-style toggle for pressed/unpressed states (e.g., toolbar buttons, filters).
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Toggles
          </h3>
          <div className="space-y-4">
            <ToggleField
              label="Text Formatting"
              text="Bold"
              value={boldToggled}
              saveInto={(value) => setBoldToggled(value)}
              style="OUTLINE"
            />

            <ToggleField
              label="Italic"
              text="Italic"
              value={italicToggled}
              saveInto={(value) => setItalicToggled(value)}
              style="OUTLINE"
            />

            <ToggleField
              label="Favorite"
              text="Add to Favorites"
              icon="star"
              value={favoriteToggled}
              saveInto={(value) => setFavoriteToggled(value)}
              color="ACCENT"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Style Variations
          </h3>
          <div className="space-y-4">
            <ToggleField
              label="SOLID Style"
              text="Toggle Me"
              value={solidToggled}
              saveInto={(value) => setSolidToggled(value)}
              style="SOLID"
              color="ACCENT"
            />
            <ToggleField
              label="OUTLINE Style"
              text="Toggle Me"
              value={outlineToggled}
              saveInto={(value) => setOutlineToggled(value)}
              style="OUTLINE"
              color="ACCENT"
            />
            <ToggleField
              label="GHOST Style"
              text="Toggle Me"
              value={ghostToggled}
              saveInto={(value) => setGhostToggled(value)}
              style="GHOST"
              color="ACCENT"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            With Icons
          </h3>
          <div className="space-y-4">
            <ToggleField
              label="Icon at START"
              text="Filter"
              icon="filter"
              iconPosition="START"
              value={filterToggled}
              saveInto={(value) => setFilterToggled(value)}
              style="OUTLINE"
            />
            <ToggleField
              label="Icon at END"
              text="Search"
              icon="arrow-right"
              iconPosition="END"
              value={searchToggled}
              saveInto={(value) => setSearchToggled(value)}
              style="OUTLINE"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Color Options
          </h3>
          <div className="space-y-4">
            <ToggleField
              label="ACCENT"
              text="Accent Color"
              value={accentToggled}
              saveInto={(value) => setAccentToggled(value)}
              color="ACCENT"
              style="OUTLINE"
            />
            <ToggleField
              label="POSITIVE"
              text="Positive Color"
              value={positiveToggled}
              saveInto={(value) => setPositiveToggled(value)}
              color="POSITIVE"
              style="OUTLINE"
            />
            <ToggleField
              label="NEGATIVE"
              text="Negative Color"
              value={negativeToggled}
              saveInto={(value) => setNegativeToggled(value)}
              color="NEGATIVE"
              style="OUTLINE"
            />
            <ToggleField
              label="SECONDARY"
              text="Secondary Color"
              value={secondaryToggled}
              saveInto={(value) => setSecondaryToggled(value)}
              color="SECONDARY"
              style="OUTLINE"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Disabled State
          </h3>
          <ToggleField
            label="Disabled Toggle"
            text="Can't Click Me"
            value={true}
            disabled
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-sm">
        <h4 className="text-xs font-semibold text-purple-900 mb-1">
          Imagined SAIL Translation (not real SAIL):
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!toggleField(
  label: "Favorite",
  text: "Add to Favorites",
  icon: "star",
  value: local!favoriteToggled,
  saveInto: local!favoriteToggled,
  style: "OUTLINE",
  color: "ACCENT"
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
