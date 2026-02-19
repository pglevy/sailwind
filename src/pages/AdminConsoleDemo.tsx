import * as React from 'react'
import { ApplicationHeader } from '../components/ApplicationHeader'
import { SideNavAdmin } from '../components/SideNavAdmin'
import { HeadingField } from '../components/Heading'
import { CardLayout } from '../components/Card'
import { TextItem } from '../components/RichText/TextItem'
import { RichTextDisplayField } from '../components/RichText/RichTextDisplayField'

export default function AdminConsoleDemo() {
  const [activePage, setActivePage] = React.useState('Branding')

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationHeader
        name="Appian Administration Console"
        userInitials="AD"
        iconSrc="images/icon-cog.svg"
        additionalButtons={[
          {
            label: 'Export',
            style: 'OUTLINE',
            size: 'SMALL',
            color: 'ACCENT',
            onClick: () => console.log('Export clicked'),
          },
          {
            label: 'Import',
            style: 'OUTLINE',
            size: 'SMALL',
            color: 'ACCENT',
            onClick: () => console.log('Import clicked'),
          },
        ]}
      />

      <div className="flex h-[calc(100vh-3.5rem)]">
        <aside className="overflow-y-auto border-r border-gray-200 shrink-0">
          <SideNavAdmin
            activeItem={activePage}
            onItemClick={setActivePage}
          />
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <HeadingField
            text={activePage}
            size="LARGE"
            headingTag="H1"
            marginBelow="STANDARD"
          />
          <CardLayout padding="MORE" showShadow={true}>
            <RichTextDisplayField
              value={[
                <TextItem
                  key="placeholder"
                  text={`Content area for the "${activePage}" admin page.`}
                  color="SECONDARY"
                />,
              ]}
            />
          </CardLayout>
        </main>
      </div>
    </div>
  )
}
