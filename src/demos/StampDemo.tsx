import { CardLayout, HeadingField, StampField } from '../components'

export default function StampDemo() {
  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="ACCENT"
    >
      <HeadingField
        text="Stamp Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Stamps with Icons
          </h3>
          <div className="flex gap-4 items-center">
            <StampField
              backgroundColor="ACCENT"
              icon="star"
              contentColor="STANDARD"
              tooltip="Favorite"
            />
            <StampField
              backgroundColor="POSITIVE"
              icon="home"
              contentColor="STANDARD"
              tooltip="Home"
            />
            <StampField
              backgroundColor="NEGATIVE"
              icon="briefcase"
              contentColor="STANDARD"
              tooltip="Work"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Transparent Background
          </h3>
          <div className="flex gap-4 items-center">
            <StampField
              backgroundColor="TRANSPARENT"
              icon="home"
              contentColor="POSITIVE"
              tooltip="Home (Transparent)"
            />
            <StampField
              backgroundColor="TRANSPARENT"
              icon="star"
              contentColor="ACCENT"
              tooltip="Star (Transparent)"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Text Stamps
          </h3>
          <div className="flex gap-4 items-center">
            <StampField
              backgroundColor="#cc0000"
              text="1"
              align="CENTER"
            />
            <StampField
              backgroundColor="#cc0000"
              text="2"
              align="CENTER"
            />
            <StampField
              backgroundColor="#cc0000"
              text="3"
              align="CENTER"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Size Variations
          </h3>
          <div className="flex gap-4 items-center">
            <StampField
              icon="star"
              size="TINY"
              backgroundColor="ACCENT"
              tooltip="Tiny"
            />
            <StampField
              icon="star"
              size="SMALL"
              backgroundColor="ACCENT"
              tooltip="Small"
            />
            <StampField
              icon="star"
              size="MEDIUM"
              backgroundColor="ACCENT"
              tooltip="Medium"
            />
            <StampField
              icon="star"
              size="LARGE"
              backgroundColor="ACCENT"
              tooltip="Large"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Shape Variations
          </h3>
          <div className="flex gap-4 items-center">
            <StampField
              icon="star"
              shape="SQUARED"
              backgroundColor="ACCENT"
              tooltip="Squared"
            />
            <StampField
              icon="star"
              shape="SEMI_ROUNDED"
              backgroundColor="ACCENT"
              tooltip="Semi Rounded"
            />
            <StampField
              icon="star"
              shape="ROUNDED"
              backgroundColor="ACCENT"
              tooltip="Rounded (Default)"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            With Labels and Instructions
          </h3>
          <StampField
            label="Priority Level"
            instructions="Indicates the urgency of this item"
            labelPosition="ABOVE"
            icon="star"
            text="7"
            size="LARGE"
            backgroundColor="NEGATIVE"
            helpTooltip="High priority items require immediate attention"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          SAIL Translation:
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!stampField(
  label: "Priority Level",
  backgroundColor: "ACCENT",
  icon: "star",
  contentColor: "STANDARD",
  size: "MEDIUM"
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
