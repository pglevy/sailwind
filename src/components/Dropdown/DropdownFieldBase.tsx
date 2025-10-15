import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { FieldWrapper } from '../shared/FieldWrapper'
import type { SAILLabelPosition, SAILMarginSize } from '../../types/sail'
import { ChevronDown, X, Search } from 'lucide-react'

type SearchDisplay = "AUTO" | "ON" | "OFF"

interface DropdownFieldBaseProps {
  /** Whether to allow multiple selections */
  multiple: boolean
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
  /** Text to display when nothing is selected */
  placeholder?: string
  /** Array of options for the user to select */
  choiceLabels: any[]
  /** Array of values associated with the corresponding choices */
  choiceValues: any[]
  /** Current selected value(s) */
  value?: any
  /** Validation errors to display below the field */
  validations?: string[]
  /** Callback when selection changes */
  saveInto?: (value: any) => void
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
  /** Determines when search box displays */
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

export const DropdownFieldBase: React.FC<DropdownFieldBaseProps> = ({
  multiple,
  label,
  labelPosition = "ABOVE",
  instructions,
  required = false,
  disabled = false,
  placeholder,
  choiceLabels,
  choiceValues,
  value,
  validations = [],
  saveInto,
  validationGroup: _validationGroup,
  requiredMessage,
  helpTooltip,
  accessibilityText,
  showWhen = true,
  searchDisplay = "AUTO",
  data: _data,
  sort: _sort,
  marginAbove = "NONE",
  marginBelow = "STANDARD"
}) => {
  // Visibility control
  if (!showWhen) return null

  const inputId = `dropdown-${Math.random().toString(36).substr(2, 9)}`
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Determine if search should be shown
  const shouldShowSearch =
    searchDisplay === "ON" ||
    (searchDisplay === "AUTO" && choiceLabels.length > 11)

  // Filter choices based on search term
  const filteredChoices = searchTerm
    ? choiceLabels
        .map((label, index) => ({ label, value: choiceValues[index], index }))
        .filter(choice =>
          String(choice.label).toLowerCase().includes(searchTerm.toLowerCase())
        )
    : choiceLabels.map((label, index) => ({ label, value: choiceValues[index], index }))

  // Get selected values as array
  const selectedValues = multiple
    ? (Array.isArray(value) ? value : (value ? [value] : []))
    : (value !== undefined && value !== null ? [value] : [])

  // Get display text for selected items
  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder || 'Select...'
    }

    if (multiple) {
      return selectedValues
        .map(val => {
          const index = choiceValues.indexOf(val)
          return index >= 0 ? choiceLabels[index] : val
        })
        .join(', ')
    } else {
      const index = choiceValues.indexOf(value)
      return index >= 0 ? choiceLabels[index] : value
    }
  }

  // Handle selection
  const handleSelect = (choiceValue: any) => {
    if (!saveInto || disabled) return

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(choiceValue)
        ? currentValues.filter(v => v !== choiceValue)
        : [...currentValues, choiceValue]
      saveInto(newValues.length > 0 ? newValues : null)
    } else {
      saveInto(choiceValue)
      setIsOpen(false)
    }
  }

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (saveInto && !disabled) {
      saveInto(null)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && shouldShowSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, shouldShowSearch])

  // Show validations
  const showValidations = validations.length > 0

  // Show required message
  const showRequiredMessage = required && selectedValues.length === 0 && requiredMessage

  // Render the dropdown field
  const dropdownElement = (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown trigger */}
      <button
        type="button"
        id={inputId}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={[
          'w-full',
          'flex items-center justify-between',
          'px-3 py-2',
          'border border-gray-200 rounded-sm',
          'bg-white',
          'text-base text-left',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-gray-500',
          showValidations && 'border-red-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        ].filter(Boolean).join(' ')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={showValidations}
        aria-describedby={instructions ? `${inputId}-instructions` : undefined}
      >
        <span className={selectedValues.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
          {getDisplayText()}
        </span>

        <div className="flex items-center gap-1">
          {/* Clear button - shows when there's a selection */}
          {selectedValues.length > 0 && !disabled && (
            <X
              className="h-4 w-4 text-gray-500 hover:text-gray-700"
              onClick={handleClear}
            />
          )}

          <ChevronDown
            className={[
              'h-4 w-4 text-gray-500 transition-transform',
              isOpen && 'transform rotate-180'
            ].filter(Boolean).join(' ')}
          />
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          {shouldShowSearch && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto max-h-48" role="listbox">
            {filteredChoices.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No results found
              </div>
            ) : (
              filteredChoices.map(({ label: choiceLabel, value: choiceValue }) => {
                const isSelected = selectedValues.includes(choiceValue)

                return (
                  <button
                    key={choiceValue}
                    type="button"
                    onClick={() => handleSelect(choiceValue)}
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      'w-full px-3 py-2 text-left text-base',
                      'hover:bg-gray-100',
                      isSelected && 'bg-blue-50 text-blue-700 font-medium',
                      'focus:outline-none focus:bg-gray-100'
                    ].filter(Boolean).join(' ')}
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="mr-2 h-4 w-4 rounded border-gray-200 text-blue-500"
                      />
                    )}
                    {choiceLabel}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )

  // Footer content (validations and required message)
  const footerContent = (
    <>
      {showValidations && (
        <div id={`${inputId}-error`} className="mt-2" role="alert">
          {validations.map((validation, i) => (
            <p key={i} className="text-sm text-red-700">{validation}</p>
          ))}
        </div>
      )}

      {showRequiredMessage && (
        <p className="text-sm text-red-700 mt-2" role="alert">
          {requiredMessage}
        </p>
      )}
    </>
  )

  return (
    <FieldWrapper
      label={label}
      labelPosition={labelPosition}
      required={required}
      instructions={instructions}
      helpTooltip={helpTooltip}
      accessibilityText={accessibilityText}
      inputId={inputId}
      marginAbove={marginAbove}
      marginBelow={marginBelow}
      footer={footerContent}
    >
      {dropdownElement}
    </FieldWrapper>
  )
}
