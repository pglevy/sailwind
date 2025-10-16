import { useState } from 'react'
import { CardLayout, HeadingField, CheckboxField } from '../components'

export default function CheckboxDemo() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en_US', 'fr_FR'])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [preferences, setPreferences] = useState<string[]>([])
  const [terms, setTerms] = useState<string[]>([])
  const [requiredOptions, setRequiredOptions] = useState<string[]>([])
  const [spacingStandard, setSpacingStandard] = useState<string[]>([])
  const [spacingMore, setSpacingMore] = useState<string[]>([])
  const [spacingEvenMore, setSpacingEvenMore] = useState<string[]>([])
  const [choiceEnd, setChoiceEnd] = useState<string[]>([])

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
        text="Checkbox Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Checkbox Field (Stacked Layout)
          </h3>
          <CheckboxField
            label="Language"
            instructions="In which languages are you proficient?"
            choiceLabels={["English", "Spanish", "French", "German"]}
            choiceValues={["en_US", "es_ES", "fr_FR", "de_DE"]}
            value={selectedLanguages}
            saveInto={(value) => setSelectedLanguages(value)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Compact Layout
          </h3>
          <CheckboxField
            label="Preferences"
            choiceLabels={["Email", "SMS", "Push"]}
            choiceValues={["email", "sms", "push"]}
            value={preferences}
            saveInto={(value) => setPreferences(value)}
            choiceLayout="COMPACT"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cards Style
          </h3>
          <CheckboxField
            label="Reason(s) for appointment"
            labelPosition="ABOVE"
            choiceLabels={["Cough", "Sore throat", "Congestion", "Body aches", "Nausea", "Fever"]}
            choiceValues={["cough", "sore_throat", "congestion", "body_aches", "nausea", "fever"]}
            value={selectedSymptoms}
            saveInto={(value) => setSelectedSymptoms(value)}
            choiceStyle="CARDS"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Adjacent Label Position
          </h3>
          <CheckboxField
            label="Terms"
            labelPosition="ADJACENT"
            choiceLabels={["I agree to the terms and conditions"]}
            choiceValues={["agreed"]}
            value={terms}
            saveInto={(value) => setTerms(value)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            With Required and Validation
          </h3>
          <CheckboxField
            label="Required Selection"
            instructions="Please select at least one option"
            choiceLabels={["Option A", "Option B", "Option C"]}
            choiceValues={["a", "b", "c"]}
            value={requiredOptions}
            saveInto={(value) => setRequiredOptions(value)}
            required
            requiredMessage="This field is required"
            validations={[]}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Disabled State
          </h3>
          <CheckboxField
            label="Disabled Checkboxes"
            choiceLabels={["Option 1", "Option 2", "Option 3"]}
            choiceValues={["1", "2", "3"]}
            value={["1"]}
            disabled
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Spacing Variations
          </h3>
          <div className="space-y-4">
            <CheckboxField
              label="Standard Spacing"
              choiceLabels={["Item 1", "Item 2", "Item 3"]}
              choiceValues={["1", "2", "3"]}
              value={spacingStandard}
              saveInto={(value) => setSpacingStandard(value)}
              spacing="STANDARD"
            />

            <CheckboxField
              label="More Spacing"
              choiceLabels={["Item 1", "Item 2", "Item 3"]}
              choiceValues={["1", "2", "3"]}
              value={spacingMore}
              saveInto={(value) => setSpacingMore(value)}
              spacing="MORE"
            />

            <CheckboxField
              label="Even More Spacing"
              choiceLabels={["Item 1", "Item 2", "Item 3"]}
              choiceValues={["1", "2", "3"]}
              value={spacingEvenMore}
              saveInto={(value) => setSpacingEvenMore(value)}
              spacing="EVEN_MORE"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Choice Position (END)
          </h3>
          <CheckboxField
            label="Checkboxes on Right"
            choiceLabels={["First option", "Second option", "Third option"]}
            choiceValues={["1", "2", "3"]}
            value={choiceEnd}
            saveInto={(value) => setChoiceEnd(value)}
            choicePosition="END"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-sm">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">
          SAIL Translation:
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!checkboxField(
  label: "Language",
  instructions: "In which languages are you proficient?",
  choiceLabels: {"English", "Spanish", "French", "German"},
  choiceValues: {"en_US", "es_ES", "fr_FR", "de_DE"},
  value: local!language,
  saveInto: local!language
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
