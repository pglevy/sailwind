import { CardLayout } from "../../components/Card/CardLayout";
import { HeadingField } from "../../components/Heading/HeadingField";
import { TagField } from "../../components/Tag/TagField";
import { ButtonArrayLayout } from "../../components/Button/ButtonArrayLayout";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { MessageBanner } from "../../components/MessageBanner/MessageBanner";
import { RichTextDisplayField } from "../../components/RichText/RichTextDisplayField";
import { TextItem } from "../../components/RichText/TextItem";

/**
 * Task Management Dashboard
 * Demonstrates: Cards, headings, tags, buttons, progress bars
 */
export const TaskDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <HeadingField
        text="My Tasks"
        size="LARGE_PLUS"
        headingTag="H1"
        marginBelow="STANDARD"
      />

      <MessageBanner
        primaryText="3 tasks due today"
        secondaryText="Stay on track with your deliverables"
        backgroundColor="INFO"
        highlightColor="INFO"
        icon="info"
        marginBelow="MORE"
      />

      {/* High Priority Task */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <div className="flex justify-between items-start mb-3">
          <HeadingField
            text="Review Budget Proposal"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="LESS"
          />
          <TagField
            tags={[{ text: "HIGH PRIORITY", backgroundColor: "NEGATIVE" }]}
            size="SMALL"
          />
        </div>

        <RichTextDisplayField
          labelPosition="COLLAPSED"
          value={[
            <TextItem
              style="PLAIN"
              text="Complete financial analysis and provide recommendations for Q3 budget allocation.
          Requires approval from finance team."
            />,
          ]}
        />

        <ProgressBar
          percentage={65}
          color="NEGATIVE"
          style="THIN"
          showPercentage={true}
          marginBelow="STANDARD"
        />

        <TagField
          tags={[
            { text: "Finance" },
            { text: "Due: Today", backgroundColor: "NEGATIVE" },
          ]}
          size="SMALL"
          marginBelow="STANDARD"
        />

        <ButtonArrayLayout
          buttons={[
            {
              label: "Continue",
              style: "SOLID",
              color: "ACCENT",
              size: "STANDARD",
            },
            {
              label: "Reassign",
              style: "OUTLINE",
              color: "SECONDARY",
              size: "STANDARD",
            },
          ]}
          align="START"
          marginBelow="NONE"
        />
      </CardLayout>

      {/* In Progress Task */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <div className="flex justify-between items-start mb-3">
          <HeadingField
            text="Update Employee Handbook"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="LESS"
          />
          <TagField
            tags={[{ text: "IN PROGRESS", backgroundColor: "STANDARD" }]}
            size="SMALL"
          />
        </div>

        <RichTextDisplayField
          labelPosition="COLLAPSED"
          value={[
            <TextItem
              style="PLAIN"
              text="Revise sections 4-7 to reflect new remote work policies. Coordinate
          with legal and HR teams for final approval."
            />,
          ]}
        />

        <ProgressBar
          percentage={40}
          color="WARN"
          style="THIN"
          showPercentage={true}
          marginBelow="STANDARD"
        />

        <TagField
          tags={[
            { text: "HR" },
            { text: "Due: Friday", backgroundColor: "NEGATIVE" },
          ]}
          size="SMALL"
          marginBelow="STANDARD"
        />

        <ButtonArrayLayout
          buttons={[
            {
              label: "Continue",
              style: "SOLID",
              color: "ACCENT",
              size: "STANDARD",
            },
            {
              label: "View Details",
              style: "GHOST",
              color: "SECONDARY",
              size: "STANDARD",
            },
          ]}
          align="START"
          marginBelow="NONE"
        />
      </CardLayout>

      {/* Completed Task */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        marginBelow="STANDARD"
      >
        <div className="flex justify-between items-start mb-3">
          <HeadingField
            text="Onboard New Team Members"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="LESS"
          />
          <TagField
            tags={[{ text: "COMPLETE", backgroundColor: "POSITIVE" }]}
            size="SMALL"
          />
        </div>

        <RichTextDisplayField
          labelPosition="COLLAPSED"
          value={[
            <TextItem
              style="PLAIN"
              text="Set up accounts, schedule training sessions, and assign mentors for 3
          new hires."
            />,
          ]}
        />

        <ProgressBar
          percentage={100}
          color="POSITIVE"
          style="THIN"
          showPercentage={true}
          marginBelow="STANDARD"
        />

        <TagField
          tags={[
            {
              text: "Operations",
              backgroundColor: "SECONDARY",
            },
            { text: "Completed: Yesterday", backgroundColor: "SECONDARY" },
          ]}
          size="SMALL"
          marginBelow="STANDARD"
        />

        <ButtonArrayLayout
          buttons={[
            {
              label: "View Summary",
              style: "OUTLINE",
              color: "SECONDARY",
              size: "STANDARD",
            },
          ]}
          align="START"
          marginBelow="NONE"
        />
      </CardLayout>
    </div>
  );
};

export default TaskDashboard;
