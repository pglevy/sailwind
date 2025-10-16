import { useState } from 'react'
import { CardLayout, HeadingField, TagField, SliderField } from '../components'

export default function SliderDemo() {
  const [volumeLevel, setVolumeLevel] = useState(75)
  const [priceRange, setPriceRange] = useState([25, 75])
  const [brightness, setBrightness] = useState(50)
  const [temperatureRange, setTemperatureRange] = useState([68, 72])

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
          text="Slider Component"
          size="MEDIUM"
          headingTag="H2"
          color="STANDARD"
          marginBelow="NONE"
        />
        <TagField
          tags={[{ text: "NEW SAIL", backgroundColor: "#9333EA", textColor: "#FFFFFF" }]}
          size="SMALL"
        />
      </div>
      <p className="text-sm text-gray-700 mb-4">
        Not available in public SAIL - this is a "new SAIL" component following the same patterns and conventions.
      </p>

      <div className="space-y-6">
        {/* Single Value Slider */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Single Value Slider</h3>
          <div className="space-y-4">
            <SliderField
              label="Volume Level"
              instructions="Adjust the audio volume"
              value={volumeLevel}
              min={0}
              max={100}
              step={1}
              saveInto={(value) => setVolumeLevel(value as number)}
              showValue={true}
              formatValue={(val) => `${val}%`}
              color="ACCENT"
              size="STANDARD"
            />

            <SliderField
              label="Brightness"
              instructions="Control screen brightness"
              value={brightness}
              min={0}
              max={100}
              step={5}
              saveInto={(value) => setBrightness(value as number)}
              showValue={true}
              formatValue={(val) => `${val}%`}
              color="POSITIVE"
              size="MEDIUM"
            />
          </div>
        </div>

        {/* Range Slider */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Range Slider</h3>
          <div className="space-y-4">
            <SliderField
              label="Price Range"
              instructions="Select your budget range"
              value={priceRange}
              min={0}
              max={100}
              step={1}
              saveInto={(value) => setPriceRange(value as number[])}
              showValue={true}
              formatValue={(val) => `$${val}`}
              color="ACCENT"
              size="STANDARD"
            />

            <SliderField
              label="Temperature Range"
              instructions="Set comfortable temperature range"
              value={temperatureRange}
              min={60}
              max={80}
              step={1}
              saveInto={(value) => setTemperatureRange(value as number[])}
              showValue={true}
              formatValue={(val) => `${val}°F`}
              color="NEGATIVE"
              size="STANDARD"
            />
          </div>
        </div>

        {/* Vertical Slider */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Vertical Slider</h3>
          <SliderField
            label="Vertical Volume"
            instructions="Vertical orientation example"
            value={volumeLevel}
            min={0}
            max={100}
            step={1}
            saveInto={(value) => setVolumeLevel(value as number)}
            showValue={true}
            formatValue={(val) => `${val}%`}
            color="ACCENT"
            size="STANDARD"
            orientation="VERTICAL"
          />
        </div>

        {/* Size Variations */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Size Variations</h3>
          <div className="space-y-4">
            <SliderField
              label="Small Slider"
              value={50}
              min={0}
              max={100}
              saveInto={() => {}}
              size="SMALL"
              color="ACCENT"
            />
            <SliderField
              label="Standard Slider"
              value={50}
              min={0}
              max={100}
              saveInto={() => {}}
              size="STANDARD"
              color="ACCENT"
            />
            <SliderField
              label="Medium Slider"
              value={50}
              min={0}
              max={100}
              saveInto={() => {}}
              size="MEDIUM"
              color="ACCENT"
            />
            <SliderField
              label="Large Slider"
              value={50}
              min={0}
              max={100}
              saveInto={() => {}}
              size="LARGE"
              color="ACCENT"
            />
          </div>
        </div>

        {/* Color Variations */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Color Variations</h3>
          <div className="space-y-4">
            <SliderField
              label="Accent Color"
              value={50}
              min={0}
              max={100}
              saveInto={() => {}}
              color="ACCENT"
            />
            <SliderField
              label="Positive Color"
              value={50}
              min={0}
              max={100}
              saveInto={() => {}}
              color="POSITIVE"
            />
            <SliderField
              label="Negative Color"
              value={50}
              min={0}
              max={100}
              saveInto={() => {}}
              color="NEGATIVE"
            />
            <SliderField
              label="Custom Hex Color"
              value={50}
              min={0}
              max={100}
              saveInto={() => {}}
              color="#9333EA"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">SAIL Translation</h4>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{`// React Prototype
<SliderField
  label: "Volume Level",
  instructions: "Adjust the audio volume",
  value: local!volumeLevel,
  min: 0,
  max: 100,
  step: 1,
  saveInto: local!volumeLevel,
  showValue: true,
  color: "ACCENT"
/>

// SAIL Production (hypothetical - not available in current SAIL)
a!sliderField(
  label: "Volume Level",
  instructions: "Adjust the audio volume",
  value: local!volumeLevel,
  min: 0,
  max: 100,
  step: 1,
  saveInto: local!volumeLevel,
  showValue: true,
  color: "ACCENT"
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
