import { CardLayout, HeadingField } from '../components'

export default function HeadingDemo() {
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
        text="Heading Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <HeadingField
            text="Size Variations"
            size="MEDIUM_PLUS"
            headingTag="H3"
            fontWeight="SEMI_BOLD"
            marginBelow="LESS"
          />
          <div className="space-y-2">
            <HeadingField text="LARGE_PLUS Heading" size="LARGE_PLUS" />
            <HeadingField text="LARGE Heading" size="LARGE" />
            <HeadingField text="MEDIUM_PLUS Heading" size="MEDIUM_PLUS" />
            <HeadingField text="MEDIUM Heading" size="MEDIUM" />
            <HeadingField text="SMALL Heading" size="SMALL" />
            <HeadingField text="EXTRA_SMALL Heading" size="EXTRA_SMALL" />
          </div>
        </div>

        <div>
          <HeadingField
            text="Color Variations"
            size="MEDIUM_PLUS"
            headingTag="H3"
            fontWeight="SEMI_BOLD"
            marginBelow="LESS"
          />
          <div className="space-y-2">
            <HeadingField text="ACCENT Color" color="ACCENT" />
            <HeadingField text="POSITIVE Color" color="POSITIVE" />
            <HeadingField text="NEGATIVE Color" color="NEGATIVE" />
            <HeadingField text="SECONDARY Color" color="SECONDARY" />
            <HeadingField text="Custom Hex Color" color="#0a578a" />
          </div>
        </div>

        <div>
          <HeadingField
            text="Font Weight & Alignment"
            size="MEDIUM_PLUS"
            headingTag="H3"
            fontWeight="SEMI_BOLD"
            marginBelow="LESS"
          />
          <div className="space-y-2">
            <HeadingField text="Light Weight" fontWeight="LIGHT" />
            <HeadingField text="Regular Weight" fontWeight="REGULAR" />
            <HeadingField text="Semi Bold Weight" fontWeight="SEMI_BOLD" />
            <HeadingField text="Bold Weight" fontWeight="BOLD" />
            <HeadingField text="Center Aligned" align="CENTER" />
            <HeadingField text="Right Aligned" align="END" />
          </div>
        </div>

        <div>
          <HeadingField
            text="Interactive Heading"
            size="MEDIUM"
            color="ACCENT"
            link={() => alert('Heading clicked!')}
            marginBelow="LESS"
          />
          <p className="text-sm text-gray-700">Click the heading above to test the link functionality</p>
        </div>
      </div>
    </CardLayout>
  )
}
