import { CardLayout, HeadingField, RichTextDisplayField, TextItem, Icon } from '../components'

export default function RichTextDemo() {
  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="SECONDARY"
    >
      <HeadingField
        text="Rich Text Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            User Profile with Icons
          </h3>
          <RichTextDisplayField
            labelPosition="COLLAPSED"
            value={[
              <TextItem
                text={[
                  <Icon icon="user" caption="Name" />,
                  " Xavier Jones"
                ]}
                size="MEDIUM"
                style="STRONG"
              />,
              "\n",
              <TextItem
                text={[
                  <Icon icon="phone" caption="Phone" />,
                  " (555) 123-4567"
                ]}
                color="SECONDARY"
              />,
              "\n",
              <TextItem
                text={[
                  <Icon icon="building" caption="Location" />,
                  " Reston, VA"
                ]}
                color="SECONDARY"
              />
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Text Styles Showcase
          </h3>
          <RichTextDisplayField
            labelPosition="COLLAPSED"
            value={[
              <TextItem text="Plain, " style="PLAIN" />,
              <TextItem text="Emphasis Small, " style="EMPHASIS" size="SMALL" />,
              <TextItem text="Underline Medium, " style="UNDERLINE" size="MEDIUM" />,
              <TextItem text="Strikethrough Medium_Plus, " style="STRIKETHROUGH" size="MEDIUM_PLUS" />,
              <TextItem text="Strong Large, " style="STRONG" size="LARGE" />,
              <TextItem text="Emphasis Large_Plus " style="EMPHASIS" size="LARGE_PLUS" />,
              <TextItem text="Strong Extra_Large" style="STRONG" size="EXTRA_LARGE" />
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Interactive Links
          </h3>
          <RichTextDisplayField
            value={[
              "In addition to a personal statement, candidates may submit up to three ",
              <TextItem
                text={[
                  <Icon icon="image" />,
                  " Fine Art"
                ]}
                link={() => alert('Fine Art clicked!')}
              />,
              ", ",
              <TextItem
                text={[
                  <Icon icon="headphones" />,
                  " Audio"
                ]}
                link={() => alert('Audio clicked!')}
              />,
              ", or ",
              <TextItem
                text={[
                  <Icon icon="video" />,
                  " Video"
                ]}
                link={() => alert('Video clicked!')}
              />,
              " media samples."
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Standalone Navigation Links
          </h3>
          <RichTextDisplayField
            value={[
              <TextItem
                text={[
                  <Icon icon="home" />,
                  " Home"
                ]}
                link={() => alert('Home clicked!')}
                linkStyle="STANDALONE"
              />,
              "\n",
              <TextItem
                text={[
                  <Icon icon="square-check" />,
                  " My Open Requests"
                ]}
                link={() => alert('Requests clicked!')}
                linkStyle="STANDALONE"
              />,
              "\n",
              <TextItem
                text={[
                  <Icon icon="fileText" />,
                  " My Documents"
                ]}
                link={() => alert('Documents clicked!')}
                linkStyle="INLINE"
              />
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Color Variations
          </h3>
          <RichTextDisplayField
            value={[
              <TextItem text="Semantic Colors: " />,
              <TextItem text="ACCENT " color="ACCENT" style="STRONG" />,
              <TextItem text="POSITIVE " color="POSITIVE" style="STRONG" />,
              <TextItem text="NEGATIVE " color="NEGATIVE" style="STRONG" />,
              <TextItem text="SECONDARY " color="SECONDARY" style="STRONG" />,
              "\n",
              <TextItem text="Custom Colors: " />,
              <TextItem text="Custom Red " color="#FF0000" style="STRONG" />,
              <TextItem text="Custom Blue " color="#0066CC" style="STRONG" />
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Text Alignment
          </h3>
          <div className="space-y-3">
            <RichTextDisplayField
              label="Left Aligned (Default)"
              align="LEFT"
              value={[
                <TextItem text="This text is aligned to the left" />
              ]}
            />

            <RichTextDisplayField
              label="Center Aligned"
              align="CENTER"
              value={[
                <TextItem text="This text is centered" />
              ]}
            />

            <RichTextDisplayField
              label="Right Aligned"
              align="RIGHT"
              value={[
                <TextItem text="This text is aligned to the right" />
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          SAIL Translation:
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!richTextDisplayField(
  labelPosition: "COLLAPSED",
  value: {
    a!richTextItem(
      text: {
        a!richTextIcon(icon: "USER", caption: "Name"),
        " Xavier Jones"
      },
      size: "MEDIUM",
      style: { "STRONG" }
    ),
    char(10),
    a!richTextItem(
      text: {
        a!richTextIcon(icon: "PHONE", caption: "Phone"),
        " (555) 123-4567"
      },
      color: "SECONDARY"
    )
  }
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
