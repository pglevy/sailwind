import { useState } from 'react'
import { CardLayout, HeadingField, TextField } from '../components'

export default function TextFieldDemo() {
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('555-456-7890-876')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('John')

  const emailValidations = email && !email.includes('@')
    ? ['Please enter a valid email address']
    : []

  return (
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
  )
}
