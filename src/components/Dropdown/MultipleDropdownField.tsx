import * as React from 'react'
import { DropdownFieldBase } from './DropdownFieldBase'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'

type SearchDisplay = "AUTO" | "ON" | "OFF"

/**
 * Displays a list of choices for the user to select multiple items
 * Maps to SAIL a!multipleDropdownField()
 */
export interface MultipleDropdownFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Supplemental text about this field */
  instructions?: string
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Determines if the field should display as grayed out */
  disabled?: boolean
  /** Text to display in the field when it is empty */
  placeholder?: string
  /** Array of options for the user to select */
  choiceLabels: any[]
  /** Array of values associated with the corresponding choices */
  choiceValues: any[]
  /** Values of choices to display as selected */
  value?: any[]
  /** Validation errors to display below the field */
  validations?: string[]
  /** Callback when the user changes the selections */
  saveInto?: (value: any[] | null) => void
  /** Callback when the user changes the selections (React-style alias for saveInto) */
  onChange?: (value: any[] | null) => void
  /** Validation group name (no spaces) */
  validationGroup?: string
  /** Custom message when field is required and not provided */
  requiredMessage?: string
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Displays a help icon with tooltip text */
  helpTooltip?: string
  /** Additional text for screen readers */
  accessibilityText?: string
  /** Determines whether component is displayed */
  showWhen?: boolean
  /** Determines when a search box displays above options */
  searchDisplay?: SearchDisplay
  /** Data source (record type) - not implemented in prototype */
  data?: any
  /** Sort configurations - not implemented in prototype */
  sort?: any[]
  /** Space added above component */
  marginAbove?: SAILMarginSize
  /** Space added below component */
  marginBelow?: SAILMarginSize
}

/**
 * Multi-select dropdown field component
 *
 * @example
 * ```tsx
 * <MultipleDropdownField
 *   label="Language"
 *   instructions="Which language(s) are you proficient in?"
 *   choiceLabels={["English", "Spanish", "French", "German"]}
 *   choiceValues={["en_US", "es_ES", "fr_FR", "de_DE"]}
 *   value={selectedLanguages}
 *   saveInto={(value) => setSelectedLanguages(value)}
 *   searchDisplay="AUTO"
 * />
 * ```
 *
 * SAIL Translation:
 * ```sail
 * a!multipleDropdownField(
 *   label: "Language",
 *   instructions: "Which language(s) are you proficient in?",
 *   choiceLabels: {"English", "Spanish", "French", "German"},
 *   choiceValues: {"en_US", "es_ES", "fr_FR", "de_DE"},
 *   value: local!language,
 *   saveInto: local!language,
 *   searchDisplay: "AUTO"
 * )
 * ```
 */
export const MultipleDropdownField: React.FC<MultipleDropdownFieldProps> = (props) => {
  return <DropdownFieldBase multiple={true} {...props} />
}
