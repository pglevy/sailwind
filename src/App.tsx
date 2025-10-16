import { useState } from 'react'
import { TagField, HeadingField, ButtonArrayLayout } from './components'
import { CollapsibleSection } from './components/shared'
import { TaskDashboard, ApplicationStatus, DocumentReview, UserProfile, FormEntry } from './vibes'
import {
  HeadingDemo,
  TagsDemo,
  ButtonsDemo,
  BannersDemo,
  MilestoneDemo,
  ProgressBarDemo,
  RichTextDemo,
  CardsDemo,
  StampDemo,
  TextFieldDemo,
  CheckboxDemo,
  ImageDemo,
  RadioButtonDemo,
  DropdownDemo,
  SwitchDemo,
  ToggleDemo,
  SliderDemo
} from './demos'

type ViewMode = 'components' | 'task-dashboard' | 'application-status' | 'document-review' | 'user-profile' | 'form-entry'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('components')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <HeadingField
              text="Sailwind"
              size="MEDIUM_PLUS"
              headingTag="H1"
              color="ACCENT"
              marginBelow="NONE"
            />
            <TagField
              tags={[{ text: "SAIL-Compatible", backgroundColor: "ACCENT" }]}
              size="SMALL"
            />
          </div>
          <div className="flex gap-2">
            <ButtonArrayLayout
              buttons={[
                {
                  label: "Components",
                  style: viewMode === 'components' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('components')
                },
                {
                  label: "Task Dashboard",
                  style: viewMode === 'task-dashboard' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('task-dashboard')
                },
                {
                  label: "Application Status",
                  style: viewMode === 'application-status' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('application-status')
                },
                {
                  label: "Document Review",
                  style: viewMode === 'document-review' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('document-review')
                },
                {
                  label: "User Profile",
                  style: viewMode === 'user-profile' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('user-profile')
                },
                {
                  label: "Form Entry",
                  style: viewMode === 'form-entry' ? 'SOLID' : 'GHOST',
                  color: "ACCENT",
                  size: "SMALL",
                  saveInto: () => setViewMode('form-entry')
                }
              ]}
              align="START"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'task-dashboard' && <TaskDashboard />}
      {viewMode === 'application-status' && <ApplicationStatus />}
      {viewMode === 'document-review' && <DocumentReview />}
      {viewMode === 'user-profile' && <UserProfile />}
      {viewMode === 'form-entry' && <FormEntry />}

      {viewMode === 'components' && (
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <HeadingField
                text="Component Library"
                size="LARGE_PLUS"
                headingTag="H1"
                marginBelow="EVEN_LESS"
              />
              <p className="text-base text-gray-700">
                React component library for rapid prototyping of Appian applications
              </p>
            </div>

            {/* Component Demos - Accordion Pattern */}
            <CollapsibleSection title="Heading Component" defaultOpen={true}>
              <HeadingDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Tag Component">
              <TagsDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Button Component">
              <ButtonsDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Message Banner Component">
              <BannersDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Milestone Component">
              <MilestoneDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Progress Bar Component">
              <ProgressBarDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Rich Text Component">
              <RichTextDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Card Component">
              <CardsDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Stamp Component">
              <StampDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Text Field Component">
              <TextFieldDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Checkbox Component">
              <CheckboxDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Image Component">
              <ImageDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Radio Button Component">
              <RadioButtonDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Dropdown Component">
              <DropdownDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Switch Component (NEW SAIL)">
              <SwitchDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Toggle Component (NEW SAIL)">
              <ToggleDemo />
            </CollapsibleSection>

            <CollapsibleSection title="Slider Component (NEW SAIL)">
              <SliderDemo />
            </CollapsibleSection>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
