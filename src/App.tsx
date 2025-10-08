import { TagField, ButtonWidget, CardLayout } from './components'

function App() {
  return (
    <div className="min-h-screen bg-gray-1 p-sail-even-more">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-sail-even-more">
          <h1 className="text-sail-extra-large font-bold text-gray-5 mb-sail-less">
            SAIL React Component Library
          </h1>
          <p className="text-sail-standard text-gray-4">
            Proof of concept - Appian-styled components with SAIL-compatible syntax
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
          <h2 className="text-sail-large font-bold text-gray-5 mb-sail-standard">
            Tag Component
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
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
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
                Priority Tags (Semantic Colors)
              </h3>
              <TagField
                size="STANDARD"
                tags={[
                  { text: "HIGH PRIORITY", backgroundColor: "NEGATIVE" },
                  { text: "REVIEWED", backgroundColor: "POSITIVE" },
                  { text: "NEW", backgroundColor: "ACCENT", textColor: "#FFFFFF" }
                ]}
              />
            </div>

            <div>
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
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

          <div className="mt-sail-more p-sail-standard bg-gray-1 rounded-sail-semi-rounded">
            <h4 className="text-sail-small font-semibold text-gray-4 mb-sail-even-less">
              SAIL Translation:
            </h4>
            <pre className="text-sail-small text-gray-5 overflow-x-auto">
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
          <h2 className="text-sail-large font-bold text-gray-5 mb-sail-standard">
            Button Component
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
                Primary Actions (SOLID)
              </h3>
              <div className="flex flex-wrap gap-sail-standard">
                <ButtonWidget
                  label="Create"
                  style="SOLID"
                  color="ACCENT"
                  onClick={() => alert('Create clicked')}
                />
                <ButtonWidget
                  label="Delete"
                  style="SOLID"
                  color="NEGATIVE"
                  onClick={() => alert('Delete clicked')}
                />
                <ButtonWidget
                  label="Submit"
                  style="SOLID"
                  color="ACCENT"
                  loadingIndicator={false}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
                Secondary Actions (OUTLINE)
              </h3>
              <div className="flex flex-wrap gap-sail-standard">
                <ButtonWidget
                  label="Add Another"
                  style="OUTLINE"
                  color="ACCENT"
                  onClick={() => alert('Add Another clicked')}
                />
                <ButtonWidget
                  label="Cancel"
                  style="OUTLINE"
                  color="SECONDARY"
                  onClick={() => alert('Cancel clicked')}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
                Button Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-sail-standard">
                <ButtonWidget
                  label="Small"
                  style="SOLID"
                  color="ACCENT"
                  size="SMALL"
                />
                <ButtonWidget
                  label="Standard"
                  style="SOLID"
                  color="ACCENT"
                  size="STANDARD"
                />
                <ButtonWidget
                  label="Large"
                  style="SOLID"
                  color="ACCENT"
                  size="LARGE"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
                Link Style
              </h3>
              <ButtonWidget
                label="Cancel"
                style="LINK"
                color="ACCENT"
              />
            </div>
          </div>

          <div className="mt-sail-more p-sail-standard bg-gray-1 rounded-sail-semi-rounded">
            <h4 className="text-sail-small font-semibold text-gray-4 mb-sail-even-less">
              SAIL Translation:
            </h4>
            <pre className="text-sail-small text-gray-5 overflow-x-auto">
{`a!buttonWidget(
  label: "Submit",
  style: "SOLID",
  color: "ACCENT",
  loadingIndicator: true
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
          <h2 className="text-sail-large font-bold text-gray-5 mb-sail-standard">
            Card Component
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
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
                <h4 className="text-sail-standard font-semibold text-gray-5 mb-sail-even-less">
                  Reference Information
                </h4>
                <p className="text-sail-standard text-gray-4">
                  This card uses a top decorative bar to indicate reference content.
                </p>
              </CardLayout>
            </div>

            <div>
              <h3 className="text-sail-medium font-semibold text-gray-5 mb-sail-less">
                Card Variations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-sail-standard">
                <CardLayout
                  shape="SEMI_ROUNDED"
                  padding="STANDARD"
                  showBorder={true}
                  showShadow={false}
                  borderColor="#EDEEFA"
                >
                  <h4 className="text-sail-standard font-semibold text-gray-5 mb-sail-even-less">
                    Border Only
                  </h4>
                  <p className="text-sail-small text-gray-4">
                    No shadow
                  </p>
                </CardLayout>

                <CardLayout
                  shape="SEMI_ROUNDED"
                  padding="STANDARD"
                  showBorder={false}
                  showShadow={true}
                >
                  <h4 className="text-sail-standard font-semibold text-gray-5 mb-sail-even-less">
                    Shadow Only
                  </h4>
                  <p className="text-sail-small text-gray-4">
                    No border
                  </p>
                </CardLayout>

                <CardLayout
                  shape="ROUNDED"
                  padding="STANDARD"
                  showBorder={true}
                  borderColor="#EDEEFA"
                >
                  <h4 className="text-sail-standard font-semibold text-gray-5 mb-sail-even-less">
                    Rounded
                  </h4>
                  <p className="text-sail-small text-gray-4">
                    8px radius
                  </p>
                </CardLayout>
              </div>
            </div>
          </div>

          <div className="mt-sail-more p-sail-standard bg-gray-1 rounded-sail-semi-rounded">
            <h4 className="text-sail-small font-semibold text-gray-4 mb-sail-even-less">
              SAIL Translation:
            </h4>
            <pre className="text-sail-small text-gray-5 overflow-x-auto">
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
