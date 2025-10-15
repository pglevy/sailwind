# TextField Component Examples

## Basic Usage

### Text with Only a Label

**React:**
```tsx
<TextField
  label="Title"
  value="Expenses could not be submitted"
  readOnly
/>
```

**SAIL:**
```sail
a!textField(
  label: "Title",
  value: "Expenses could not be submitted",
  readOnly: true
)
```

---

### Text with Label and Instructions

**React:**
```tsx
<TextField
  label="Title"
  instructions="The ticket title is exactly as entered by the creator"
  value="Expenses could not be submitted"
  readOnly
/>
```

**SAIL:**
```sail
a!textField(
  label: "Title",
  instructions: "The ticket title is exactly as entered by the creator",
  value: "Expenses could not be submitted",
  readOnly: true
)
```

---

### Editable Text Field with Placeholder

**React:**
```tsx
const [email, setEmail] = useState("")

<TextField
  label="Email Address"
  placeholder="user@example.com"
  value={email}
  saveInto={(value) => setEmail(value)}
  required
/>
```

**SAIL:**
```sail
a!textField(
  label: "Email Address",
  placeholder: "user@example.com",
  value: local!email,
  saveInto: local!email,
  required: true
)
```

---

### Text Field with Character Limit

**React:**
```tsx
const [phoneNumber, setPhoneNumber] = useState("555-456-7890-876")

<TextField
  label="Phone Number"
  instructions="Include only dashes and numbers. For example, 555-456-7890."
  value={phoneNumber}
  saveInto={(value) => setPhoneNumber(value)}
  characterLimit={12}
  showCharacterCount
/>
```

**SAIL:**
```sail
a!localVariables(
  local!storedPhoneNumber: "555-456-7890-876",
  a!textField(
    label: "Phone Number",
    instructions: "Include only dashes and numbers. For example, 555-456-7890.",
    value: local!storedPhoneNumber,
    saveInto: local!storedPhoneNumber,
    characterLimit: 12,
    showCharacterCount: true
  )
)
```

---

### Masked Text Field (Password)

**React:**
```tsx
const [password, setPassword] = useState("")

<TextField
  label="Password"
  masked
  value={password}
  saveInto={(value) => setPassword(value)}
  required
/>
```

**SAIL:**
```sail
a!textField(
  label: "Password",
  masked: true,
  value: local!password,
  saveInto: local!password,
  required: true
)
```

---

### Text Field with Validation Errors

**React:**
```tsx
const [email, setEmail] = useState("invalid-email")
const validations = email && !email.includes("@")
  ? ["Please enter a valid email address"]
  : []

<TextField
  label="Email"
  value={email}
  saveInto={(value) => setEmail(value)}
  validations={validations}
/>
```

**SAIL:**
```sail
a!textField(
  label: "Email",
  value: local!email,
  saveInto: local!email,
  validations: if(
    and(not(isnull(local!email)), not(contains(local!email, "@"))),
    "Please enter a valid email address",
    null
  )
)
```

---

### Text Field with Adjacent Label

**React:**
```tsx
<TextField
  label="First Name"
  labelPosition="ADJACENT"
  value={firstName}
  saveInto={(value) => setFirstName(value)}
/>
```

**SAIL:**
```sail
a!textField(
  label: "First Name",
  labelPosition: "ADJACENT",
  value: local!firstName,
  saveInto: local!firstName
)
```

---

### Text Field with Right Alignment (for Grid Layout)

**React:**
```tsx
<TextField
  label="Amount"
  value="$1,234.56"
  align="RIGHT"
  readOnly
/>
```

**SAIL:**
```sail
a!textField(
  label: "Amount",
  value: "$1,234.56",
  align: "RIGHT",
  readOnly: true
)
```

---

### Text Field with Input Purpose (Autocomplete)

**React:**
```tsx
<TextField
  label="Email Address"
  inputPurpose="EMAIL"
  value={email}
  saveInto={(value) => setEmail(value)}
/>
```

**SAIL:**
```sail
a!textField(
  label: "Email Address",
  inputPurpose: "EMAIL",
  value: local!email,
  saveInto: local!email
)
```

---

## Key Differences

### Read-Only Display
- In SAIL, read-only text fields display without a box around them
- This is replicated in the React component by removing borders and padding when `readOnly={true}`

### Save Behavior
- SAIL's `refreshAfter` parameter controls when the interface refreshes
- React uses controlled components, so changes are captured immediately via `onChange`
- The `saveInto` prop accepts a callback function instead of SAIL's direct variable assignment

### Validation
- SAIL's `validations` parameter accepts expressions that evaluate to error messages
- React's `validations` prop accepts an array of strings to display as errors
- Validation messages only show when the field has a value (matching SAIL behavior)

### Character Limit
- Both SAIL and React count some characters (emojis, multi-byte characters) as more than one
- Character count displays below the input by default when `characterLimit` is set

---

## Accessibility Features

- Proper `aria-invalid` attribute when validation errors exist
- `aria-describedby` links to error messages and instructions
- `aria-label` provided when label is collapsed or via `accessibilityText`
- Required fields indicated with asterisk and proper ARIA attributes
- Focus ring styling for keyboard navigation
