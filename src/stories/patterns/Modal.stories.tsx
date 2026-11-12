import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Modal, ModalHeading, ModalHero, ModalSection } from '../../pages/patterns/Modal'
import type { ModalProps } from '../../pages/patterns/Modal'
import { ButtonWidget } from '../../components/Button/ButtonWidget'
import { CheckboxField } from '../../components/Checkbox/CheckboxField'
import { DropdownField } from '../../components/Dropdown/DropdownField'
import { FileUploadField } from '../../components/FileUpload/FileUploadField'
import type { FileUploadFile } from '../../components/FileUpload/FileUploadField'
import { ParagraphField } from '../../components/ParagraphField/ParagraphField'
import { RadioButtonField } from '../../components/RadioButton/RadioButtonField'
import { RichTextDisplayField } from '../../components/RichText/RichTextDisplayField'
import { TextItem } from '../../components/RichText/TextItem'
import { TabsField } from '../../components/Tabs/TabsField'
import { TextField } from '../../components/TextField/TextField'
import { ToggleField } from '../../components/Toggle/ToggleField'

/**
 * The three sizes of the modal pattern: a small picker, a medium dialog that gathers a few inputs,
 * and a large wizard with steps. Each opens from a button, because a dialog that starts open
 * covers the whole docs page. Everything inside is a Sailwind component.
 *
 * The pattern is built on `DialogField` and is not exported from `@pglevy/sailwind`: copy
 * `src/pages/patterns/Modal.tsx` into your project and adjust it.
 */
const meta = {
  title: 'Patterns/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'inline-radio', options: ['SMALL', 'MEDIUM', 'LARGE'] },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

/** Holds a story's open state and the button that opens it */
const Opener: React.FC<{
  label: string
  children: (modal: { open: boolean; onOpenChange: (open: boolean) => void }) => React.ReactNode
}> = ({ label, children }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <ButtonWidget label={label} style="OUTLINE" onClick={() => setOpen(true)} />
      {children({ open, onOpenChange: setOpen })}
    </>
  )
}

/** Opens the modal from the story's button, ready for the checks that follow */
const openModal = async (canvasElement: HTMLElement, label: string) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: label }))
  const dialog = await within(document.body).findByRole('dialog')
  await expect(dialog).toBeVisible()
  return within(dialog)
}

/** A line of secondary text, as the empty state pattern writes one */
const Secondary: React.FC<{ text: string }> = ({ text }) => (
  <RichTextDisplayField
    marginAbove="NONE"
    marginBelow="NONE"
    value={[<TextItem key="text" text={text} color="SECONDARY" />]}
  />
)

/* -------------------------------------------------------------------------- */
/* Small                                                                       */
/* -------------------------------------------------------------------------- */

const RECORD_TYPES = [
  { name: 'Applicant', fields: 12 },
  { name: 'Claim', fields: 18 },
  { name: 'Policy document', fields: 9 },
]

/**
 * A SMALL modal asks one question. It is a Narrow dialog (480px), and choosing is the action,
 * so it has no buttons of its own: each choice is a button that fills the row, and the close
 * (X) control is the way out.
 */
export const Small: Story = {
  args: {
    title: 'Connect to Data Fabric',
    description: 'Pick the record type these fields are written to',
    size: 'SMALL',
    children: null,
  },
  render: (args: ModalProps) => {
    const [chosen, setChosen] = React.useState<string | null>(null)
    return (
      <div className="flex flex-col items-start gap-3">
        <Opener label="Connect to Data Fabric">
          {({ open, onOpenChange }) => (
            <Modal {...args} open={open} onOpenChange={onOpenChange}>
              <div className="flex flex-col gap-2">
                {RECORD_TYPES.map(type => (
                  <ButtonWidget
                    key={type.name}
                    label={`${type.name} (${type.fields} fields)`}
                    icon="Database"
                    style="OUTLINE"
                    color="SECONDARY"
                    width="FILL"
                    onClick={() => {
                      setChosen(type.name)
                      onOpenChange(false)
                    }}
                  />
                ))}
              </div>
            </Modal>
          )}
        </Opener>
        <Secondary text={chosen ? `Connected to ${chosen}` : 'Not connected'} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const dialog = await openModal(canvasElement, 'Connect to Data Fabric')
    await expect(dialog.getByText('Pick the record type these fields are written to')).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: /Claim/ }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
    await expect(within(canvasElement).getByText('Connected to Claim')).toBeVisible()
  },
}

/* -------------------------------------------------------------------------- */
/* Medium                                                                      */
/* -------------------------------------------------------------------------- */

type DocumentSource = 'EXISTING' | 'NEW' | 'TEXT'

const SOURCES: { value: DocumentSource; title: string }[] = [
  { value: 'EXISTING', title: 'Existing document' },
  { value: 'NEW', title: 'New document' },
  { value: 'TEXT', title: 'Pasted text' },
]

const RECENT_DOCUMENTS = [
  { id: 'inv-2041', label: 'Invoice_2041.pdf (Today, 9:14 AM)' },
  { id: 'inv-2038', label: 'Invoice_2038.pdf (Yesterday)' },
  { id: 'inv-2031', label: 'Invoice_2031.pdf (Nov 9)' },
]

/**
 * A MEDIUM modal gathers a few related inputs and ends in one action. It is a Medium dialog
 * (720px). The inputs sit in a hero panel: the cards choose where the document comes from, and
 * what the chosen card needs is shown under them. The footer stays in view while the panel scrolls.
 */
export const Medium: Story = {
  args: {
    title: 'Run extraction',
    description: 'Choose a document for Invoice extraction to read',
    size: 'MEDIUM',
    children: null,
  },
  render: (args: ModalProps) => {
    const [source, setSource] = React.useState<DocumentSource>('EXISTING')
    const [documentId, setDocumentId] = React.useState(RECENT_DOCUMENTS[0].id)
    const [files, setFiles] = React.useState<FileUploadFile[]>([])
    const [text, setText] = React.useState('')
    const [testCase, setTestCase] = React.useState(false)
    return (
      <Opener label="Run extraction">
        {({ open, onOpenChange }) => (
          <Modal
            {...args}
            open={open}
            onOpenChange={onOpenChange}
            primaryButtons={[{ label: 'Run extraction', onClick: () => onOpenChange(false) }]}
          >
            <ModalHero>
              <ModalSection title="Document" description="Where the document comes from.">
                <RadioButtonField
                  label="Document source"
                  labelPosition="COLLAPSED"
                  choiceStyle="CARDS"
                  choiceLayout="COMPACT"
                  choiceLabels={SOURCES.map(option => option.title)}
                  choiceValues={SOURCES.map(option => option.value)}
                  value={source}
                  saveInto={value => setSource(value as DocumentSource)}
                  marginBelow="NONE"
                />

                {source === 'EXISTING' && (
                  <RadioButtonField
                    label="Recently uploaded documents"
                    choiceLabels={RECENT_DOCUMENTS.map(doc => doc.label)}
                    choiceValues={RECENT_DOCUMENTS.map(doc => doc.id)}
                    value={documentId}
                    saveInto={value => setDocumentId(value as string)}
                    marginBelow="NONE"
                  />
                )}
                {source === 'NEW' && (
                  <FileUploadField label="Select document" value={files} saveInto={setFiles} marginBelow="NONE" />
                )}
                {source === 'TEXT' && (
                  <ParagraphField
                    label="Add text"
                    value={text}
                    saveInto={setText}
                    placeholder="Paste document text..."
                    marginBelow="NONE"
                  />
                )}
              </ModalSection>

              <ModalSection title="Test case" description="Keep this run so the model can be checked against it later.">
                <CheckboxField
                  choiceLabels={['Set as test case']}
                  choiceValues={['yes']}
                  value={testCase ? ['yes'] : []}
                  saveInto={value => setTestCase(value.includes('yes'))}
                  marginBelow="NONE"
                />
              </ModalSection>
            </ModalHero>
          </Modal>
        )}
      </Opener>
    )
  },
  play: async ({ canvasElement }) => {
    const dialog = await openModal(canvasElement, 'Run extraction')
    await expect(dialog.getByRole('radio', { name: 'Existing document' })).toBeChecked()
    await userEvent.click(dialog.getByRole('radio', { name: 'Pasted text' }))
    await expect(dialog.getByRole('radio', { name: 'Pasted text' })).toBeChecked()
    await expect(dialog.getByLabelText('Add text')).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Run extraction' }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}

/**
 * When the content is longer than the window allows, the body scrolls and the title and the
 * buttons stay where they are. This is what keeps "Run" in reach however long the list is.
 */
export const MediumScrollingBody: Story = {
  args: {
    title: 'Choose documents',
    description: 'Pick the documents to include in this run',
    size: 'MEDIUM',
    children: null,
  },
  render: (args: ModalProps) => {
    const [chosen, setChosen] = React.useState<string[]>([])
    const documents = Array.from({ length: 24 }, (_, index) => `Invoice_${2000 + index}.pdf`)
    return (
      <Opener label="Choose documents">
        {({ open, onOpenChange }) => (
          <Modal
            {...args}
            open={open}
            onOpenChange={onOpenChange}
            secondaryButtons={[{ label: 'Clear', onClick: () => setChosen([]) }]}
            primaryButtons={[{ label: `Include ${chosen.length} documents`, onClick: () => onOpenChange(false) }]}
          >
            <CheckboxField
              label="Documents"
              labelPosition="COLLAPSED"
              choiceLabels={documents}
              choiceValues={documents}
              value={chosen}
              saveInto={value => setChosen(value as string[])}
              marginBelow="NONE"
            />
          </Modal>
        )}
      </Opener>
    )
  },
  play: async ({ canvasElement }) => {
    const dialog = await openModal(canvasElement, 'Choose documents')
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Invoice_2000.pdf' }))
    await expect(dialog.getByRole('button', { name: 'Include 1 documents' })).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Clear' }))
    await expect(dialog.getByRole('button', { name: 'Include 0 documents' })).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Close dialog' }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}

/* -------------------------------------------------------------------------- */
/* Large                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The steps of a wizard that creates an extraction model. The names are short, so each sits on
 * one line in the list of steps; the title and line under it say more.
 */
const STEPS = [
  { name: 'Details', title: 'Model Details', description: 'Name and describe your new extraction model' },
  {
    name: 'Sections',
    title: 'Configure Sections',
    description: 'Adding document sections helps the model know where to look for fields, improving extraction accuracy',
  },
  {
    name: 'Create Fields',
    title: 'Create Fields',
    description: 'Choose how you want to create fields for this model to extract',
  },
  { name: 'Fields', title: 'Configure Fields', description: 'Provide additional details about the fields to extract' },
  {
    name: 'Prompt',
    title: 'Refine Prompt',
    description: 'Define what you want the model to do when it receives a document for extraction',
  },
]

const CREATE_METHODS = [
  { value: 'MANUAL', title: 'Create & Configure Manually' },
  { value: 'DESCRIBE', title: 'Describe Fields' },
  { value: 'DOCUMENT', title: 'Extract From Document' },
]

const DATA_TYPES = { labels: ['Text', 'Number', 'Date'], values: ['TEXT', 'NUMBER', 'DATE'] }
const METHODS = { labels: ['Generative AI', 'Regular expression'], values: ['GENAI', 'REGEX'] }

/** The line of help under an option */
const Hint: React.FC<{ text: string }> = ({ text }) => (
  <RichTextDisplayField
    marginAbove="NONE"
    marginBelow="NONE"
    className="mt-1 text-xs [&>div]:leading-snug"
    value={[<TextItem key="hint" text={text} size="SMALL" color="SECONDARY" />]}
  />
)

/** A key such as "invoice_extraction" made from a name, or a dash while there is none */
const keyFrom = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || '-'

/**
 * A LARGE modal walks through the steps of a task. It is a Full dialog (96% of the window). `steps` and `activeStep` add the list of
 * steps down the left, and `onStepSelect` lets the user go back to a step they have finished.
 * Every step's content sits in a `ModalHero`, so each has the gradient ground. The first step
 * puts its heading inside the hero, centred; the others put it above. The body keeps one height
 * on every step, so the footer does not move. Back is a secondary button, on the left; Next is
 * the primary button, on the right, and becomes the action that finishes the task on the last step.
 */
export const Large: Story = {
  args: {
    title: 'Create an extraction model',
    description: 'Set up what to extract and how, in five steps',
    size: 'LARGE',
    steps: STEPS.map(step => step.name),
    children: null,
  },
  render: (args: ModalProps) => {
    const [step, setStep] = React.useState(0)
    const [name, setName] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [boundingBoxes, setBoundingBoxes] = React.useState(true)
    const [autoRotation, setAutoRotation] = React.useState(false)
    const [logAiUsage, setLogAiUsage] = React.useState(false)
    const [suggestImprovements, setSuggestImprovements] = React.useState(false)
    const [method, setMethod] = React.useState('MANUAL')
    const isLast = step === STEPS.length - 1
    const current = STEPS[step]
    return (
      <Opener label="Create an extraction model">
        {({ open, onOpenChange }) => (
          <Modal
            {...args}
            open={open}
            onOpenChange={next => {
              // Each opening starts on the first step
              if (next) setStep(0)
              onOpenChange(next)
            }}
            activeStep={step}
            onStepSelect={setStep}
            secondaryButtons={[{ label: 'Back', showWhen: step > 0, onClick: () => setStep(step - 1) }]}
            primaryButtons={[
              isLast
                ? { label: 'Create model', onClick: () => onOpenChange(false) }
                : { label: 'Next', onClick: () => setStep(step + 1) },
            ]}
          >
            <div className="flex flex-col gap-4">
              {step > 0 && <ModalHeading title={current.title} description={current.description} />}

              <ModalHero width={step === 3 ? 'FILL' : step === 2 ? 'WIDE' : 'STANDARD'}>
                {step === 0 && (
                  <>
                    <ModalHeading title={current.title} description={current.description} align="CENTER" />
                    <ModalSection title="Name and description">
                      <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                        <TextField label="Model name" required={true} value={name} saveInto={setName} marginBelow="NONE" />
                        <TextField label="Model key" value={keyFrom(name)} disabled={true} marginBelow="NONE" />
                      </div>
                      <ParagraphField
                        label="Description"
                        value={description}
                        saveInto={setDescription}
                        placeholder="What does this model extract?"
                        marginBelow="NONE"
                      />
                    </ModalSection>
                    <ModalSection title="Additional options">
                      <div>
                        <ToggleField
                          choiceLabel="Bounding Boxes"
                          value={boundingBoxes}
                          saveInto={setBoundingBoxes}
                          marginBelow="NONE"
                        />
                        <Hint text="Will display bounding boxes on the reconciliation screen for extracted values." />
                      </div>
                      <div>
                        <ToggleField
                          choiceLabel="Auto Document Rotation"
                          value={autoRotation}
                          saveInto={setAutoRotation}
                          marginBelow="NONE"
                        />
                        <Hint text="If needed, automatically rotate the document to its proper orientation to help improve extraction accuracy." />
                      </div>
                      <div>
                        <ToggleField
                          choiceLabel="Log AI Usage"
                          value={logAiUsage}
                          saveInto={value => {
                            setLogAiUsage(value)
                            if (!value) setSuggestImprovements(false)
                          }}
                          marginBelow="NONE"
                        />
                        <Hint text="View detailed information on how this model uses AI-powered features." />
                      </div>
                      <div>
                        <ToggleField
                          choiceLabel="AI-Suggested Improvements"
                          value={suggestImprovements}
                          disabled={!logAiUsage}
                          saveInto={setSuggestImprovements}
                          marginBelow="NONE"
                        />
                        <Hint text="Get AI-generated suggestions on how to improve model accuracy. Needs Log AI Usage." />
                      </div>
                    </ModalSection>
                  </>
                )}
                {step === 1 && (
                  <ModalSection title="Main Section" description="Every model starts with one section for the whole document.">
                    <DropdownField
                      label="Find this section"
                      choiceLabels={['In the whole document', 'On a range of pages', 'At the end of the document']}
                      choiceValues={['GENERAL', 'PAGE_RANGE', 'END']}
                      value="GENERAL"
                      marginBelow="NONE"
                    />
                  </ModalSection>
                )}
                {step === 2 && (
                  <ModalSection title="Choose a method">
                    <RadioButtonField
                      label="Choose a method"
                      labelPosition="COLLAPSED"
                      choiceStyle="CARDS"
                      choiceLayout="COMPACT"
                      choiceLabels={CREATE_METHODS.map(option => option.title)}
                      choiceValues={CREATE_METHODS.map(option => option.value)}
                      value={method}
                      saveInto={value => setMethod(value as string)}
                      marginBelow="NONE"
                    />
                  </ModalSection>
                )}
                {step === 3 && (
                  <TabsField
                    tabs={[
                      {
                        value: 'definition',
                        label: 'Field Definition',
                        content: (
                          <div className="flex flex-col gap-3 rounded-sm border border-gray-200 bg-white p-4">
                            <div className="grid items-end gap-3 xl:grid-cols-[1fr_1fr_9rem_5rem_10rem_1fr]">
                              <TextField label="Label" marginBelow="NONE" />
                              <TextField label="Key" marginBelow="NONE" />
                              <DropdownField
                                label="Data Type"
                                choiceLabels={DATA_TYPES.labels}
                                choiceValues={DATA_TYPES.values}
                                value="TEXT"
                                marginBelow="NONE"
                              />
                              <CheckboxField
                                label="List"
                                choiceLabels={['Yes']}
                                choiceValues={['yes']}
                                value={[]}
                                marginBelow="NONE"
                              />
                              <DropdownField
                                label="Method"
                                choiceLabels={METHODS.labels}
                                choiceValues={METHODS.values}
                                value="GENAI"
                                marginBelow="NONE"
                              />
                              <TextField label="Instructions" placeholder="Enter prompt" marginBelow="NONE" />
                            </div>
                            <div>
                              <ButtonWidget label="Add Row" icon="Plus" style="LINK" size="SMALL" />
                            </div>
                          </div>
                        ),
                      },
                      {
                        value: 'extraction',
                        label: 'Extraction Details',
                        content: <Secondary text="Where each field is looked for, and how it is read." />,
                      },
                      {
                        value: 'reconciliation',
                        label: 'Reconciliation',
                        content: <Secondary text="How a reviewer checks each value that is found." />,
                      },
                    ]}
                    defaultValue="definition"
                    marginBelow="NONE"
                  />
                )}
                {step === 4 && (
                  <>
                    <ModalSection title="Role" description="Who the model is, in a sentence.">
                      <ParagraphField
                        label="Role"
                        labelPosition="COLLAPSED"
                        placeholder="e.g. You are an accounts payable specialist."
                        marginBelow="NONE"
                      />
                    </ModalSection>
                    <ModalSection title="Additional instructions">
                      <ParagraphField
                        label="Additional instructions"
                        labelPosition="COLLAPSED"
                        placeholder="e.g. Invoices arrive as email attachments in mixed formats."
                        marginBelow="NONE"
                      />
                    </ModalSection>
                  </>
                )}
              </ModalHero>
            </div>
          </Modal>
        )}
      </Opener>
    )
  },
  play: async ({ canvasElement }) => {
    const dialog = await openModal(canvasElement, 'Create an extraction model')
    await expect(dialog.getByRole('heading', { name: 'Model Details' })).toBeVisible()
    await expect(dialog.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    await userEvent.click(dialog.getByRole('button', { name: 'Next' }))
    await expect(dialog.getByRole('heading', { name: 'Configure Sections' })).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Next' }))
    await expect(dialog.getByRole('heading', { name: 'Create Fields' })).toBeVisible()
    // A finished step in the list goes back to it
    await userEvent.click(dialog.getByRole('button', { name: /Details/ }))
    await expect(dialog.getByRole('heading', { name: 'Model Details' })).toBeVisible()
    await userEvent.click(dialog.getByRole('button', { name: 'Close dialog' }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}
