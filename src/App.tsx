import { TagField, ButtonWidget, CardLayout, ButtonArrayLayout, MessageBanner, ProgressBar } from './components'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sailwind
          </h1>
          <p className="text-base text-gray-700">
            React component library for rapid prototyping of Appian applications
          </p>
        </div>

        {/* Tag Component Demo */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="ACCENT"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tag Component
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Status Tags (Hex Colors)
              </h3>
              <TagField
                size="STANDARD"
                align="START"
                tags={[
                  {
                    text: "URGENT",
                    backgroundColor: "#FED7DE",
                    textColor: "#9F0019"
                  },
                  {
                    text: "CUSTOMER FACING",
                    backgroundColor: "#DBECFF",
                    textColor: "#0C4283"
                  },
                  {
                    text: "IN PROGRESS",
                    backgroundColor: "#FFF6C9",
                    textColor: "#856C00"
                  }
                ]}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Priority Tags (Semantic Colors)
              </h3>
              <TagField
                size="STANDARD"
                tags={[
                  { text: "HIGH PRIORITY", backgroundColor: "NEGATIVE" },
                  { text: "REVIEWED", backgroundColor: "POSITIVE" },
                  { text: "NEW", backgroundColor: "ACCENT" }
                ]}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Small Tags
              </h3>
              <TagField
                size="SMALL"
                tags={[
                  { text: "ACTIVE", backgroundColor: "POSITIVE" },
                  { text: "PENDING", backgroundColor: "SECONDARY" }
                ]}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-sm">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              SAIL Translation:
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!tagField(
  size: "STANDARD",
  tags: {
    a!tagItem(
      text: "URGENT",
      backgroundColor: "#FED7DE",
      textColor: "#9F0019"
    )
  }
)`}
            </pre>
          </div>
        </CardLayout>

        {/* Button Component Demo */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="SUCCESS"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Button Component
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Primary Actions (SOLID)
              </h3>
              <ButtonArrayLayout
                buttons={[
                  { label: 'Create', style: 'SOLID', color: 'ACCENT', saveInto: () => alert('Create clicked') },
                  { label: 'Delete', style: 'SOLID', color: 'NEGATIVE', saveInto: () => alert('Delete clicked') },
                  { label: 'Submit', style: 'SOLID', color: 'ACCENT', loadingIndicator: false }
                ]}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secondary Actions (OUTLINE)
              </h3>
              <ButtonArrayLayout
                buttons={[
                  { label: 'Add Another', style: 'OUTLINE', color: 'ACCENT', saveInto: () => alert('Add Another clicked') },
                  { label: 'Cancel', style: 'OUTLINE', color: 'SECONDARY', saveInto: () => alert('Cancel clicked') }
                ]}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Button Sizes
              </h3>
              <ButtonArrayLayout
                buttons={[
                  { label: 'Small', style: 'SOLID', color: 'ACCENT', size: 'SMALL' },
                  { label: 'Standard', style: 'SOLID', color: 'ACCENT', size: 'STANDARD' },
                  { label: 'Large', style: 'SOLID', color: 'ACCENT', size: 'LARGE' }
                ]}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Link Style
              </h3>
              <ButtonWidget label="Cancel" style="LINK" color="ACCENT" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-sm">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              SAIL Translation:
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!buttonWidget(
  label: "Submit",
  style: "SOLID",
  color: "ACCENT",
  loadingIndicator: true
)`}
            </pre>
          </div>
        </CardLayout>

        {/* MessageBanner Component Demo */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="INFO"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Message Banner Component
          </h2>

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

        {/* ProgressBar Component Demo */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="POSITIVE"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Progress Bar Component
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Basic Progress Bars
              </h3>
              <div className="space-y-4">
                <ProgressBar
                  label="Task Completion"
                  instructions="143 of 150 tasks completed"
                  percentage={95}
                  color="ACCENT"
                  style="THICK"
                />
                
                <ProgressBar
                  label="Project Progress"
                  percentage={67}
                  color="POSITIVE"
                />
                
                <ProgressBar
                  label="Low Progress"
                  percentage={23}
                  color="NEGATIVE"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Style Variations
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">THIN style (default)</p>
                  <ProgressBar
                    label="Thin Progress Bar"
                    percentage={75}
                    color="ACCENT"
                    style="THIN"
                  />
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">THICK style</p>
                  <ProgressBar
                    label="Thick Progress Bar"
                    percentage={75}
                    color="ACCENT"
                    style="THICK"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Color Options
              </h3>
              <div className="space-y-3">
                <ProgressBar
                  label="ACCENT (Blue)"
                  percentage={80}
                  color="ACCENT"
                />
                
                <ProgressBar
                  label="POSITIVE (Green)"
                  percentage={90}
                  color="POSITIVE"
                />
                
                <ProgressBar
                  label="WARN (Yellow)"
                  percentage={60}
                  color="WARN"
                />
                
                <ProgressBar
                  label="NEGATIVE (Red)"
                  percentage={30}
                  color="NEGATIVE"
                />
                
                <ProgressBar
                  label="Custom Hex Color"
                  percentage={85}
                  color="#9333EA"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Configuration Options
              </h3>
              <div className="space-y-4">
                <ProgressBar
                  label="Without Percentage Display"
                  instructions="Percentage text hidden"
                  percentage={45}
                  color="ACCENT"
                  showPercentage={false}
                />
                
                <ProgressBar
                  label="Edge Cases"
                  instructions="Handles values outside 0-100 range"
                  percentage={120}
                  color="WARN"
                />
                
                <ProgressBar
                  label="Collapsed Label"
                  labelPosition="COLLAPSED"
                  percentage={55}
                  color="POSITIVE"
                  accessibilityText="Hidden label progress bar at 55 percent"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-sm">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              SAIL Translation:
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!progressBarField(
  label: "Task Completion",
  instructions: "143 of 150 tasks completed",
  percentage: 95,
  color: "ACCENT",
  style: "THICK"
)`}
            </pre>
          </div>
        </CardLayout>

        {/* Card Component Demo */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="WARN"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Card Component
          </h2>

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
      </div>
    </div>
  )
}

export default App
