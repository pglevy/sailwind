import { CardLayout, HeadingField, MilestoneField } from '../components'

export default function MilestoneDemo() {
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
        text="Milestone Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Horizontal Milestone (Default)
          </h3>
          <MilestoneField
            label="Home Repair Claim Process"
            instructions="Customer #2325691"
            steps={[
              "Submit Customer Request", 
              "Set Up On-Site Appt", 
              "File Assessment", 
              "Submit Proposal", 
              "Submit Agreement", 
              "Finalize Repairs"
            ]}
            active={2}
            color="ACCENT"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vertical Milestone with DOT Style
          </h3>
          <MilestoneField
            steps={[
              "Review Cart", 
              "Billing Information", 
              "Shipping Information", 
              "Confirm Order"
            ]}
            stepStyle="DOT"
            active={1}
            orientation="VERTICAL"
            color="#674ea7"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            CHEVRON Style Status Indicator
          </h3>
          <MilestoneField
            label="Case Status"
            labelPosition="ABOVE"
            steps={["Draft", "Pending Review", "Submitted", "Filed", "Closed"]}
            active={2}
            stepStyle="CHEVRON"
            color="POSITIVE"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Steps Completed (active = -1)
          </h3>
          <MilestoneField
            label="Project Completion"
            steps={["Planning", "Development", "Testing", "Deployment"]}
            active={-1}
            color="POSITIVE"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Steps Future (active = null)
          </h3>
          <MilestoneField
            label="Upcoming Project"
            steps={["Research", "Design", "Implementation", "Launch"]}
            active={null}
            color="NEGATIVE"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Different Colors
          </h3>
          <div className="space-y-4">
            <MilestoneField
              steps={["Step 1", "Step 2", "Step 3"]}
              active={1}
              color="ACCENT"
            />
            <MilestoneField
              steps={["Step 1", "Step 2", "Step 3"]}
              active={1}
              color="POSITIVE"
            />
            <MilestoneField
              steps={["Step 1", "Step 2", "Step 3"]}
              active={1}
              color="NEGATIVE"
            />
            <MilestoneField
              steps={["Step 1", "Step 2", "Step 3"]}
              active={1}
              color="WARN"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Label Positions
          </h3>
          <div className="space-y-4">
            <MilestoneField
              label="Above Label"
              labelPosition="ABOVE"
              steps={["Step 1", "Step 2", "Step 3"]}
              active={1}
            />
            <MilestoneField
              label="Adjacent Label"
              labelPosition="ADJACENT"
              steps={["Step 1", "Step 2", "Step 3"]}
              active={1}
            />
            <MilestoneField
              label="Collapsed Label"
              labelPosition="COLLAPSED"
              steps={["Step 1", "Step 2", "Step 3"]}
              active={1}
              accessibilityText="Progress through three steps"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            With Help Tooltip
          </h3>
          <MilestoneField
            label="Process Status"
            helpTooltip="This shows the current progress through our standard workflow"
            steps={["Initiate", "Review", "Approve", "Complete"]}
            active={1}
            color="ACCENT"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          SAIL Translation:
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!milestoneField(
  label: "Home Repair Claim Process",
  instructions: "Customer #2325691",
  steps: {
    "Submit Customer Request", 
    "Set Up On-Site Appt", 
    "File Assessment", 
    "Submit Proposal", 
    "Submit Agreement", 
    "Finalize Repairs"
  },
  active: 3,
  color: "ACCENT"
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
