import { CardLayout, HeadingField, TagField } from '../components'

export default function TagsDemo() {
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
        text="Tag Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

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
  )
}
