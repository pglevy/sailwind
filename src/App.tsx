import { useState } from 'react'
import { TagField, ButtonWidget, CardLayout, ButtonArrayLayout, MessageBanner, ProgressBar, HeadingField, RichTextDisplayField, TextItem, Icon, StampField, TextField, CheckboxField, RadioButtonField } from './components'
import { TaskDashboard, ApplicationStatus, DocumentReview, UserProfile } from './vibes'

type ViewMode = 'components' | 'task-dashboard' | 'application-status' | 'document-review' | 'user-profile'

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
          </div>
        </div>
      )}
    </div>
  )
}

export default App
