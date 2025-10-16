import { CardLayout, HeadingField } from '../components'

export default function CardsDemo() {
  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="WARN"
    >
      <HeadingField
        text="Card Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Card with Decorative Bar
          </h3>
          <CardLayout
            shape="SEMI_ROUNDED"
            padding="STANDARD"
            showBorder={true}
            borderColor="#EDEEFA"
            decorativeBarPosition="TOP"
            decorativeBarColor="ACCENT"
          >
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              Reference Information
            </h4>
            <p className="text-base text-gray-700">
              This card uses a top decorative bar to indicate reference content.
            </p>
          </CardLayout>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Card Variations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardLayout
              shape="SEMI_ROUNDED"
              padding="STANDARD"
              showBorder={true}
              showShadow={false}
              borderColor="#EDEEFA"
            >
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                Border Only
              </h4>
              <p className="text-xs text-gray-700">
                No shadow
              </p>
            </CardLayout>

            <CardLayout
              shape="SEMI_ROUNDED"
              padding="STANDARD"
              showBorder={false}
              showShadow={true}
            >
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                Shadow Only
              </h4>
              <p className="text-xs text-gray-700">
                No border
              </p>
            </CardLayout>

            <CardLayout
              shape="ROUNDED"
              padding="STANDARD"
              showBorder={true}
              borderColor="#EDEEFA"
            >
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                Rounded
              </h4>
              <p className="text-xs text-gray-700">
                8px radius
              </p>
            </CardLayout>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          SAIL Translation:
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!cardLayout(
  contents: {...},
  shape: "SEMI_ROUNDED",
  padding: "STANDARD",
  borderColor: "#EDEEFA"
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
