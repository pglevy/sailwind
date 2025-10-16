import { CardLayout, HeadingField, ImageField } from '../components'

export default function ImageDemo() {
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
      <HeadingField
        text="Image Component"
        size="LARGE"
        headingTag="H2"
        marginBelow="STANDARD"
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Basic Document Images (Medium Size)
          </h3>
          <ImageField
            label="Project Screenshots"
            instructions="Sample images from the project"
            images={[
              { document: "vite.svg", altText: "Vite logo", caption: "Vite build tool logo" },
              { document: "vite.svg", altText: "Another Vite logo", caption: "Second image example" }
            ]}
            size="MEDIUM"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Small Icons
          </h3>
          <ImageField
            label="Status Icons"
            images={[
              { document: "vite.svg", altText: "Status icon 1" },
              { document: "vite.svg", altText: "Status icon 2" },
              { document: "vite.svg", altText: "Status icon 3" }
            ]}
            size="ICON_PLUS"
            align="START"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Avatar Style (Circular)
          </h3>
          <ImageField
            label="Team Members"
            images={[
              { document: "vite.svg", altText: "Team member 1", caption: "John Doe" },
              { document: "vite.svg", altText: "Team member 2", caption: "Jane Smith" },
              { document: "vite.svg", altText: "Team member 3", caption: "Bob Johnson" }
            ]}
            size="SMALL_PLUS"
            style="AVATAR"
            align="CENTER"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Gallery Layout
          </h3>
          <ImageField
            label="Image Gallery"
            instructions="Horizontal gallery layout"
            images={[
              { document: "vite.svg", altText: "Gallery image 1" },
              { document: "vite.svg", altText: "Gallery image 2" },
              { document: "vite.svg", altText: "Gallery image 3" },
              { document: "vite.svg", altText: "Gallery image 4" }
            ]}
            size="GALLERY"
            align="CENTER"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Large Images with Fit Size
          </h3>
          <ImageField
            label="Hero Images"
            images={[
              { document: "vite.svg", altText: "Hero image", caption: "Main banner image" }
            ]}
            size="FIT"
            align="CENTER"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Adjacent Label Position
          </h3>
          <ImageField
            label="Profile Picture"
            labelPosition="ADJACENT"
            images={[
              { document: "uifaces-human-avatar.jpg", altText: "Profile picture", caption: "User avatar" }
            ]}
            size="MEDIUM"
            style="AVATAR"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            User Images (Within ImageField)
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            User images use Radix Avatar for automatic fallback handling (user initials or default icon).
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">User with Photo</p>
              <ImageField
                labelPosition="COLLAPSED"
                images={[
                  {
                    imageType: 'user',
                    user: { name: "Jane Smith", photoUrl: "uifaces-human-avatar.jpg", initials: "JS" },
                    altText: "Jane Smith profile photo",
                    caption: "Click to view profile"
                  }
                ]}
                style="AVATAR"
                size="MEDIUM"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Fallback to Initials (Multiple Sizes)</p>
              <ImageField
                labelPosition="COLLAPSED"
                images={[
                  {
                    imageType: 'user',
                    user: { name: "Jane Doe", initials: "JD" }
                  },
                  {
                    imageType: 'user',
                    user: { name: "Bob Johnson", initials: "BJ" }
                  },
                  {
                    imageType: 'user',
                    user: { name: "Alice Williams", initials: "AW" }
                  }
                ]}
                style="AVATAR"
                size="TINY"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Fallback to Default Icon (No Initials)</p>
              <ImageField
                labelPosition="COLLAPSED"
                images={[
                  {
                    imageType: 'user',
                    user: { name: "Anonymous User" }
                  }
                ]}
                style="AVATAR"
                size="SMALL"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-sm">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          SAIL Translation Example
        </h4>
        <pre className="text-xs text-gray-900 overflow-x-auto">
{`a!imageField(
  label: "Project Screenshots",
  instructions: "Sample images from the project",
  images: {
    a!documentImage(
      document: cons!PROJECT_SCREENSHOT_1,
      altText: "Main dashboard view",
      caption: "Dashboard showing key metrics"
    ),
    a!documentImage(
      document: cons!PROJECT_SCREENSHOT_2,
      altText: "Settings panel",
      caption: "User configuration options"
    )
  },
  size: "MEDIUM"
)`}
        </pre>
      </div>
    </CardLayout>
  )
}
