import { CardLayout } from '../components/Card/CardLayout'
import { HeadingField } from '../components/Heading/HeadingField'
import { TagField } from '../components/Tag/TagField'
import { ButtonArrayLayout } from '../components/Button/ButtonArrayLayout'
import { MessageBanner } from '../components/MessageBanner/MessageBanner'
import { RichTextDisplayField } from '../components/RichText/RichTextDisplayField'
import { TextItem } from '../components/RichText/TextItem'

/**
 * Application Status Page
 * Demonstrates: Message banners, status cards, rich text display
 */
export const ApplicationStatus = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto">
      <HeadingField
        text="Application #2024-0891"
        size="LARGE_PLUS"
        headingTag="H1"
        marginBelow="LESS"
      />

      <RichTextDisplayField
        value={[
          <TextItem key="1" text="Submitted on March 15, 2024 by " />,
          <TextItem key="2" text="Sarah Johnson" fontWeight="BOLD" />
        ]}
        marginBelow="MORE"
      />

      <MessageBanner
        primaryText="Application under review"
        secondaryText="Expected decision by March 22, 2024"
        backgroundColor="INFO"
        highlightColor="INFO"
        icon="info"
        marginBelow="MORE"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Status Summary Cards */}
        <CardLayout
          shape="SEMI_ROUNDED"
          padding="STANDARD"
          showBorder={true}
          borderColor="#EDEEFA"
        >
          <HeadingField
            text="Status"
            size="SMALL"
            color="SECONDARY"
            fontWeight="SEMI_BOLD"
            marginBelow="LESS"
          />
          <HeadingField
            text="Under Review"
            size="MEDIUM_PLUS"
            fontWeight="BOLD"
            marginBelow="LESS"
          />
          <TagField
            tags={[{ text: "ACTIVE", backgroundColor: "#FFF7E5", textColor: "#C77700" }]}
            size="SMALL"
          />
        </CardLayout>

        <CardLayout
          shape="SEMI_ROUNDED"
          padding="STANDARD"
          showBorder={true}
          borderColor="#EDEEFA"
        >
          <HeadingField
            text="Department"
            size="SMALL"
            color="SECONDARY"
            fontWeight="SEMI_BOLD"
            marginBelow="LESS"
          />
          <HeadingField
            text="Engineering"
            size="MEDIUM_PLUS"
            fontWeight="BOLD"
            marginBelow="LESS"
          />
          <TagField
            tags={[{ text: "Technology", backgroundColor: "ACCENT" }]}
            size="SMALL"
          />
        </CardLayout>

        <CardLayout
          shape="SEMI_ROUNDED"
          padding="STANDARD"
          showBorder={true}
          borderColor="#EDEEFA"
        >
          <HeadingField
            text="Assigned To"
            size="SMALL"
            color="SECONDARY"
            fontWeight="SEMI_BOLD"
            marginBelow="LESS"
          />
          <HeadingField
            text="Alex Martinez"
            size="MEDIUM_PLUS"
            fontWeight="BOLD"
            marginBelow="LESS"
          />
          <TagField
            tags={[{ text: "Senior Reviewer", backgroundColor: "SECONDARY" }]}
            size="SMALL"
          />
        </CardLayout>
      </div>

      {/* Application Details */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="ACCENT"
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Application Details"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <RichTextDisplayField
              label="Request Type"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="Budget Increase - Capital Expenditure" fontWeight="SEMI_BOLD" />
              ]}
              marginBelow="STANDARD"
            />
          </div>
          <div>
            <RichTextDisplayField
              label="Amount Requested"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="$125,000" fontSize="MEDIUM" fontWeight="BOLD" color="ACCENT" />
              ]}
              marginBelow="STANDARD"
            />
          </div>
        </div>

        <RichTextDisplayField
          label="Justification"
          labelPosition="ABOVE"
          value={[
            <TextItem
              key="1"
              text="Funds required to upgrade legacy infrastructure and implement new security protocols. This investment will reduce operational costs by 30% annually and improve system reliability."
            />
          ]}
          marginBelow="STANDARD"
        />

        <TagField
          label="Related Categories"
          labelPosition="ABOVE"
          tags={[
            { text: "Infrastructure", backgroundColor: "#EDEEFA", textColor: "#2322F0" },
            { text: "Security", backgroundColor: "#FED7DE", textColor: "#9F0019" },
            { text: "Cost Optimization", backgroundColor: "#E8F7F0", textColor: "#117C00" }
          ]}
          size="SMALL"
          marginBelow="MORE"
        />

        <ButtonArrayLayout
          buttons={[
            { label: "Download Application", style: "OUTLINE", color: "ACCENT", size: "STANDARD" },
            { label: "View Attachments", style: "GHOST", color: "SECONDARY", size: "STANDARD" }
          ]}
          align="START"
        />
      </CardLayout>

      {/* Review Timeline */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Review Timeline"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div className="flex-1">
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="Application Submitted" fontWeight="SEMI_BOLD" />
                ]}
                marginBelow="EVEN_LESS"
              />
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="March 15, 2024 at 2:30 PM" fontSize="SMALL" color="SECONDARY" />
                ]}
              />
            </div>
            <TagField
              tags={[{ text: "Complete", backgroundColor: "POSITIVE" }]}
              size="SMALL"
            />
          </div>

          <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <div className="flex-1">
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="Initial Review" fontWeight="SEMI_BOLD" />
                ]}
                marginBelow="EVEN_LESS"
              />
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="In progress - Started March 16, 2024" fontSize="SMALL" color="SECONDARY" />
                ]}
              />
            </div>
            <TagField
              tags={[{ text: "In Progress", backgroundColor: "#FFF7E5", textColor: "#C77700" }]}
              size="SMALL"
            />
          </div>

          <div className="flex items-start gap-3 pb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-700 text-sm font-bold">3</span>
            </div>
            <div className="flex-1">
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="Final Approval" fontWeight="SEMI_BOLD" />
                ]}
                marginBelow="EVEN_LESS"
              />
              <RichTextDisplayField
                value={[
                  <TextItem key="1" text="Pending" fontSize="SMALL" color="SECONDARY" />
                ]}
              />
            </div>
            <TagField
              tags={[{ text: "Pending", backgroundColor: "SECONDARY" }]}
              size="SMALL"
            />
          </div>
        </div>
      </CardLayout>

      <ButtonArrayLayout
        buttons={[
          { label: "Withdraw Application", style: "OUTLINE", color: "NEGATIVE", size: "STANDARD" },
          { label: "Contact Reviewer", style: "OUTLINE", color: "ACCENT", size: "STANDARD" },
          { label: "Back to Dashboard", style: "GHOST", color: "SECONDARY", size: "STANDARD" }
        ]}
        align="START"
      />
    </div>
  )
}
