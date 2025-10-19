import { useState } from 'react'
import {
  CardLayout,
  HeadingField,
  RichTextDisplayField,
  TextItem,
  ButtonArrayLayout,
  TextField,
  MilestoneField,
  Icon,
} from '../components'

/**
 * Auto Insurance Quote Wizard - Final Step
 *
 * A multi-step insurance quote wizard showing the final quote step with:
 * - Vertical progress stepper (left sidebar on desktop)
 * - Quote summary with price and CTAs
 * - Expandable coverage details sections
 * - "Save for Later" email capture functionality
 */
export default function InsuranceQuoteWizard() {
  const [showSaveForLater, setShowSaveForLater] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with purple background */}
      <div className="bg-[#73245d] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-32 h-12 bg-white rounded flex items-center justify-center text-sm font-bold text-gray-700">
            INSURECORP
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-white text-[#73245d] rounded text-sm font-semibold">
              ENGLISH
            </button>
            <button className="px-4 py-1.5 text-white text-sm">
              Español
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-12 gap-8">
          {/* Progress stepper - left sidebar (desktop only) */}
          <div className="hidden lg:block lg:col-span-2">
            <MilestoneField
              steps={[
                "Bundled Savings",
                "About You", 
                "Your Vehicles",
                "Other Drivers",
                "Coverage Options",
                "Quote"
              ]}
              active={5}
              orientation="VERTICAL"
              stepStyle="DOT"
              color="#AF2B9B"
            />
          </div>

          {/* Main content - center column */}
          <div className="col-span-12 lg:col-span-10">
            <HeadingField
              text="Here's your personalized quote"
              size="LARGE"
              color="STANDARD"
            />

            {/* Quote card with price and CTAs */}
            <CardLayout
              padding="STANDARD"
              decorativeBarPosition="TOP"
              decorativeBarColor="#73245d"
              marginAbove="NONE"
            >
              {!showSaveForLater ? (
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0">
                    <RichTextDisplayField
                      value={[
                        <TextItem text="$113.50" size="LARGE" style="STRONG" />,
                        <TextItem text=" / Month" size="MEDIUM" />,
                      ]}
                      marginBelow="NONE"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <ButtonArrayLayout
                      buttons={[
                        {
                          label: 'Purchase Now',
                          style: 'SOLID',
                          size: 'STANDARD',
                          className: '!bg-[#AF2B9B] hover:!bg-[#5a1c4a]'
                        },
                      ]}
                      align="START"
                      marginBelow="NONE"
                    />
                    <RichTextDisplayField
                      value={[<TextItem text="– or –" size="MEDIUM" />]}
                      marginBelow="NONE"
                    />
                    <ButtonArrayLayout
                      buttons={[
                        {
                          label: 'Save for Later',
                          style: 'OUTLINE',
                          size: 'STANDARD',
                          className: '!border-[#AF2B9B] !text-[#AF2B9B]',
                          saveInto: () => setShowSaveForLater(true),
                        },
                      ]}
                      align="START"
                      marginBelow="NONE"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <RichTextDisplayField
                        value={[
                          <TextItem text="$113.50" size="LARGE" style="STRONG" />,
                          <TextItem text=" / Month" size="MEDIUM" />,
                        ]}
                      />
                    </div>
                    <div className="flex-grow">
                      <TextField
                        labelPosition="COLLAPSED"
                        placeholder="Your email address"
                      />
                    </div>
                    <ButtonArrayLayout
                      buttons={[
                        {
                          label: 'Send Quote',
                          icon: 'envelope-o',
                          style: 'OUTLINE',
                          size: 'STANDARD',
                        },
                      ]}
                      align="START"
                    />
                    <button
                      onClick={() => setShowSaveForLater(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </CardLayout>

            {/* Auto Insurance heading */}
            <div className="mt-8 mb-4">
              <RichTextDisplayField
                value={[<TextItem text="Auto Insurance" size="MEDIUM" />]}
              />
            </div>

            {/* 3 discounts summary card */}
            <CardLayout padding="STANDARD" className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RichTextDisplayField
                    value={[<Icon icon="dollar-sign" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                  <RichTextDisplayField
                    value={[<TextItem text="3 discounts" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                </div>
                <div className="flex items-center gap-4">
                  <RichTextDisplayField
                    value={[<TextItem text="$42.90/mo" size="MEDIUM" style="STRONG" color="#38761d" />]}
                    marginBelow='NONE'
                  />
                  <RichTextDisplayField
                    value={[<Icon icon="chevron-right" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                </div>
              </div>
            </CardLayout>

            {/* 1 vehicle summary card */}
            <CardLayout padding="STANDARD" className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RichTextDisplayField
                    value={[<Icon icon="car" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                  <RichTextDisplayField
                    value={[<TextItem text="1 vehicle" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                </div>
                <RichTextDisplayField
                  value={[<Icon icon="chevron-right" size="MEDIUM" />]}
                  marginBelow='NONE'
                />
              </div>
            </CardLayout>

            {/* 1 driver summary card */}
            <CardLayout padding="STANDARD" className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RichTextDisplayField
                    value={[<Icon icon="users" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                  <RichTextDisplayField
                    value={[<TextItem text="1 driver" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                </div>
                <RichTextDisplayField
                  value={[<Icon icon="chevron-right" size="MEDIUM" />]}
                  marginBelow='NONE'
                />
              </div>
            </CardLayout>

            {/* Coverage expandable - collapsed by default */}
            <CardLayout padding="STANDARD" className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RichTextDisplayField
                    value={[<Icon icon="umbrella" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                  <RichTextDisplayField
                    value={[<TextItem text="Coverage" size="MEDIUM" />]}
                    marginBelow='NONE'
                  />
                </div>
                <RichTextDisplayField
                  value={[<Icon icon="chevron-down" size="MEDIUM" />]}
                  marginBelow='NONE'
                />
              </div>
            </CardLayout>

            {/* Coverage details - expanded state */}
            <CardLayout padding="STANDARD">
              {/* Bodily Injury Liability */}
              <div className="pb-4 mb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <RichTextDisplayField
                      value={[
                        <TextItem text="Bodily Injury Liability" style="STRONG" />,
                      ]}
                    />
                    <RichTextDisplayField
                      value={[
                        <TextItem text="$50,000/person" />,
                      ]}
                    />
                    <RichTextDisplayField
                      value={[
                        <TextItem text="$100,000/accident" />,
                      ]}
                    />
                  </div>
                  <ButtonArrayLayout
                    buttons={[
                      {
                        label: 'Edit',
                        style: 'OUTLINE',
                        color: 'SECONDARY',
                      },
                    ]}
                    align="START"
                  />
                </div>
              </div>

              {/* Uninsured/Underinsured Motorist */}
              <div className="pb-4 mb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <RichTextDisplayField
                      value={[
                        <TextItem text="Uninsured/Underinsured Motorist Bodily Injury Liability" style="STRONG" />,
                      ]}
                    />
                    <RichTextDisplayField
                      value={[
                        <TextItem text="$50,000/person" />,
                      ]}
                    />
                    <RichTextDisplayField
                      value={[
                        <TextItem text="$100,000/accident" />,
                      ]}
                    />
                  </div>
                  <ButtonArrayLayout
                    buttons={[
                      {
                        label: 'Edit',
                        style: 'OUTLINE',
                        color: 'SECONDARY',
                      },
                    ]}
                    align="START"
                  />
                </div>
              </div>

              {/* Property Damage Liability */}
              <div className="pb-4 mb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <RichTextDisplayField
                      value={[
                        <TextItem text="Property Damage Liability" style="STRONG" />,
                      ]}
                    />
                    <RichTextDisplayField
                      value={[
                        <TextItem text="$75,000/accident" />,
                      ]}
                    />
                  </div>
                  <ButtonArrayLayout
                    buttons={[
                      {
                        label: 'Edit',
                        style: 'OUTLINE',
                        color: 'SECONDARY',
                      },
                    ]}
                    align="START"
                  />
                </div>
              </div>

              {/* Medical Payments */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <RichTextDisplayField
                      value={[
                        <TextItem text="Medical Payments" style="STRONG" />,
                      ]}
                    />
                    <RichTextDisplayField
                      value={[
                        <TextItem text="$25,000/person" />,
                      ]}
                    />
                    <RichTextDisplayField
                      value={[
                        <TextItem text="$50,000/accident" />,
                      ]}
                    />
                  </div>
                  <ButtonArrayLayout
                    buttons={[
                      {
                        label: 'Edit',
                        style: 'OUTLINE',
                        color: 'SECONDARY',
                      },
                    ]}
                    align="START"
                  />
                </div>
              </div>
            </CardLayout>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#333] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="w-32 h-12 bg-white rounded flex items-center justify-center text-sm font-bold text-gray-700">
              INSURECORP
            </div>
            <div className="md:col-span-2 text-sm text-gray-300 space-y-4">
              <p>
                We may use information from public sources or third parties, such as driving
                records, claim history, vehicle driving data, and credit reports to provide you
                with the best quote.
              </p>
              <p>
                Some discounts, coverages, payment plans, and features are not available in all states.
              </p>
              <p>
                This site exists for demonstration purposes only. We can't actually sell you auto insurance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
