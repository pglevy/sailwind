import { useState } from 'react'
import { TagField, ButtonWidget, CardLayout, ButtonArrayLayout, MessageBanner, ProgressBar, HeadingField, RichTextDisplayField, TextItem, Icon, StampField, TextField, CheckboxField, RadioButtonField, DropdownField, MultipleDropdownField, SwitchField, ToggleField, SliderField, ImageField } from './components'
import { TaskDashboard, ApplicationStatus, DocumentReview, UserProfile, FormEntry } from './vibes'

type ViewMode = 'components' | 'task-dashboard' | 'application-status' | 'document-review' | 'user-profile' | 'form-entry'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('components')

  // TextField demo state
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('555-456-7890-876')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('John')

  // Checkbox demo state
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en_US', 'fr_FR'])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [preferences, setPreferences] = useState<string[]>([])
  const [terms, setTerms] = useState<string[]>([])
  const [requiredOptions, setRequiredOptions] = useState<string[]>([])
  const [spacingStandard, setSpacingStandard] = useState<string[]>([])
  const [spacingMore, setSpacingMore] = useState<string[]>([])
  const [spacingEvenMore, setSpacingEvenMore] = useState<string[]>([])
  const [choiceEnd, setChoiceEnd] = useState<string[]>([])

  // Radio button demo state
  const [selectedBrowser, setSelectedBrowser] = useState('ffx')
  const [productSatisfaction, setProductSatisfaction] = useState<number | undefined>(undefined)
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState('active')
  const [deliveryMethod, setDeliveryMethod] = useState<string | undefined>(undefined)
  const [radioSpacingStandard, setRadioSpacingStandard] = useState('M')
  const [radioSpacingMore, setRadioSpacingMore] = useState('M')
  const [radioSpacingEvenMore, setRadioSpacingEvenMore] = useState('M')
  const [radioChoiceEnd, setRadioChoiceEnd] = useState('2')

  // Dropdown demo state
  const [dropdownLanguage, setDropdownLanguage] = useState('en_US')
  const [dropdownNoDefault, setDropdownNoDefault] = useState<string | null>(null)
  const [dropdownWithSearch, setDropdownWithSearch] = useState<string | null>(null)

  // Multiple dropdown demo state
  const [multipleLanguages, setMultipleLanguages] = useState<string[]>(['en_US', 'fr_FR'])
  const [multipleNoDefault, setMultipleNoDefault] = useState<string[]>([])
  const [multipleWithSearch, setMultipleWithSearch] = useState<string[]>([])

  // Switch demo state (NEW SAIL components)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  // Toggle demo state (NEW SAIL components)
  const [boldToggled, setBoldToggled] = useState(false)
  const [italicToggled, setItalicToggled] = useState(false)
  const [favoriteToggled, setFavoriteToggled] = useState(true)
  const [solidToggled, setSolidToggled] = useState(false)
  const [outlineToggled, setOutlineToggled] = useState(false)
  const [ghostToggled, setGhostToggled] = useState(false)
  const [filterToggled, setFilterToggled] = useState(false)
  const [searchToggled, setSearchToggled] = useState(false)
  const [accentToggled, setAccentToggled] = useState(false)
  const [positiveToggled, setPositiveToggled] = useState(false)
  const [negativeToggled, setNegativeToggled] = useState(false)
  const [secondaryToggled, setSecondaryToggled] = useState(false)

  // Slider demo state (NEW SAIL components)
  const [volumeLevel, setVolumeLevel] = useState(75)
  const [priceRange, setPriceRange] = useState([25, 75])
  const [brightness, setBrightness] = useState(50)
  const [temperatureRange, setTemperatureRange] = useState([68, 72])

  // Email validation
  const emailValidations = email && !email.includes('@')
    ? ['Please enter a valid email address']
    : []

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <HeadingField
              text="Sailwind"
              size="MEDIUM_PLUS"
              headingTag="H1"
              color="ACCENT"
              marginBelow="NONE"
            />
            <TagField
              tags={[{ text: "SAIL-Compatible", backgroundColor: "ACCENT" }]}
              size="SMALL"
            />
          </div>
          <div className="flex gap-2">
            <ButtonArrayLayout
              buttons={[
                {
                  label: "Components",
                  style: viewMode === 'components' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('components')
                },
                {
                  label: "Task Dashboard",
                  style: viewMode === 'task-dashboard' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('task-dashboard')
                },
                {
                  label: "Application Status",
                  style: viewMode === 'application-status' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('application-status')
                },
                {
                  label: "Document Review",
                  style: viewMode === 'document-review' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('document-review')
                },
                {
                  label: "User Profile",
                  style: viewMode === 'user-profile' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('user-profile')
                },
                {
                  label: "Form Entry",
                  style: viewMode === 'form-entry' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('form-entry')
                }
              ]}
              align="START"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'task-dashboard' && <TaskDashboard />}
      {viewMode === 'application-status' && <ApplicationStatus />}
      {viewMode === 'document-review' && <DocumentReview />}
      {viewMode === 'user-profile' && <UserProfile />}
      {viewMode === 'form-entry' && <FormEntry />}

      {viewMode === 'components' && (
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header using HeadingField */}
            <div className="mb-8">
              <HeadingField
                text="Component Library"
                size="LARGE_PLUS"
                headingTag="H1"
                marginBelow="EVEN_LESS"
              />
              <p className="text-base text-gray-700">
                React component library for rapid prototyping of Appian applications
              </p>
            </div>

        {/* Heading Component Demo */}
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

        {/* Tag Component Demo */}
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

        {/* Button Component Demo */}
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
                  { label: 'Add Another', style: 'OUTLINE', color: 'ACCENT', saveInto: () => alert('Add Another clicked') },
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

        {/* MessageBanner Component Demo */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="INFO"
        >
          <HeadingField
            text="Message Banner Component"
            size="LARGE"
            headingTag="H2"
            marginBelow="STANDARD"
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Predefined Styles
              </h3>
              <div className="space-y-3">
                <MessageBanner
                  primaryText="Information"
                  secondaryText="This is an informational message with default INFO styling."
                  backgroundColor="INFO"
                  highlightColor="INFO"
                  icon="info"
                />
                
                <MessageBanner
                  primaryText="Success!"
                  secondaryText="Your changes have been saved successfully."
                  backgroundColor="SUCCESS"
                  highlightColor="POSITIVE"
                  icon="success"
                />
                
                <MessageBanner
                  primaryText="Warning"
                  secondaryText="Please review your input before proceeding."
                  backgroundColor="WARN"
                  highlightColor="WARN"
                  icon="warning"
                />
                
                <MessageBanner
                  primaryText="Error"
                  secondaryText="An error occurred while processing your request."
                  backgroundColor="ERROR"
                  highlightColor="NEGATIVE"
                  icon="error"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Custom Styling
              </h3>
              <div className="space-y-3">
                <MessageBanner
                  primaryText="Custom Colors"
                  secondaryText="This banner uses custom hex colors with transparency."
                  backgroundColor="#FED7DE80"
                  highlightColor="#9F0019"
                  shape="ROUNDED"
                />
                
                <MessageBanner
                  primaryText="No Decorative Bar"
                  secondaryText="This banner has the decorative bar disabled."
                  backgroundColor="INFO"
                  showDecorativeBar={false}
                  shape="SEMI_ROUNDED"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Shape Variations
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">SQUARED (sharp corners)</p>
                  <MessageBanner
                    primaryText="Squared Banner"
                    secondaryText="This banner has sharp, 90-degree corners"
                    backgroundColor="SUCCESS"
                    highlightColor="POSITIVE"
                    shape="SQUARED"
                  />
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">SEMI_ROUNDED (4px radius)</p>
                  <MessageBanner
                    primaryText="Semi-Rounded Banner"
                    secondaryText="This banner has slightly rounded corners"
                    backgroundColor="INFO"
                    highlightColor="INFO"
                    shape="SEMI_ROUNDED"
                  />
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">ROUNDED (8px radius)</p>
                  <MessageBanner
                    primaryText="Rounded Banner"
                    secondaryText="This banner has more rounded corners"
                    backgroundColor="WARN"
                    highlightColor="WARN"
                    shape="ROUNDED"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Margin Spacing
              </h3>
              <div className="bg-gray-50 p-4 rounded-sm">
                <p className="text-sm text-gray-600 mb-3">Different marginBelow values:</p>
                
                <MessageBanner
                  primaryText="NONE margin below"
                  backgroundColor="INFO"
                  highlightColor="INFO"
                  marginBelow="NONE"
                />
                <MessageBanner
                  primaryText="LESS margin below"
                  backgroundColor="SUCCESS"
                  highlightColor="POSITIVE"
                  marginBelow="LESS"
                />
                <MessageBanner
                  primaryText="STANDARD margin below"
                  backgroundColor="WARN"
                  highlightColor="WARN"
                  marginBelow="STANDARD"
                />
                <MessageBanner
                  primaryText="MORE margin below"
                  backgroundColor="ERROR"
                  highlightColor="NEGATIVE"
                  marginBelow="MORE"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-sm">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              SAIL Translation:
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!messageBanner(
  primaryText: "Success!",
  secondaryText: "Your changes have been saved.",
  backgroundColor: "SUCCESS",
  highlightColor: "POSITIVE",
  icon: "success",
  shape: "ROUNDED"
)`}
            </pre>
          </div>
        </CardLayout>

        {/* ProgressBar Component Demo */}
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

        {/* Rich Text Component Demo */}
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

        {/* Card Component Demo */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="WARN"
        >
          <HeadingField
            text="Card Component"
            size="LARGE"
            headingTag="H2"
            marginBelow="STANDARD"
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Card with Decorative Bar
              </h3>
              <CardLayout
                shape="SEMI_ROUNDED"
                padding="STANDARD"
                showBorder={true}
                borderColor="#EDEEFA"
                decorativeBarPosition="TOP"
                decorativeBarColor="ACCENT"
              >
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  Reference Information
                </h4>
                <p className="text-base text-gray-700">
                  This card uses a top decorative bar to indicate reference content.
                </p>
              </CardLayout>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Card Variations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardLayout
                  shape="SEMI_ROUNDED"
                  padding="STANDARD"
                  showBorder={true}
                  showShadow={false}
                  borderColor="#EDEEFA"
                >
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Border Only
                  </h4>
                  <p className="text-xs text-gray-700">
                    No shadow
                  </p>
                </CardLayout>

                <CardLayout
                  shape="SEMI_ROUNDED"
                  padding="STANDARD"
                  showBorder={false}
                  showShadow={true}
                >
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Shadow Only
                  </h4>
                  <p className="text-xs text-gray-700">
                    No border
                  </p>
                </CardLayout>

                <CardLayout
                  shape="ROUNDED"
                  padding="STANDARD"
                  showBorder={true}
                  borderColor="#EDEEFA"
                >
                  <h4 className="text-base font-semibold text-gray-900 mb-1">
                    Rounded
                  </h4>
                  <p className="text-xs text-gray-700">
                    8px radius
                  </p>
                </CardLayout>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-sm">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              SAIL Translation:
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!cardLayout(
  contents: {...},
  shape: "SEMI_ROUNDED",
  padding: "STANDARD",
  borderColor: "#EDEEFA"
)`}
            </pre>
          </div>
        </CardLayout>

        {/* Stamp Component Demo */}
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
            text="Stamp Component"
            size="LARGE"
            headingTag="H2"
            marginBelow="STANDARD"
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Basic Stamps with Icons
              </h3>
              <div className="flex gap-4 items-center">
                <StampField
                  backgroundColor="ACCENT"
                  icon="star"
                  contentColor="STANDARD"
                  tooltip="Favorite"
                />
                <StampField
                  backgroundColor="POSITIVE"
                  icon="home"
                  contentColor="STANDARD"
                  tooltip="Home"
                />
                <StampField
                  backgroundColor="NEGATIVE"
                  icon="briefcase"
                  contentColor="STANDARD"
                  tooltip="Work"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transparent Background
              </h3>
              <div className="flex gap-4 items-center">
                <StampField
                  backgroundColor="TRANSPARENT"
                  icon="home"
                  contentColor="POSITIVE"
                  tooltip="Home (Transparent)"
                />
                <StampField
                  backgroundColor="TRANSPARENT"
                  icon="star"
                  contentColor="ACCENT"
                  tooltip="Star (Transparent)"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Text Stamps
              </h3>
              <div className="flex gap-4 items-center">
                <StampField
                  backgroundColor="#cc0000"
                  text="1"
                  align="CENTER"
                />
                <StampField
                  backgroundColor="#cc0000"
                  text="2"
                  align="CENTER"
                />
                <StampField
                  backgroundColor="#cc0000"
                  text="3"
                  align="CENTER"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Size Variations
              </h3>
              <div className="flex gap-4 items-center">
                <StampField
                  icon="star"
                  size="TINY"
                  backgroundColor="ACCENT"
                  tooltip="Tiny"
                />
                <StampField
                  icon="star"
                  size="SMALL"
                  backgroundColor="ACCENT"
                  tooltip="Small"
                />
                <StampField
                  icon="star"
                  size="MEDIUM"
                  backgroundColor="ACCENT"
                  tooltip="Medium"
                />
                <StampField
                  icon="star"
                  size="LARGE"
                  backgroundColor="ACCENT"
                  tooltip="Large"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Shape Variations
              </h3>
              <div className="flex gap-4 items-center">
                <StampField
                  icon="star"
                  shape="SQUARED"
                  backgroundColor="ACCENT"
                  tooltip="Squared"
                />
                <StampField
                  icon="star"
                  shape="SEMI_ROUNDED"
                  backgroundColor="ACCENT"
                  tooltip="Semi Rounded"
                />
                <StampField
                  icon="star"
                  shape="ROUNDED"
                  backgroundColor="ACCENT"
                  tooltip="Rounded (Default)"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                With Labels and Instructions
              </h3>
              <StampField
                label="Priority Level"
                instructions="Indicates the urgency of this item"
                labelPosition="ABOVE"
                icon="star"
                text="7"
                size="LARGE"
                backgroundColor="NEGATIVE"
                helpTooltip="High priority items require immediate attention"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-sm">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              SAIL Translation:
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!stampField(
  label: "Priority Level",
  backgroundColor: "ACCENT",
  icon: "star",
  contentColor: "STANDARD",
  size: "MEDIUM"
)`}
            </pre>
          </div>
        </CardLayout>

        {/* TextField Component Demo */}
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
            text="Text Field Component"
            size="LARGE"
            headingTag="H2"
            marginBelow="STANDARD"
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Basic Text Input
              </h3>
              <TextField
                label="Email Address"
                placeholder="user@example.com"
                value={email}
                saveInto={(value) => setEmail(value)}
                required
                validations={emailValidations}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Text Field with Character Limit
              </h3>
              <TextField
                label="Phone Number"
                instructions="Include only dashes and numbers. For example, 555-456-7890."
                value={phoneNumber}
                saveInto={(value) => setPhoneNumber(value)}
                characterLimit={12}
                showCharacterCount
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Masked Text Field (Password)
              </h3>
              <TextField
                label="Password"
                masked
                placeholder="Enter password"
                value={password}
                saveInto={(value) => setPassword(value)}
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Read-Only Display
              </h3>
              <TextField
                label="Title"
                value="Expenses could not be submitted"
                readOnly
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Adjacent Label Position
              </h3>
              <TextField
                label="First Name"
                labelPosition="ADJACENT"
                value={firstName}
                saveInto={(value) => setFirstName(value)}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Right Aligned (for Grid Layout)
              </h3>
              <TextField
                label="Amount"
                value="$1,234.56"
                align="RIGHT"
                readOnly
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                With Help Tooltip
              </h3>
              <TextField
                label="Username"
                instructions="Choose a unique username for your account"
                helpTooltip="Your username must be 3-20 characters long and contain only letters, numbers, and underscores"
                placeholder="username"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-sm">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
              SAIL Translation:
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!textField(
  label: "Email Address",
  placeholder: "user@example.com",
  value: local!email,
  saveInto: local!email,
  required: true
)`}
            </pre>
          </div>
        </CardLayout>

        {/* Checkbox Component Demo */}
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

        {/* Image Component Demo */}
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
            text="Image Component"
            size="LARGE"
            headingTag="H2"
            marginBelow="STANDARD"
          />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Basic Document Images (Medium Size)
              </h3>
              <ImageField
                label="Project Screenshots"
                instructions="Sample images from the project"
                images={[
                  { document: "vite.svg", altText: "Vite logo", caption: "Vite build tool logo" },
                  { document: "vite.svg", altText: "Another Vite logo", caption: "Second image example" }
                ]}
                size="MEDIUM"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Small Icons
              </h3>
              <ImageField
                label="Status Icons"
                images={[
                  { document: "vite.svg", altText: "Status icon 1" },
                  { document: "vite.svg", altText: "Status icon 2" },
                  { document: "vite.svg", altText: "Status icon 3" }
                ]}
                size="ICON_PLUS"
                align="START"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Avatar Style (Circular)
              </h3>
              <ImageField
                label="Team Members"
                images={[
                  { document: "vite.svg", altText: "Team member 1", caption: "John Doe" },
                  { document: "vite.svg", altText: "Team member 2", caption: "Jane Smith" },
                  { document: "vite.svg", altText: "Team member 3", caption: "Bob Johnson" }
                ]}
                size="SMALL_PLUS"
                style="AVATAR"
                align="CENTER"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gallery Layout
              </h3>
              <ImageField
                label="Image Gallery"
                instructions="Horizontal gallery layout"
                images={[
                  { document: "vite.svg", altText: "Gallery image 1" },
                  { document: "vite.svg", altText: "Gallery image 2" },
                  { document: "vite.svg", altText: "Gallery image 3" },
                  { document: "vite.svg", altText: "Gallery image 4" }
                ]}
                size="GALLERY"
                align="CENTER"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Large Images with Fit Size
              </h3>
              <ImageField
                label="Hero Images"
                images={[
                  { document: "vite.svg", altText: "Hero image", caption: "Main banner image" }
                ]}
                size="FIT"
                align="CENTER"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Adjacent Label Position
              </h3>
              <ImageField
                label="Profile Picture"
                labelPosition="ADJACENT"
                images={[
                  { document: "uifaces-human-avatar.jpg", altText: "Profile picture", caption: "User avatar" }
                ]}
                size="MEDIUM"
                style="AVATAR"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Images (Within ImageField)
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                User images use Radix Avatar for automatic fallback handling (user initials or default icon).
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">User with Photo</p>
                  <ImageField
                    labelPosition="COLLAPSED"
                    images={[
                      {
                        imageType: 'user',
                        user: { name: "Jane Smith", photoUrl: "uifaces-human-avatar.jpg", initials: "JS" },
                        altText: "Jane Smith profile photo",
                        caption: "Click to view profile"
                      }
                    ]}
                    style="AVATAR"
                    size="MEDIUM"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Fallback to Initials (Multiple Sizes)</p>
                  <ImageField
                    labelPosition="COLLAPSED"
                    images={[
                      {
                        imageType: 'user',
                        user: { name: "Jane Doe", initials: "JD" }
                      },
                      {
                        imageType: 'user',
                        user: { name: "Bob Johnson", initials: "BJ" }
                      },
                      {
                        imageType: 'user',
                        user: { name: "Alice Williams", initials: "AW" }
                      }
                    ]}
                    style="AVATAR"
                    size="TINY"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Fallback to Default Icon (No Initials)</p>
                  <ImageField
                    labelPosition="COLLAPSED"
                    images={[
                      {
                        imageType: 'user',
                        user: { name: "Anonymous User" }
                      }
                    ]}
                    style="AVATAR"
                    size="SMALL"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              SAIL Translation Example
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!imageField(
  label: "Project Screenshots",
  instructions: "Sample images from the project",
  images: {
    a!documentImage(
      document: cons!PROJECT_SCREENSHOT_1,
      altText: "Main dashboard view",
      caption: "Dashboard showing key metrics"
    ),
    a!documentImage(
      document: cons!PROJECT_SCREENSHOT_2,
      altText: "Settings panel",
      caption: "User configuration options"
    )
  },
  size: "MEDIUM"
)`}
            </pre>
          </div>
        </CardLayout>

        {/* Radio Button Component Demo */}
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

        {/* Dropdown Component Demo */}
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

        {/* Switch Component Demo (NEW SAIL) */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="ACCENT"
        >
          <div className="flex items-center gap-2 mb-4">
            <HeadingField
              text="Switch Component"
              size="LARGE"
              headingTag="H2"
              marginBelow="NONE"
            />
            <TagField
              tags={[{ text: "NEW SAIL", backgroundColor: "#9333EA", textColor: "#FFFFFF" }]}
              size="SMALL"
            />
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Not available in public SAIL - this is a "new SAIL" component following the same patterns and conventions.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Basic Switches
              </h3>
              <div className="space-y-4">
                <SwitchField
                  label="Enable Notifications"
                  instructions="Receive email and push notifications for updates"
                  value={notificationsEnabled}
                  saveInto={(value) => setNotificationsEnabled(value)}
                />

                <SwitchField
                  label="Dark Mode"
                  value={darkModeEnabled}
                  saveInto={(value) => setDarkModeEnabled(value)}
                />

                <SwitchField
                  label="Auto-save"
                  instructions="Automatically save changes every 30 seconds"
                  value={autoSaveEnabled}
                  saveInto={(value) => setAutoSaveEnabled(value)}
                  color="POSITIVE"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Size Variations
              </h3>
              <div className="space-y-4">
                <SwitchField
                  label="Small Switch"
                  value={true}
                  size="SMALL"
                />
                <SwitchField
                  label="Standard Switch"
                  value={true}
                  size="STANDARD"
                />
                <SwitchField
                  label="Medium Switch"
                  value={true}
                  size="MEDIUM"
                />
                <SwitchField
                  label="Large Switch"
                  value={true}
                  size="LARGE"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Color Options
              </h3>
              <div className="space-y-4">
                <SwitchField
                  label="ACCENT (Blue)"
                  value={true}
                  color="ACCENT"
                />
                <SwitchField
                  label="POSITIVE (Green)"
                  value={true}
                  color="POSITIVE"
                />
                <SwitchField
                  label="NEGATIVE (Red)"
                  value={true}
                  color="NEGATIVE"
                />
                <SwitchField
                  label="Custom Hex Color"
                  value={true}
                  color="#9333EA"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                States
              </h3>
              <div className="space-y-4">
                <SwitchField
                  label="Disabled (Off)"
                  value={false}
                  disabled
                />
                <SwitchField
                  label="Disabled (On)"
                  value={true}
                  disabled
                />
                <SwitchField
                  label="Adjacent Label Position"
                  labelPosition="ADJACENT"
                  value={true}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-sm">
            <h4 className="text-xs font-semibold text-purple-900 mb-1">
              Imagined SAIL Translation (not real SAIL):
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!switchField(
  label: "Enable Notifications",
  instructions: "Receive email and push notifications",
  value: local!notificationsEnabled,
  saveInto: local!notificationsEnabled,
  color: "ACCENT"
)`}
            </pre>
          </div>
        </CardLayout>

        {/* Toggle Component Demo (NEW SAIL) */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="POSITIVE"
        >
          <div className="flex items-center gap-2 mb-4">
            <HeadingField
              text="Toggle Component"
              size="LARGE"
              headingTag="H2"
              marginBelow="NONE"
            />
            <TagField
              tags={[{ text: "NEW SAIL", backgroundColor: "#9333EA", textColor: "#FFFFFF" }]}
              size="SMALL"
            />
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Not available in public SAIL - button-style toggle for pressed/unpressed states (e.g., toolbar buttons, filters).
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Basic Toggles
              </h3>
              <div className="space-y-4">
                <ToggleField
                  label="Text Formatting"
                  text="Bold"
                  value={boldToggled}
                  saveInto={(value) => setBoldToggled(value)}
                  style="OUTLINE"
                />

                <ToggleField
                  label="Italic"
                  text="Italic"
                  value={italicToggled}
                  saveInto={(value) => setItalicToggled(value)}
                  style="OUTLINE"
                />

                <ToggleField
                  label="Favorite"
                  text="Add to Favorites"
                  icon="star"
                  value={favoriteToggled}
                  saveInto={(value) => setFavoriteToggled(value)}
                  color="ACCENT"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Style Variations
              </h3>
              <div className="space-y-4">
                <ToggleField
                  label="SOLID Style"
                  text="Toggle Me"
                  value={solidToggled}
                  saveInto={(value) => setSolidToggled(value)}
                  style="SOLID"
                  color="ACCENT"
                />
                <ToggleField
                  label="OUTLINE Style"
                  text="Toggle Me"
                  value={outlineToggled}
                  saveInto={(value) => setOutlineToggled(value)}
                  style="OUTLINE"
                  color="ACCENT"
                />
                <ToggleField
                  label="GHOST Style"
                  text="Toggle Me"
                  value={ghostToggled}
                  saveInto={(value) => setGhostToggled(value)}
                  style="GHOST"
                  color="ACCENT"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                With Icons
              </h3>
              <div className="space-y-4">
                <ToggleField
                  label="Icon at START"
                  text="Filter"
                  icon="filter"
                  iconPosition="START"
                  value={filterToggled}
                  saveInto={(value) => setFilterToggled(value)}
                  style="OUTLINE"
                />
                <ToggleField
                  label="Icon at END"
                  text="Search"
                  icon="arrow-right"
                  iconPosition="END"
                  value={searchToggled}
                  saveInto={(value) => setSearchToggled(value)}
                  style="OUTLINE"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Color Options
              </h3>
              <div className="space-y-4">
                <ToggleField
                  label="ACCENT"
                  text="Accent Color"
                  value={accentToggled}
                  saveInto={(value) => setAccentToggled(value)}
                  color="ACCENT"
                  style="OUTLINE"
                />
                <ToggleField
                  label="POSITIVE"
                  text="Positive Color"
                  value={positiveToggled}
                  saveInto={(value) => setPositiveToggled(value)}
                  color="POSITIVE"
                  style="OUTLINE"
                />
                <ToggleField
                  label="NEGATIVE"
                  text="Negative Color"
                  value={negativeToggled}
                  saveInto={(value) => setNegativeToggled(value)}
                  color="NEGATIVE"
                  style="OUTLINE"
                />
                <ToggleField
                  label="SECONDARY"
                  text="Secondary Color"
                  value={secondaryToggled}
                  saveInto={(value) => setSecondaryToggled(value)}
                  color="SECONDARY"
                  style="OUTLINE"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Disabled State
              </h3>
              <ToggleField
                label="Disabled Toggle"
                text="Can't Click Me"
                value={true}
                disabled
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-sm">
            <h4 className="text-xs font-semibold text-purple-900 mb-1">
              Imagined SAIL Translation (not real SAIL):
            </h4>
            <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!toggleField(
  label: "Favorite",
  text: "Add to Favorites",
  icon: "star",
  value: local!favoriteToggled,
  saveInto: local!favoriteToggled,
  style: "OUTLINE",
  color: "ACCENT"
)`}
            </pre>
          </div>
        </CardLayout>

        {/* Slider Component Demo (NEW SAIL) */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="MORE"
          marginBelow="MORE"
          showBorder={true}
          borderColor="#EDEEFA"
          decorativeBarPosition="TOP"
          decorativeBarColor="POSITIVE"
        >
          <div className="flex items-center gap-2 mb-4">
            <HeadingField
              text="Slider Component"
              size="MEDIUM"
              headingTag="H2"
              color="STANDARD"
              marginBelow="NONE"
            />
            <TagField
              tags={[{ text: "NEW SAIL", backgroundColor: "#9333EA", textColor: "#FFFFFF" }]}
              size="SMALL"
            />
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Not available in public SAIL - this is a "new SAIL" component following the same patterns and conventions.
          </p>

          <div className="space-y-6">
            {/* Single Value Slider */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Single Value Slider</h3>
              <div className="space-y-4">
                <SliderField
                  label="Volume Level"
                  instructions="Adjust the audio volume"
                  value={volumeLevel}
                  min={0}
                  max={100}
                  step={1}
                  saveInto={(value) => setVolumeLevel(value as number)}
                  showValue={true}
                  formatValue={(val) => `${val}%`}
                  color="ACCENT"
                  size="STANDARD"
                />

                <SliderField
                  label="Brightness"
                  instructions="Control screen brightness"
                  value={brightness}
                  min={0}
                  max={100}
                  step={5}
                  saveInto={(value) => setBrightness(value as number)}
                  showValue={true}
                  formatValue={(val) => `${val}%`}
                  color="POSITIVE"
                  size="MEDIUM"
                />
              </div>
            </div>

            {/* Range Slider */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Range Slider</h3>
              <div className="space-y-4">
                <SliderField
                  label="Price Range"
                  instructions="Select your budget range"
                  value={priceRange}
                  min={0}
                  max={100}
                  step={1}
                  saveInto={(value) => setPriceRange(value as number[])}
                  showValue={true}
                  formatValue={(val) => `$${val}`}
                  color="ACCENT"
                  size="STANDARD"
                />

                <SliderField
                  label="Temperature Range"
                  instructions="Set comfortable temperature range"
                  value={temperatureRange}
                  min={60}
                  max={80}
                  step={1}
                  saveInto={(value) => setTemperatureRange(value as number[])}
                  showValue={true}
                  formatValue={(val) => `${val}°F`}
                  color="NEGATIVE"
                  size="STANDARD"
                />
              </div>
            </div>

            {/* Vertical Slider */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Vertical Slider</h3>
              <SliderField
                label="Vertical Volume"
                instructions="Vertical orientation example"
                value={volumeLevel}
                min={0}
                max={100}
                step={1}
                saveInto={(value) => setVolumeLevel(value as number)}
                showValue={true}
                formatValue={(val) => `${val}%`}
                color="ACCENT"
                size="STANDARD"
                orientation="VERTICAL"
              />
            </div>

            {/* Size Variations */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Size Variations</h3>
              <div className="space-y-4">
                <SliderField
                  label="Small Slider"
                  value={50}
                  min={0}
                  max={100}
                  saveInto={() => {}}
                  size="SMALL"
                  color="ACCENT"
                />
                <SliderField
                  label="Standard Slider"
                  value={50}
                  min={0}
                  max={100}
                  saveInto={() => {}}
                  size="STANDARD"
                  color="ACCENT"
                />
                <SliderField
                  label="Medium Slider"
                  value={50}
                  min={0}
                  max={100}
                  saveInto={() => {}}
                  size="MEDIUM"
                  color="ACCENT"
                />
                <SliderField
                  label="Large Slider"
                  value={50}
                  min={0}
                  max={100}
                  saveInto={() => {}}
                  size="LARGE"
                  color="ACCENT"
                />
              </div>
            </div>

            {/* Color Variations */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Color Variations</h3>
              <div className="space-y-4">
                <SliderField
                  label="Accent Color"
                  value={50}
                  min={0}
                  max={100}
                  saveInto={() => {}}
                  color="ACCENT"
                />
                <SliderField
                  label="Positive Color"
                  value={50}
                  min={0}
                  max={100}
                  saveInto={() => {}}
                  color="POSITIVE"
                />
                <SliderField
                  label="Negative Color"
                  value={50}
                  min={0}
                  max={100}
                  saveInto={() => {}}
                  color="NEGATIVE"
                />
                <SliderField
                  label="Custom Hex Color"
                  value={50}
                  min={0}
                  max={100}
                  saveInto={() => {}}
                  color="#9333EA"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">SAIL Translation</h4>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{`// React Prototype
<SliderField
  label: "Volume Level",
  instructions: "Adjust the audio volume",
  value: local!volumeLevel,
  min: 0,
  max: 100,
  step: 1,
  saveInto: local!volumeLevel,
  showValue: true,
  color: "ACCENT"
/>

// SAIL Production (hypothetical - not available in current SAIL)
a!sliderField(
  label: "Volume Level",
  instructions: "Adjust the audio volume",
  value: local!volumeLevel,
  min: 0,
  max: 100,
  step: 1,
  saveInto: local!volumeLevel,
  showValue: true,
  color: "ACCENT"
)`}
            </pre>
          </div>
        </CardLayout>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
