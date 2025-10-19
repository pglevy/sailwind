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
              { label: 'Add Another', style: 'OUTLINE', color: 'ACCENT', icon:'plus', tooltip:'And another one', saveInto: () => alert('Add Another clicked') },
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
  )
}
