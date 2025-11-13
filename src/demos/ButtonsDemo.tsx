import { ButtonWidget, ButtonArrayLayout, CardLayout, HeadingField } from '../components'

export default function ButtonsDemo() {
  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="SUCCESS"
    >
      <HeadingField
        text="Button Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Semantic Colors (SOLID style)
          </h3>
          <ButtonArrayLayout
            buttons={[
              { label: 'ACCENT', style: 'SOLID', color: 'ACCENT' },
              { label: 'POSITIVE', style: 'SOLID', color: 'POSITIVE' },
              { label: 'NEGATIVE', style: 'SOLID', color: 'NEGATIVE' },
              { label: 'SECONDARY', style: 'SOLID', color: 'SECONDARY' },
              { label: 'STANDARD', style: 'SOLID', color: 'STANDARD' }
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Semantic Colors (OUTLINE style)
          </h3>
          <ButtonArrayLayout
            buttons={[
              { label: 'ACCENT', style: 'OUTLINE', color: 'ACCENT' },
              { label: 'POSITIVE', style: 'OUTLINE', color: 'POSITIVE' },
              { label: 'NEGATIVE', style: 'OUTLINE', color: 'NEGATIVE' },
              { label: 'SECONDARY', style: 'OUTLINE', color: 'SECONDARY' },
              { label: 'STANDARD', style: 'OUTLINE', color: 'STANDARD' }
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Button with Actions
          </h3>
          <ButtonArrayLayout
            buttons={[
              { label: 'Add Another', style: 'OUTLINE', color: 'ACCENT', icon:'plus', tooltip:'And another one', saveInto: () => alert('Add Another clicked') },
              { label: 'Delete', style: 'SOLID', color: 'NEGATIVE', saveInto: () => alert('Delete clicked') }
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Style Consistency (Same size regardless of style)
          </h3>
          <ButtonArrayLayout
            buttons={[
              { label: 'SOLID', style: 'SOLID', color: 'ACCENT', size: 'STANDARD' },
              { label: 'OUTLINE', style: 'OUTLINE', color: 'ACCENT', size: 'STANDARD' },
              { label: 'GHOST', style: 'GHOST', color: 'ACCENT', size: 'STANDARD' },
              { label: 'LINK', style: 'LINK', color: 'ACCENT', size: 'STANDARD' }
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
              { label: 'Medium', style: 'SOLID', color: 'ACCENT', size: 'MEDIUM' },
              { label: 'Large', style: 'SOLID', color: 'ACCENT', size: 'LARGE' }
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Hex Color Override (SOLID style)
          </h3>
          <ButtonArrayLayout
            buttons={[
              { label: 'Custom Purple', style: 'SOLID', color: '#8B5CF6' },
              { label: 'Custom Orange', style: 'SOLID', color: '#F97316' },
              { label: 'Custom Pink', style: 'SOLID', color: '#EC4899' }
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Hex Color Override (OUTLINE style)
          </h3>
          <ButtonArrayLayout
            buttons={[
              { label: 'Custom Purple', style: 'OUTLINE', color: '#8B5CF6' },
              { label: 'Custom Orange', style: 'OUTLINE', color: '#F97316' },
              { label: 'Custom Pink', style: 'OUTLINE', color: '#EC4899' }
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
  )
}
