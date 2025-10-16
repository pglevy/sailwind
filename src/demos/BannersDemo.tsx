import { CardLayout, HeadingField, MessageBanner } from '../components'

export default function BannersDemo() {
  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="INFO"
    >
      <HeadingField
        text="Message Banner Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Predefined Styles
          </h3>
          <div className="space-y-3">
            <MessageBanner
              primaryText="Information"
              secondaryText="This is an informational message with default INFO styling."
              backgroundColor="INFO"
              highlightColor="INFO"
              icon="info"
            />

            <MessageBanner
              primaryText="Success!"
              secondaryText="Your changes have been saved successfully."
              backgroundColor="SUCCESS"
              highlightColor="POSITIVE"
              icon="success"
            />

            <MessageBanner
              primaryText="Warning"
              secondaryText="Please review your input before proceeding."
              backgroundColor="WARN"
              highlightColor="WARN"
              icon="warning"
            />

            <MessageBanner
              primaryText="Error"
              secondaryText="An error occurred while processing your request."
              backgroundColor="ERROR"
              highlightColor="NEGATIVE"
              icon="error"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Custom Styling
          </h3>
          <div className="space-y-3">
            <MessageBanner
              primaryText="Custom Colors"
              secondaryText="This banner uses custom hex colors with transparency."
              backgroundColor="#FED7DE80"
              highlightColor="#9F0019"
              shape="ROUNDED"
            />

            <MessageBanner
              primaryText="No Decorative Bar"
              secondaryText="This banner has the decorative bar disabled."
              backgroundColor="INFO"
              showDecorativeBar={false}
              shape="SEMI_ROUNDED"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Shape Variations
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">SQUARED (sharp corners)</p>
              <MessageBanner
                primaryText="Squared Banner"
                secondaryText="This banner has sharp, 90-degree corners"
                backgroundColor="SUCCESS"
                highlightColor="POSITIVE"
                shape="SQUARED"
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">SEMI_ROUNDED (4px radius)</p>
              <MessageBanner
                primaryText="Semi-Rounded Banner"
                secondaryText="This banner has slightly rounded corners"
                backgroundColor="INFO"
                highlightColor="INFO"
                shape="SEMI_ROUNDED"
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">ROUNDED (8px radius)</p>
              <MessageBanner
                primaryText="Rounded Banner"
                secondaryText="This banner has more rounded corners"
                backgroundColor="WARN"
                highlightColor="WARN"
                shape="ROUNDED"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Margin Spacing
          </h3>
          <div className="bg-gray-50 p-4 rounded-sm">
            <p className="text-sm text-gray-600 mb-3">Different marginBelow values:</p>

            <MessageBanner
              primaryText="NONE margin below"
              backgroundColor="INFO"
              highlightColor="INFO"
              marginBelow="NONE"
            />
            <MessageBanner
              primaryText="LESS margin below"
              backgroundColor="SUCCESS"
              highlightColor="POSITIVE"
              marginBelow="LESS"
            />
            <MessageBanner
              primaryText="STANDARD margin below"
              backgroundColor="WARN"
              highlightColor="WARN"
              marginBelow="STANDARD"
            />
            <MessageBanner
              primaryText="MORE margin below"
              backgroundColor="ERROR"
              highlightColor="NEGATIVE"
              marginBelow="MORE"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          SAIL Translation:
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!messageBanner(
  primaryText: "Success!",
  secondaryText: "Your changes have been saved.",
  backgroundColor: "SUCCESS",
  highlightColor: "POSITIVE",
  icon: "success",
  shape: "ROUNDED"
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
