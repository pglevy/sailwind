import { useState } from 'react'
import { CardLayout, HeadingField, DropdownField, MultipleDropdownField } from '../components'

export default function DropdownDemo() {
  const [dropdownLanguage, setDropdownLanguage] = useState('en_US')
  const [dropdownNoDefault, setDropdownNoDefault] = useState<string | null>(null)
  const [dropdownWithSearch, setDropdownWithSearch] = useState<string | null>(null)
  const [multipleLanguages, setMultipleLanguages] = useState<string[]>(['en_US', 'fr_FR'])
  const [multipleNoDefault, setMultipleNoDefault] = useState<string[]>([])
  const [multipleWithSearch, setMultipleWithSearch] = useState<string[]>([])

  return (
    <>
      {/* Single Dropdown Component Demo */}
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
          text="Dropdown Component (Single Select)"
          size="LARGE"
          headingTag="H2"
          marginBelow="STANDARD"
        />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Basic Dropdown with Default Selection
            </h3>
            <DropdownField
              label="Language"
              instructions="In which language are you most proficient?"
              choiceLabels={["English", "Spanish", "French", "German"]}
              choiceValues={["en_US", "es_ES", "fr_FR", "de_DE"]}
              value={dropdownLanguage}
              saveInto={(value) => setDropdownLanguage(value)}
              placeholder="Select a language"
              searchDisplay="AUTO"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dropdown with No Default Selection
            </h3>
            <DropdownField
              label="Country"
              choiceLabels={["United States", "Canada", "Mexico", "United Kingdom"]}
              choiceValues={["US", "CA", "MX", "UK"]}
              value={dropdownNoDefault}
              saveInto={(value) => setDropdownNoDefault(value)}
              placeholder="Select a country"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dropdown with Search (12+ items triggers AUTO search)
            </h3>
            <DropdownField
              label="Language"
              instructions="Select your primary language"
              choiceLabels={[
                "English (US)", "Arabic", "Chinese (Simplified)", "Chinese (Traditional)",
                "Spanish", "French", "German", "Japanese", "Korean", "Polish", "Portuguese", "Russian"
              ]}
              choiceValues={[
                "en_US", "ar", "zh_CN", "zh_HK", "es_ES", "fr_FR", "de_DE", "ja", "ko", "pl", "pt", "ru"
              ]}
              value={dropdownWithSearch}
              saveInto={(value) => setDropdownWithSearch(value)}
              placeholder="Select a language"
              searchDisplay="AUTO"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Disabled Dropdown
            </h3>
            <DropdownField
              label="Status"
              choiceLabels={["Active", "Inactive", "Pending"]}
              choiceValues={["active", "inactive", "pending"]}
              value="active"
              disabled
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Adjacent Label Position
            </h3>
            <DropdownField
              label="Priority"
              labelPosition="ADJACENT"
              choiceLabels={["Low", "Medium", "High", "Critical"]}
              choiceValues={["low", "med", "high", "crit"]}
              value="med"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-sm">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">
            SAIL Translation:
          </h4>
          <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!dropdownField(
  label: "Language",
  instructions: "In which language are you most proficient?",
  choiceLabels: {"English", "Spanish", "French", "German"},
  choiceValues: {"en_US", "es_ES", "fr_FR", "de_DE"},
  value: local!language,
  saveInto: local!language,
  placeholder: "Select a language",
  searchDisplay: "AUTO"
)`}
          </pre>
        </div>
      </CardLayout>

      {/* Multiple Dropdown Component Demo */}
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
          text="Multiple Dropdown Component (Multi-Select)"
          size="LARGE"
          headingTag="H2"
          marginBelow="STANDARD"
        />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Basic Multiple Dropdown with Default Selections
            </h3>
            <MultipleDropdownField
              label="Language"
              instructions="Which language(s) are you proficient in?"
              choiceLabels={["English", "Spanish", "French", "German"]}
              choiceValues={["en_US", "es_ES", "fr_FR", "de_DE"]}
              value={multipleLanguages}
              saveInto={(value) => setMultipleLanguages(value || [])}
              searchDisplay="AUTO"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multiple Dropdown with No Default Selections
            </h3>
            <MultipleDropdownField
              label="Skills"
              instructions="Select all applicable skills"
              choiceLabels={["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java"]}
              choiceValues={["js", "ts", "react", "node", "python", "java"]}
              value={multipleNoDefault}
              saveInto={(value) => setMultipleNoDefault(value || [])}
              placeholder="Select skills"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multiple Dropdown with Search (12+ items)
            </h3>
            <MultipleDropdownField
              label="Language"
              instructions="Select all languages you speak"
              choiceLabels={[
                "English", "Arabic", "Chinese (Simplified)", "Chinese (Traditional)",
                "Spanish", "French", "German", "Japanese", "Korean", "Polish", "Portuguese", "Russian"
              ]}
              choiceValues={[
                "en_US", "ar", "zh_CN", "zh_HK", "es_ES", "fr_FR", "de_DE", "ja", "ko", "pl", "pt", "ru"
              ]}
              value={multipleWithSearch}
              saveInto={(value) => setMultipleWithSearch(value || [])}
              searchDisplay="AUTO"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Disabled Multiple Dropdown
            </h3>
            <MultipleDropdownField
              label="Assigned Teams"
              choiceLabels={["Engineering", "Design", "Marketing", "Sales"]}
              choiceValues={["eng", "design", "marketing", "sales"]}
              value={["eng", "design"]}
              disabled
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Adjacent Label Position
            </h3>
            <MultipleDropdownField
              label="Categories"
              labelPosition="ADJACENT"
              choiceLabels={["Technology", "Business", "Science", "Arts"]}
              choiceValues={["tech", "biz", "sci", "arts"]}
              value={["tech"]}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-sm">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">
            SAIL Translation:
          </h4>
          <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!multipleDropdownField(
  label: "Language",
  instructions: "Which language(s) are you proficient in?",
  choiceLabels: {"English", "Spanish", "French", "German"},
  choiceValues: {"en_US", "es_ES", "fr_FR", "de_DE"},
  value: local!language,
  saveInto: local!language,
  searchDisplay: "AUTO"
)`}
          </pre>
        </div>
      </CardLayout>
    </>
  )
}
