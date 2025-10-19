import { HeadingField } from '../components'
import { CollapsibleSection } from '../components/shared'
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
  SliderDemo,
  TabsDemo,
  DialogDemo,
  ClassNameOverrideDemo
} from '../demos'

export default function Components() {
  return (
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

        <CollapsibleSection title="Tabs Component (NEW SAIL)">
          <TabsDemo />
        </CollapsibleSection>

        <CollapsibleSection title="Dialog Component (NEW SAIL)">
          <DialogDemo />
        </CollapsibleSection>

        <CollapsibleSection title="className Override Demo">
          <ClassNameOverrideDemo />
        </CollapsibleSection>
      </div>
    </div>
  )
}
