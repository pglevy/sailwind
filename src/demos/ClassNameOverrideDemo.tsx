import { ButtonArrayLayout, TagField, CardLayout, HeadingField } from '../components'

export default function ClassNameOverrideDemo() {
  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      className="bg-gradient-to-r from-blue-50 to-purple-50" // Override background
    >
      <HeadingField
        text="className Override Demo"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Button with Custom Styling
          </h3>
          <ButtonArrayLayout
            buttons={[
              { 
                label: 'Normal Button', 
                style: 'SOLID', 
                color: 'ACCENT'
              },
              { 
                label: 'Custom Styled', 
                style: 'SOLID', 
                color: 'ACCENT',
                className: 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200'
              }
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            TagField with Custom Container
          </h3>
          <TagField
            tags={[
              { text: "Normal", backgroundColor: "ACCENT" },
              { text: "Custom", backgroundColor: "#FF6B6B", textColor: "#FFFFFF" }
            ]}
            size="STANDARD"
            className="p-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nested Card with Override
          </h3>
          <CardLayout
            padding="STANDARD"
            showBorder={true}
            className="border-dashed border-green-400 bg-green-50"
          >
            <p className="text-green-800">
              This card has custom border and background styling applied via className prop.
            </p>
          </CardLayout>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          Usage Pattern:
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`// SAIL parameters control core behavior
<ButtonWidget 
  style="SOLID" 
  color="ACCENT" 
  size="STANDARD"
  // className provides escape hatch for prototyping
  className="bg-gradient-to-r from-pink-500 to-orange-500"
/>`}
        </pre>
      </div>
    </CardLayout>
  )
}
