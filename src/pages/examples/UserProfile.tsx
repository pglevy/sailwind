import {
  CardLayout,
  HeadingField,
  TagField,
  ButtonArrayLayout,
  RichTextDisplayField,
  TextItem,
  Icon,
  ProgressBar,
  ImageField
} from '../../components'

/**
 * User Profile Page
 * Demonstrates: Profile layouts, skill metrics, activity tracking
 */
export const UserProfile = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto">
      {/* Header Section */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <div className="flex gap-6 items-start">
          {/* User Avatar */}
          <ImageField
            labelPosition="COLLAPSED"
            images={[
              {
                imageType: 'user',
                user: {
              name: "Sarah Johnson",
              initials: "SJ",
              photoUrl: "uifaces-human-avatar.jpg"
                },
                altText: "Sarah Johnson profile photo"
              }
            ]}
            style="AVATAR"
            size="MEDIUM"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <HeadingField
                  text="Sarah Johnson"
                  size="LARGE"
                  headingTag="H1"
                  marginBelow="EVEN_LESS"
                />
                <RichTextDisplayField
                  value={[
                    <TextItem key="1" text="Senior Product Manager" size="MEDIUM" color="SECONDARY" />
                  ]}
                  marginBelow="LESS"
                />
              </div>
              <TagField
                tags={[{ text: "ACTIVE", backgroundColor: "POSITIVE" }]}
                size="SMALL"
              />
            </div>

            <div className="flex gap-6 mb-3">
              <RichTextDisplayField
                value={[
                  <Icon key="1" icon="mail" size="SMALL" color="SECONDARY" />,
                  <TextItem key="2" text=" sarah.johnson@company.com" size="SMALL" />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <Icon key="1" icon="building-2" size="SMALL" color="SECONDARY" />,
                  <TextItem key="2" text=" Product Division" size="SMALL" />
                ]}
              />
              <RichTextDisplayField
                value={[
                  <Icon key="1" icon="map-pin" size="SMALL" color="SECONDARY" />,
                  <TextItem key="2" text=" San Francisco, CA" size="SMALL" />
                ]}
              />
            </div>

            <TagField
              tags={[
                { text: "Product Strategy", backgroundColor: "#EDEEFA", textColor: "#2322F0" },
                { text: "Team Lead", backgroundColor: "#E8F7F0", textColor: "#117C00" },
                { text: "Mentor", backgroundColor: "#FAF0FA", textColor: "#7D007D" }
              ]}
              size="SMALL"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <ButtonArrayLayout
            buttons={[
              { label: "Edit Profile", style: "SOLID", color: "ACCENT", size: "STANDARD" },
              { label: "View Calendar", style: "OUTLINE", color: "ACCENT", size: "STANDARD" },
              { label: "Send Message", style: "GHOST", color: "SECONDARY", size: "STANDARD" }
            ]}
            align="START"
          />
        </div>
      </CardLayout>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* About Section */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="STANDARD"
          showBorder={true}
          decorativeBarPosition="TOP"
          decorativeBarColor="ACCENT"
        >
          <HeadingField
            text="About"
            size="MEDIUM_PLUS"
            headingTag="H2"
            fontWeight="BOLD"
            marginBelow="STANDARD"
          />

          <RichTextDisplayField
            label="Bio"
            labelPosition="ABOVE"
            value={[
              <TextItem
                key="1"
                text="Experienced product leader with 8+ years driving innovation in enterprise software. Passionate about user-centered design and cross-functional collaboration."
              />
            ]}
            marginBelow="STANDARD"
          />

          <div className="grid grid-cols-2 gap-4">
            <RichTextDisplayField
              label="Department"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="Product Division" style="STRONG" />
              ]}
              marginBelow="LESS"
            />

            <RichTextDisplayField
              label="Manager"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="David Martinez" style="STRONG" />
              ]}
              marginBelow="LESS"
            />

            <RichTextDisplayField
              label="Started"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="January 2021" style="STRONG" />
              ]}
              marginBelow="LESS"
            />

            <RichTextDisplayField
              label="Team Size"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="12 Direct Reports" style="STRONG" />
              ]}
              marginBelow="LESS"
            />
          </div>
        </CardLayout>

        {/* Contact Information */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="STANDARD"
          showBorder={true}
          decorativeBarPosition="TOP"
          decorativeBarColor="POSITIVE"
        >
          <HeadingField
            text="Contact Information"
            size="MEDIUM_PLUS"
            headingTag="H2"
            fontWeight="BOLD"
            marginBelow="STANDARD"
          />

          <RichTextDisplayField
            label="Email"
            labelPosition="ABOVE"
            value={[
              <TextItem key="1" text="sarah.johnson@company.com" color="ACCENT" />
            ]}
            marginBelow="STANDARD"
          />

          <RichTextDisplayField
            label="Phone"
            labelPosition="ABOVE"
            value={[
              <TextItem key="1" text="+1 (415) 555-0123" style="STRONG" />
            ]}
            marginBelow="STANDARD"
          />

          <RichTextDisplayField
            label="Office Location"
            labelPosition="ABOVE"
            value={[
              <TextItem key="1" text="Building A, Floor 3, Office 312" style="STRONG" />
            ]}
            marginBelow="STANDARD"
          />

          <RichTextDisplayField
            label="Working Hours"
            labelPosition="ABOVE"
            value={[
              <TextItem key="1" text="Monday - Friday, 9:00 AM - 5:00 PM PST" style="STRONG" />
            ]}
          />
        </CardLayout>
      </div>

      {/* Skills & Expertise */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Skills & Expertise"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ProgressBar
              label="Product Strategy"
              percentage={95}
              color="ACCENT"
              style="THIN"
              showPercentage={true}
              marginBelow="STANDARD"
            />

            <ProgressBar
              label="Agile Methodologies"
              percentage={90}
              color="ACCENT"
              style="THIN"
              showPercentage={true}
              marginBelow="STANDARD"
            />

            <ProgressBar
              label="User Research"
              percentage={85}
              color="ACCENT"
              style="THIN"
              showPercentage={true}
              marginBelow="STANDARD"
            />

            <ProgressBar
              label="Roadmap Planning"
              percentage={92}
              color="ACCENT"
              style="THIN"
              showPercentage={true}
            />
          </div>

          <div>
            <ProgressBar
              label="Stakeholder Management"
              percentage={88}
              color="POSITIVE"
              style="THIN"
              showPercentage={true}
              marginBelow="STANDARD"
            />

            <ProgressBar
              label="Data Analysis"
              percentage={78}
              color="POSITIVE"
              style="THIN"
              showPercentage={true}
              marginBelow="STANDARD"
            />

            <ProgressBar
              label="Team Leadership"
              percentage={93}
              color="POSITIVE"
              style="THIN"
              showPercentage={true}
              marginBelow="STANDARD"
            />

            <ProgressBar
              label="Technical Writing"
              percentage={82}
              color="POSITIVE"
              style="THIN"
              showPercentage={true}
            />
          </div>
        </div>
      </CardLayout>

      {/* Recent Activity */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Recent Activity"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <div className="space-y-4">
          <div className="flex gap-4 pb-4 border-b border-gray-200">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-sm flex items-center justify-center">
              <RichTextDisplayField
                value={[
                  <Icon key="1" icon="file-text" size="SMALL" color="ACCENT" />
                ]}
              />
            </div>
            <div className="flex-1">
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="Updated " />,
                  <TextItem key="2" text="Q2 Product Roadmap" style="STRONG" />
                ]}
                marginBelow="EVEN_LESS"
              />
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="2 hours ago" size="SMALL" color="SECONDARY" />
                ]}
              />
            </div>
            <TagField
              tags={[{ text: "Roadmap", backgroundColor: "ACCENT" }]}
              size="SMALL"
            />
          </div>

          <div className="flex gap-4 pb-4 border-b border-gray-200">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-sm flex items-center justify-center">
              <RichTextDisplayField
                value={[
                  <Icon key="1" icon="check-circle" size="SMALL" color="POSITIVE" />
                ]}
              />
            </div>
            <div className="flex-1">
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="Completed " />,
                  <TextItem key="2" text="User Research Analysis" style="STRONG" />
                ]}
                marginBelow="EVEN_LESS"
              />
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="Yesterday at 4:30 PM" size="SMALL" color="SECONDARY" />
                ]}
              />
            </div>
            <TagField
              tags={[{ text: "Research", backgroundColor: "POSITIVE" }]}
              size="SMALL"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-sm flex items-center justify-center">
              <RichTextDisplayField
                value={[
                  <Icon key="1" icon="users" size="SMALL" />
                ]}
              />
            </div>
            <div className="flex-1">
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="Attended " />,
                  <TextItem key="2" text="Product Strategy Meeting" style="STRONG" />
                ]}
                marginBelow="EVEN_LESS"
              />
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="March 14 at 10:00 AM" size="SMALL" color="SECONDARY" />
                ]}
              />
            </div>
            <TagField
              tags={[{ text: "Meeting", backgroundColor: "SECONDARY" }]}
              size="SMALL"
            />
          </div>
        </div>
      </CardLayout>

      {/* Certifications */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
      >
        <HeadingField
          text="Certifications & Achievements"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-sm border-2 border-blue-500">
            <RichTextDisplayField
              value={[
                <Icon key="1" icon="award" size="MEDIUM" color="ACCENT" />
              ]}
              align="CENTER"
              marginBelow="LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="Certified Scrum Product Owner" style="STRONG" size="SMALL" />
              ]}
              align="CENTER"
              marginBelow="EVEN_LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="2023" size="SMALL" color="SECONDARY" />
              ]}
              align="CENTER"
            />
          </div>

          <div className="p-4 bg-green-50 rounded-sm border-2 border-green-700">
            <RichTextDisplayField
              value={[
                <Icon key="1" icon="award" size="MEDIUM" color="POSITIVE" />
              ]}
              align="CENTER"
              marginBelow="LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="Excellence in Leadership" style="STRONG" size="SMALL" />
              ]}
              align="CENTER"
              marginBelow="EVEN_LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="2023" size="SMALL" color="SECONDARY" />
              ]}
              align="CENTER"
            />
          </div>

          <div className="p-4 bg-purple-50 rounded-sm border-2 border-purple-500">
            <RichTextDisplayField
              value={[
                <Icon key="1" icon="award" size="MEDIUM" />
              ]}
              align="CENTER"
              marginBelow="LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="Product Management Certificate" style="STRONG" size="SMALL" />
              ]}
              align="CENTER"
              marginBelow="EVEN_LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="2022" size="SMALL" color="SECONDARY" />
              ]}
              align="CENTER"
            />
          </div>
        </div>
      </CardLayout>
    </div>
  )
}
export default UserProfile
