import { useState } from 'react'
import { CardLayout, HeadingField, RadioButtonField } from '../components'

export default function RadioButtonDemo() {
  const [selectedBrowser, setSelectedBrowser] = useState('ffx')
  const [productSatisfaction, setProductSatisfaction] = useState<number | undefined>(undefined)
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState('active')
  const [deliveryMethod, setDeliveryMethod] = useState<string | undefined>(undefined)
  const [radioSpacingStandard, setRadioSpacingStandard] = useState('M')
  const [radioSpacingMore, setRadioSpacingMore] = useState('M')
  const [radioSpacingEvenMore, setRadioSpacingEvenMore] = useState('M')
  const [radioChoiceEnd, setRadioChoiceEnd] = useState('2')

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
        text="Radio Button Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Radio Button Field (Stacked Layout)
          </h3>
          <RadioButtonField
            label="Browser"
            choiceLabels={["Firefox", "Chrome", "Safari"]}
            choiceValues={["ffx", "chr", "sfr"]}
            value={selectedBrowser}
            saveInto={(value) => setSelectedBrowser(value)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Compact Layout with Cards Style
          </h3>
          <RadioButtonField
            label="Did the product meet your needs?"
            labelPosition="ABOVE"
            choiceLabels={["Yes", "No"]}
            choiceValues={[1, 2]}
            value={productSatisfaction}
            saveInto={(value) => setProductSatisfaction(value)}
            choiceLayout="COMPACT"
            choiceStyle="CARDS"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cards Style (Stacked)
          </h3>
          <RadioButtonField
            label="Select a plan"
            choiceLabels={["Basic - $9/month", "Pro - $29/month", "Enterprise - Contact us"]}
            choiceValues={["basic", "pro", "enterprise"]}
            value={selectedPlan}
            saveInto={(value) => setSelectedPlan(value)}
            choiceStyle="CARDS"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Adjacent Label Position
          </h3>
          <RadioButtonField
            label="Status"
            labelPosition="ADJACENT"
            choiceLabels={["Active", "Inactive"]}
            choiceValues={["active", "inactive"]}
            value={status}
            saveInto={(value) => setStatus(value)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            With Required and Instructions
          </h3>
          <RadioButtonField
            label="Delivery Method"
            instructions="Choose how you'd like to receive your order"
            choiceLabels={["Standard Shipping", "Express Shipping", "Pickup"]}
            choiceValues={["standard", "express", "pickup"]}
            value={deliveryMethod}
            saveInto={(value) => setDeliveryMethod(value)}
            required
            requiredMessage="Please select a delivery method"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Disabled State
          </h3>
          <RadioButtonField
            label="Disabled Radio Buttons"
            choiceLabels={["Option 1", "Option 2", "Option 3"]}
            choiceValues={["1", "2", "3"]}
            value="1"
            disabled
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Spacing Variations
          </h3>
          <div className="space-y-4">
            <RadioButtonField
              label="Standard Spacing"
              choiceLabels={["Small", "Medium", "Large"]}
              choiceValues={["S", "M", "L"]}
              value={radioSpacingStandard}
              saveInto={(value) => setRadioSpacingStandard(value)}
              spacing="STANDARD"
            />

            <RadioButtonField
              label="More Spacing"
              choiceLabels={["Small", "Medium", "Large"]}
              choiceValues={["S", "M", "L"]}
              value={radioSpacingMore}
              saveInto={(value) => setRadioSpacingMore(value)}
              spacing="MORE"
            />

            <RadioButtonField
              label="Even More Spacing"
              choiceLabels={["Small", "Medium", "Large"]}
              choiceValues={["S", "M", "L"]}
              value={radioSpacingEvenMore}
              saveInto={(value) => setRadioSpacingEvenMore(value)}
              spacing="EVEN_MORE"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Choice Position (END)
          </h3>
          <RadioButtonField
            label="Radio Buttons on Right"
            choiceLabels={["First option", "Second option", "Third option"]}
            choiceValues={["1", "2", "3"]}
            value={radioChoiceEnd}
            saveInto={(value) => setRadioChoiceEnd(value)}
            choicePosition="END"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          SAIL Translation:
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!radioButtonField(
  label: "Browser",
  choiceLabels: {"Firefox", "Chrome", "Safari"},
  choiceValues: {"ffx", "chr", "sfr"},
  value: local!browser,
  saveInto: local!browser
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
