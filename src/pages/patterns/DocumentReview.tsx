import { CardLayout } from '../../components/Card/CardLayout'
import { HeadingField } from '../../components/Heading/HeadingField'
import { TagField } from '../../components/Tag/TagField'
import { ButtonArrayLayout } from '../../components/Button/ButtonArrayLayout'
import { MessageBanner } from '../../components/MessageBanner/MessageBanner'
import { RichTextDisplayField } from '../../components/RichText/RichTextDisplayField'
import { TextItem } from '../../components/RichText/TextItem'

/**
 * Document Review Interface
 * Demonstrates: Complex layouts with metadata, review workflows
 */
export const DocumentReview = () => {
  return (
    <div className='bg-gray-50'>
      <div className="p-6 min-h-screen max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <HeadingField
            text="Contract Review"
            size="LARGE_PLUS"
            headingTag="H1"
            marginBelow="LESS"
          />
          <RichTextDisplayField
            value={[
              <TextItem key="1" text="Document ID: " size="SMALL" color="SECONDARY" />,
              <TextItem key="2" text="DOC-2024-3847" size="SMALL" style="STRONG" />
            ]}
          />
        </div>
        <TagField
          tags={[{ text: "REQUIRES APPROVAL", backgroundColor: "NEGATIVE" }]}
          size="SMALL"
        />
      </div>

      <MessageBanner
        primaryText="Action Required"
        secondaryText="This document requires your review and approval by March 20, 2024"
        backgroundColor="ERROR"
        highlightColor="NEGATIVE"
        icon="error"
        marginBelow="MORE"
      />

      {/* Document Info */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="ACCENT"
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Document Information"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <RichTextDisplayField
              label="Document Name"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="Vendor Service Agreement - Acme Corp" style="STRONG" />
              ]}
              marginBelow="STANDARD"
            />

            <RichTextDisplayField
              label="Document Type"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="Master Service Agreement (MSA)" />
              ]}
              marginBelow="STANDARD"
            />

            <RichTextDisplayField
              label="Version"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="3.2 (Draft)" style="STRONG" />
              ]}
              marginBelow="STANDARD"
            />
          </div>

          <div>
            <RichTextDisplayField
              label="Submitted By"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="Michael Chen" style="STRONG" />,
                <TextItem key="2" text=" - " />,
                <TextItem key="3" text="Procurement Department" size="SMALL" color="SECONDARY" />
              ]}
              marginBelow="STANDARD"
            />

            <RichTextDisplayField
              label="Submitted Date"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="March 14, 2024 at 3:45 PM" />
              ]}
              marginBelow="STANDARD"
            />

            <RichTextDisplayField
              label="Contract Value"
              labelPosition="ABOVE"
              value={[
                <TextItem key="1" text="$2,500,000" size="MEDIUM" style="STRONG" color="ACCENT" />,
                <TextItem key="2" text=" over 3 years" size="SMALL" />
              ]}
              marginBelow="STANDARD"
            />
          </div>
        </div>

        <TagField
          label="Categories"
          labelPosition="ABOVE"
          tags={[
            { text: "Procurement", backgroundColor: "ACCENT" },
            { text: "Legal Review", backgroundColor: "NEGATIVE" },
            { text: "High Value", backgroundColor: "POSITIVE" }
          ]}
          size="SMALL"
        />
      </CardLayout>

      {/* Review Summary */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Review Summary"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <RichTextDisplayField
          label="Executive Summary"
          labelPosition="ABOVE"
          value={[
            <TextItem
              key="1"
              text="This Master Service Agreement establishes terms for cloud infrastructure services with Acme Corporation. The agreement includes standard terms for service levels, data protection, and termination clauses. Key changes from version 3.1 include updated pricing structure and extended support hours."
            />
          ]}
          marginBelow="STANDARD"
        />

        <div className="grid grid-cols-3 gap-4 mb-4">
          <CardLayout
            style='#EDF7EE'
            showBorder={false}
            height='AUTO'
            marginBelow='NONE'
          >
            <HeadingField
              text="8"
              size="LARGE"
              color="POSITIVE"
              fontWeight="BOLD"
              align="CENTER"
              marginBelow="LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="Approved Sections" size="SMALL" style="STRONG" />
              ]}
              align="CENTER"
            />
          </CardLayout>

          <CardLayout
            style='#FFFBED'
            showBorder={false}
            height='AUTO'
            marginBelow='NONE'
          >
            <HeadingField
              text="3"
              size="LARGE"
              fontWeight="BOLD"
              align="CENTER"
              marginBelow="LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="Sections with Comments" size="SMALL" style="STRONG" />
              ]}
              align="CENTER"
            />
          </CardLayout>

          <CardLayout
            style='#FCE6EB'
            showBorder={false}
            height='AUTO'
            marginBelow='NONE'
          >
            <HeadingField
              text="1"
              size="LARGE"
              color="NEGATIVE"
              fontWeight="BOLD"
              align="CENTER"
              marginBelow="LESS"
            />
            <RichTextDisplayField
              value={[
                <TextItem key="1" text="Sections Requiring Changes" size="SMALL" style="STRONG" />
              ]}
              align="CENTER"
            />
          </CardLayout>
        </div>
      </CardLayout>

      {/* Previous Reviews */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Review History"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <div className="space-y-4">
          {/* Review 1 */}
          <CardLayout 
            showBorder={false}
            style='#FAFAFA'
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <RichTextDisplayField
                  value={[
                    <TextItem key="1" text="Jennifer Adams" style="STRONG" />,
                    <TextItem key="2" text=" - Legal Department" size="SMALL" color="SECONDARY" />
                  ]}
                  marginBelow="EVEN_LESS"
                />
                <RichTextDisplayField
                  value={[
                    <TextItem key="1" text="Reviewed on March 15, 2024 at 10:30 AM" size="SMALL" color="SECONDARY" />
                  ]}
                />
              </div>
              <TagField
                tags={[{ text: "Approved with Comments" }]}
                size="SMALL"
              />
            </div>
            <RichTextDisplayField
              value={[
                <TextItem
                  key="1"
                  text="Overall structure looks good. Section 7.3 (Liability Cap) needs clarification on indirect damages. Recommend adding specific language around data breach notification timelines."
                />
              ]}
            />
          </CardLayout>

          {/* Review 2 */}
          <CardLayout 
            showBorder={false}
            style='#FAFAFA'
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <RichTextDisplayField
                  value={[
                    <TextItem key="1" text="Robert Kim" style="STRONG" />,
                    <TextItem key="2" text=" - Finance Department" size="SMALL" color="SECONDARY" />
                  ]}
                  marginBelow="EVEN_LESS"
                />
                <RichTextDisplayField
                  value={[
                    <TextItem key="1" text="Reviewed on March 15, 2024 at 2:15 PM" size="SMALL" color="SECONDARY" />
                  ]}
                />
              </div>
              <TagField
                tags={[{ text: "Approved", backgroundColor: "POSITIVE" }]}
                size="SMALL"
              />
            </div>
            <RichTextDisplayField
              value={[
                <TextItem
                  key="1"
                  text="Payment terms are acceptable. Pricing structure aligns with budget. Net-30 payment terms approved."
                />
              ]}
            />
          </CardLayout>
        </div>
      </CardLayout>

      {/* Action Buttons */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
      >
        <HeadingField
          text="Your Review"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <MessageBanner
          primaryText="Complete your review to move this document forward"
          backgroundColor="INFO"
          highlightColor="INFO"
          marginBelow="MORE"
        />

        <ButtonArrayLayout
          buttons={[
            { label: "Approve Document", style: "SOLID", color: "ACCENT", size: "STANDARD" },
            { label: "Request Changes", style: "OUTLINE", color: "NEGATIVE", size: "STANDARD" },
            { label: "Add Comments", style: "OUTLINE", color: "ACCENT", size: "STANDARD" },
            { label: "Download PDF", style: "GHOST", color: "SECONDARY", size: "STANDARD" }
          ]}
          align="START"
        />
      </CardLayout>
    </div>
    </div>
  )
}
export default DocumentReview
