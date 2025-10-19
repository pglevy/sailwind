import {
  CardLayout,
  HeadingField,
  RichTextDisplayField,
  TextItem,
  TextField,
  DropdownField,
  CheckboxField,
  ButtonArrayLayout,
  ImageField,
} from '../../components'

/**
 * ESG World 2023 Conference Registration Portal
 *
 * A multi-lingual conference registration form with:
 * - Language selection links
 * - Form fields for personal details (name, email, country, organization, job title)
 * - Multi-select checkboxes for topic interests
 * - Clean, accessible layout with appropriate spacing
 */
export default function ESGConferenceRegistration() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f6f0' }}>
      {/* Top spacer for header area */}
      <div className="h-24" />

      {/* Main content - centered wide column */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-12 gap-12">
          {/* Left column - Logo and language selection */}
          <div className="col-span-12 lg:col-span-4">
            {/* Logo */}
            <div className="mb-6 max-w-md">
              <ImageField
                labelPosition="COLLAPSED"
                images={[
                  {
                    document: '/esg_world_logo_no_year.png',
                    altText: 'ESG World 2023 Logo'
                  }
                ]}
                size="FIT"
              />
            </div>

            {/* Description */}
            <RichTextDisplayField
              value={[
                <TextItem text="ESG World 2023 is the most important global gathering of advocates and thought leaders on " />,
                <TextItem text="Environmental" style="STRONG" />,
                <TextItem text=", " />,
                <TextItem text="Social" style="STRONG" />,
                <TextItem text=", and " />,
                <TextItem text="Governance" style="STRONG" />,
                <TextItem text=" topics." />,
              ]}
            />

            {/* Language selection links */}
            <div className="mt-8 flex flex-col gap-0">
              <RichTextDisplayField
                value={[
                  <TextItem text="ENGLISH" link={() => {}} linkStyle="STANDALONE" color="#111111" style={['STRONG', 'UNDERLINE']} />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <TextItem text="简体中文" link={() => {}} linkStyle="STANDALONE" color="#111111" />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <TextItem text="हिन्दी" link={() => {}} linkStyle="STANDALONE" color="#111111" />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <TextItem text="ESPAÑOL" link={() => {}} linkStyle="STANDALONE" color="#111111" />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <TextItem text="FRANÇAIS" link={() => {}} linkStyle="STANDALONE" color="#111111" />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <TextItem text="العربية" link={() => {}} linkStyle="STANDALONE" color="#111111" />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <TextItem text="DEUTSCHE" link={() => {}} linkStyle="STANDALONE" color="#111111" />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <TextItem text="日本語" link={() => {}} linkStyle="STANDALONE" color="#111111" />
                ]}
              />
            </div>
          </div>

          {/* Right column - Registration form */}
          <div className="col-span-12 lg:col-span-8">
            <CardLayout showBorder={false} padding="STANDARD" style="TRANSPARENT">
              {/* Form header */}
              <div className="mb-6 pb-6 border-b border-gray-300">
                <HeadingField
                  text="REGISTER NOW"
                  size="LARGE_PLUS"
                  color="STANDARD"
                  fontWeight="BOLD"
                />
                <RichTextDisplayField
                  value={[
                    <TextItem text="Registration is free of charge for this year's virtual conference" />
                  ]}
                />
              </div>

              {/* Your Details section */}
              <div className="mb-6">
                <HeadingField
                  text="YOUR DETAILS"
                  size="MEDIUM"
                  color="STANDARD"
                  fontWeight="SEMI_BOLD"
                />

                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <TextField
                    label="First Name"
                    labelPosition="ABOVE"
                    placeholder=""
                  />
                  <TextField
                    label="Last Name"
                    labelPosition="ABOVE"
                    placeholder=""
                  />
                </div>

                {/* Email and Country */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <TextField
                    label="Email Address"
                    labelPosition="ABOVE"
                    placeholder=""
                  />
                  <DropdownField
                    label="Country"
                    labelPosition="ABOVE"
                    placeholder="--- Select country of residence ---"
                    choiceLabels={[
                      'United States',
                      'United Kingdom',
                      'Canada',
                      'Germany',
                      'France',
                      'Spain',
                      'Italy',
                      'Japan',
                      'China',
                      'India',
                      'Australia',
                      'Brazil',
                    ]}
                    choiceValues={[
                      'US', 'UK', 'CA', 'DE', 'FR', 'ES', 'IT', 'JP', 'CN', 'IN', 'AU', 'BR'
                    ]}
                  />
                </div>

                {/* Organization Name and Job Title */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <TextField
                    label="Organization Name"
                    labelPosition="ABOVE"
                    placeholder=""
                  />
                  <TextField
                    label="Job Title"
                    labelPosition="ABOVE"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Your Interests section */}
              <div style={{ backgroundColor: '#f2ede1' }} className="p-6 mt-6">
                <HeadingField
                  text="YOUR INTERESTS"
                  size="MEDIUM"
                  color="STANDARD"
                  fontWeight="SEMI_BOLD"
                />

                {/* Interests grid - 2 columns */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Climate change and carbon emissions']}
                    choiceValues={['climate']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Air and water pollution']}
                    choiceValues={['pollution']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Biodiversity']}
                    choiceValues={['biodiversity']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Deforestation']}
                    choiceValues={['deforestation']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Energy efficiency']}
                    choiceValues={['energy']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Water scarcity']}
                    choiceValues={['water']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Community relations']}
                    choiceValues={['community']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Gender and diversity']}
                    choiceValues={['diversity']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Data protection and privacy']}
                    choiceValues={['privacy']}
                  />
                  <CheckboxField
                    labelPosition="COLLAPSED"
                    choiceLabels={['Labor standards']}
                    choiceValues={['labor']}
                  />
                </div>
              </div>

              {/* Register button */}
              <div className="mt-6">
                <ButtonArrayLayout
                  buttons={[
                    {
                      label: 'REGISTER',
                      icon: 'arrow-right',
                      iconPosition: 'END',
                      style: 'SOLID',
                      color: 'ACCENT',
                      className: 'rounded-full text-black bg-yellow-500 hover:bg-yellow-600',
                    },
                  ]}
                  align="END"
                />
              </div>
            </CardLayout>
          </div>
        </div>
      </div>
    </div>
  )
}
