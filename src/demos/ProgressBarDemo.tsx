import { CardLayout, HeadingField, ProgressBar } from '../components'

export default function ProgressBarDemo() {
  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="POSITIVE"
    >
      <HeadingField
        text="Progress Bar Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

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
  )
}
