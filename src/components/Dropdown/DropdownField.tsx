import * as React from 'react'
import { DropdownFieldBase } from './DropdownFieldBase'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'

type SearchDisplay = "AUTO" | "ON" | "OFF"

/**
 * Displays a list of choices for the user to select one item
 * Maps to SAIL a!dropdownField()
 */
export interface DropdownFieldProps {
  /** Text to display as the field label */
  label?: string
  /** Determines where the label appears */
  labelPosition?: SAILLabelPosition
  /** Supplemental text about this field */
  instructions?: string
  /** Determines if a value is required to submit the form */
  required?: boolean
  /** Determines if the field should display as grayed out */
  disabled?: boolean
  /** Array of options for the user to select */
  choiceLabels: any[]
  /** Array of values associated with the corresponding choices */
  choiceValues: any[]
  /** Text to display when nothing is selected and value is null */
  placeholder?: string
  /** Value of the choice to display as selected */
  value?: any
  /** Validation errors to display below the field */
  validations?: string[]
  /** Callback when the user changes the selection */
  saveInto?: (value: any) => void
  /** Callback when the user changes the selection (React-style alias for saveInto) */
  onChange?: (value: any) => void
  /** Validation group name (no spaces) */
  validationGroup?: string
  /** Custom message when field is required and not provided */
  requiredMessage?: string
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
 * Single-select dropdown field component
 *
 * @example
 * ```tsx
 * <DropdownField
 *   label="Language"
 *   instructions="In which language are you most proficient?"
 *   choiceLabels={["English", "Spanish", "French", "German"]}
 *   choiceValues={["en_US", "es_ES", "fr_FR", "de_DE"]}
 *   value={selectedLanguage}
 *   saveInto={(value) => setSelectedLanguage(value)}
 *   placeholder="Select a language"
 *   searchDisplay="AUTO"
 * />
 * ```
 *
 * SAIL Translation:
 * ```sail
 * a!dropdownField(
 *   label: "Language",
 *   instructions: "In which language are you most proficient?",
 *   choiceLabels: {"English", "Spanish", "French", "German"},
 *   choiceValues: {"en_US", "es_ES", "fr_FR", "de_DE"},
 *   value: local!language,
 *   saveInto: local!language,
 *   placeholder: "Select a language",
 *   searchDisplay: "AUTO"
 * )
 * ```
 */
export const DropdownField: React.FC<DropdownFieldProps> = (props) => {
  return <DropdownFieldBase multiple={false} {...props} />
}
