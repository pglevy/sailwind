import { useState } from 'react'
import { CardLayout } from '../../components/Card/CardLayout'
import { HeadingField } from '../../components/Heading/HeadingField'
import { TextField } from '../../components/TextField/TextField'
import { RadioButtonField } from '../../components/RadioButton/RadioButtonField'
import { CheckboxField } from '../../components/Checkbox/CheckboxField'
import { DropdownField } from '../../components/Dropdown/DropdownField'
import { MultipleDropdownField } from '../../components/Dropdown/MultipleDropdownField'
import { ButtonArrayLayout } from '../../components/Button/ButtonArrayLayout'
import { RichTextDisplayField } from '../../components/RichText/RichTextDisplayField'
import { TextItem } from '../../components/RichText/TextItem'
import { MessageBanner } from '../../components/MessageBanner/MessageBanner'

/**
 * Form Entry Page
 * Demonstrates: Text fields, dropdowns, radio buttons, checkboxes, form validation
 */
export const FormEntry = () => {
  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState<string>()
  const [experience, setExperience] = useState<string>()
  const [skills, setSkills] = useState<string[]>([])
  const [availability, setAvailability] = useState<string[]>([])
  const [role, setRole] = useState<string>()

  // Validation state
  const [emailValidations, setEmailValidations] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleEmailChange = (value: string) => {
    setEmail(value)
    // Simple email validation
    if (value && !value.includes('@')) {
      setEmailValidations(['Please enter a valid email address'])
    } else {
      setEmailValidations([])
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
    // In a real app, this would submit to backend
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <HeadingField
        text="Employee Interest Survey"
        size="LARGE_PLUS"
        headingTag="H1"
        marginBelow="LESS"
      />

      <RichTextDisplayField
        value={[
          <TextItem key="1" text="Help us understand your interests and availability for upcoming projects and development opportunities." />
        ]}
        marginBelow="MORE"
      />

      {submitted && (
        <MessageBanner
          primaryText="Survey submitted successfully!"
          secondaryText="Thank you for your responses. We'll review your information and reach out soon."
          backgroundColor="SUCCESS"
          highlightColor="POSITIVE"
          icon="success"
          marginBelow="MORE"
        />
      )}

      {/* Personal Information */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="ACCENT"
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Personal Information"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <TextField
          label="Full Name"
          instructions="Enter your first and last name"
          placeholder="John Smith"
          value={fullName}
          saveInto={setFullName}
          required
          requiredMessage="Full name is required"
          marginBelow="STANDARD"
        />

        <TextField
          label="Email Address"
          instructions="Your work email address"
          placeholder="john.smith@company.com"
          value={email}
          saveInto={handleEmailChange}
          validations={emailValidations}
          inputPurpose="EMAIL"
          required
          marginBelow="STANDARD"
        />

        <TextField
          label="Phone Number"
          instructions="Optional contact number"
          placeholder="(555) 123-4567"
          value={phone}
          saveInto={setPhone}
          inputPurpose="PHONE_NUMBER"
          marginBelow="NONE"
        />
      </CardLayout>

      {/* Role & Department */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="ACCENT"
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Role & Department"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <DropdownField
          label="Department"
          instructions="Select your current department"
          placeholder="Choose a department..."
          choiceLabels={[
            "Engineering",
            "Product Management",
            "Design",
            "Marketing",
            "Sales",
            "Customer Success",
            "Operations"
          ]}
          choiceValues={["eng", "pm", "design", "marketing", "sales", "cs", "ops"]}
          value={department}
          saveInto={setDepartment}
          searchDisplay="AUTO"
          required
          marginBelow="STANDARD"
        />

        <RadioButtonField
          label="Years of Experience"
          instructions="Select your total years of professional experience"
          choiceLabels={[
            "0-2 years",
            "3-5 years",
            "6-10 years",
            "10+ years"
          ]}
          choiceValues={["0-2", "3-5", "6-10", "10+"]}
          value={experience}
          saveInto={setExperience}
          choiceLayout="STACKED"
          required
          marginBelow="NONE"
        />
      </CardLayout>

      {/* Skills & Interests */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="ACCENT"
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Skills & Interests"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <MultipleDropdownField
          label="Technical Skills"
          instructions="Select all technologies you're proficient with"
          placeholder="Choose one or more skills..."
          choiceLabels={[
            "JavaScript/TypeScript",
            "React",
            "Node.js",
            "Python",
            "Java",
            "Go",
            "SQL/Databases",
            "AWS/Cloud",
            "Docker/Kubernetes",
            "CI/CD"
          ]}
          choiceValues={["js", "react", "node", "python", "java", "go", "sql", "aws", "docker", "cicd"]}
          value={skills}
          saveInto={(value) => setSkills(value || [])}
          searchDisplay="AUTO"
          marginBelow="STANDARD"
        />

        <CheckboxField
          label="Availability for Additional Projects"
          instructions="Check all time slots when you could contribute to new initiatives"
          choiceLabels={[
            "Morning standup presentations",
            "Lunchtime learning sessions",
            "After-hours on-call rotation",
            "Weekend deployments (compensated)"
          ]}
          choiceValues={["morning", "lunch", "oncall", "weekend"]}
          value={availability}
          saveInto={setAvailability}
          choiceLayout="STACKED"
          marginBelow="NONE"
        />
      </CardLayout>

      {/* Career Goals */}
      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        decorativeBarPosition="TOP"
        decorativeBarColor="ACCENT"
        marginBelow="STANDARD"
      >
        <HeadingField
          text="Career Goals"
          size="MEDIUM_PLUS"
          headingTag="H2"
          fontWeight="BOLD"
          marginBelow="STANDARD"
        />

        <RadioButtonField
          label="Preferred Career Direction"
          instructions="Which path interests you most?"
          choiceLabels={[
            "Individual Contributor - Deep technical expertise",
            "Team Lead - Managing small teams",
            "Manager - People and process focus",
            "Architect - System design and strategy"
          ]}
          choiceValues={["ic", "lead", "manager", "architect"]}
          value={role}
          saveInto={setRole}
          choiceLayout="STACKED"
          choiceStyle="CARDS"
          spacing="STANDARD"
          marginBelow="NONE"
        />
      </CardLayout>

      {/* Form Actions */}
      <ButtonArrayLayout
        buttons={[
          {
            label: "Submit Survey",
            style: "SOLID",
            color: "ACCENT",
            size: "STANDARD",
            saveInto: handleSubmit
          },
          {
            label: "Save as Draft",
            style: "OUTLINE",
            color: "SECONDARY",
            size: "STANDARD"
          },
          {
            label: "Cancel",
            style: "GHOST",
            color: "SECONDARY",
            size: "STANDARD"
          }
        ]}
        align="START"
      />
    </div>
  )
}
export default FormEntry
