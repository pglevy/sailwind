import { useState } from 'react'
import { CardLayout, HeadingField, TagField, DialogField, ButtonWidget, TextField } from '../components'

export default function DialogDemo() {
  const [basicOpen, setBasicOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john.doe@example.com')

  return (
    <CardLayout
      shape="SEMI_ROUNDED"
      padding="MORE"
      marginBelow="MORE"
      showBorder={true}
      borderColor="#EDEEFA"
      decorativeBarPosition="TOP"
      decorativeBarColor="ACCENT"
    >
      <div className="flex items-center gap-2 mb-4">
        <HeadingField
          text="Dialog Component"
          size="LARGE"
          headingTag="H2"
          marginBelow="NONE"
        />
        <TagField
          tags={[{ text: "NEW SAIL", backgroundColor: "#9333EA", textColor: "#FFFFFF" }]}
          size="SMALL"
        />
      </div>
      <p className="text-sm text-gray-700 mb-4">
        Not available in public SAIL - this is a "new SAIL" component following the same patterns and conventions.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Dialog
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Simple dialog with title, description, and content.
          </p>
          
          <DialogField
            open={basicOpen}
            onOpenChange={setBasicOpen}
            trigger={
              <button className="px-4 py-2.5 text-base bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Open Basic Dialog
              </button>
            }
            title="Welcome to Sailwind"
            description="This is a basic dialog example with customizable width and height."
            width="MEDIUM"
            height="AUTO"
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                This dialog demonstrates the basic functionality with a title, description, and content area.
                The dialog can be closed by clicking the X button, pressing Escape, or clicking outside.
              </p>
              <div className="flex justify-end">
                <ButtonWidget
                  label="Got it"
                  style="SOLID"
                  color="ACCENT"
                  saveInto={() => setBasicOpen(false)}
                />
              </div>
            </div>
          </DialogField>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Form Dialog
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Dialog containing form fields with wider layout.
          </p>
          
          <DialogField
            open={formOpen}
            onOpenChange={setFormOpen}
            trigger={
              <button className="px-4 py-2.5 text-base border-2 border-blue-500 text-blue-500 bg-white rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Edit Profile
              </button>
            }
            title="Edit Profile"
            description="Update your profile information below."
            width="MEDIUM_PLUS"
            height="FIT"
          >
            <div className="space-y-4">
              <TextField
                label="Full Name"
                value={name}
                saveInto={(value) => setName(value)}
                required={true}
              />
              <TextField
                label="Email Address"
                value={email}
                saveInto={(value) => setEmail(value)}
                required={true}
              />
              <div className="flex justify-end gap-2 pt-4">
                <ButtonWidget
                  label="Cancel"
                  style="GHOST"
                  color="SECONDARY"
                  saveInto={() => setFormOpen(false)}
                />
                <ButtonWidget
                  label="Save Changes"
                  style="SOLID"
                  color="ACCENT"
                  saveInto={() => setFormOpen(false)}
                />
              </div>
            </div>
          </DialogField>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirmation Dialog
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Narrow dialog for confirmations and alerts.
          </p>
          
          <DialogField
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            trigger={
              <button className="px-4 py-2.5 text-base bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500">
                Delete Item
              </button>
            }
            title="Confirm Deletion"
            description="This action cannot be undone."
            width="NARROW"
            height="AUTO"
            closeOnOutsideClick={false}
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this item? This action is permanent and cannot be reversed.
              </p>
              <div className="flex justify-end gap-2">
                <ButtonWidget
                  label="Cancel"
                  style="GHOST"
                  color="SECONDARY"
                  saveInto={() => setConfirmOpen(false)}
                />
                <ButtonWidget
                  label="Delete"
                  style="SOLID"
                  color="NEGATIVE"
                  saveInto={() => setConfirmOpen(false)}
                />
              </div>
            </div>
          </DialogField>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Size Examples
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Different width and height configurations.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <DialogField
              trigger={
                <button className="px-3 py-1.5 text-sm border-2 border-gray-700 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Wide Dialog
                </button>
              }
              title="Wide Dialog"
              width="WIDE"
              height="MEDIUM"
            >
              <p className="text-gray-700">
                This is a wide dialog with medium height. Perfect for displaying detailed content
                or complex forms that need more horizontal space.
              </p>
            </DialogField>

            <DialogField
              trigger={
                <button className="px-3 py-1.5 text-sm border-2 border-gray-700 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Tall Dialog
                </button>
              }
              title="Tall Dialog"
              width="MEDIUM"
              height="TALL"
            >
              <div className="space-y-4">
                <p className="text-gray-700">This is a tall dialog with fixed height.</p>
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="text-gray-600">
                    Content item {i + 1} - This dialog has a fixed tall height with scrollable content.
                  </p>
                ))}
              </div>
            </DialogField>

            <DialogField
              trigger={
                <button className="px-3 py-1.5 text-sm border-2 border-gray-700 text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Full Width (FIT)
                </button>
              }
              title="Full Width Dialog"
              width="FIT"
              height="AUTO"
            >
              <p className="text-gray-700">
                This dialog uses FIT width to take up most of the screen width while still showing some content underneath.
              </p>
            </DialogField>
          </div>
        </div>
      </div>
    </CardLayout>
  )
}
