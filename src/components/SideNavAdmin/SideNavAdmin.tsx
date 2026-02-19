import * as React from 'react'
import { RichTextDisplayField } from '../RichText/RichTextDisplayField'
import { TextItem } from '../RichText/TextItem'
import { Icon } from '../RichText/Icon'

export interface NavItem {
  label: string
  link?: () => void
}

export interface NavSection {
  heading: string
  items: NavItem[]
}

export interface SideNavAdminProps {
  /** Navigation sections with headings and items */
  sections?: NavSection[]
  /** Label of the currently active/selected item */
  activeItem?: string
  /** Callback when a nav item is clicked */
  onItemClick?: (label: string) => void
}

const DEFAULT_SECTIONS: NavSection[] = [
  {
    heading: 'SYSTEM',
    items: [
      { label: 'Branding' },
      { label: 'Data Retention' },
      { label: 'File Upload' },
      { label: 'Internationalization' },
      { label: 'Mobile' },
      { label: 'Permissions' },
      { label: 'Plug-ins' },
      { label: 'Portals' },
      { label: 'Typefaces' },
      { label: 'User Start Pages' },
    ],
  },
  {
    heading: 'AUTHENTICATION',
    items: [
      { label: 'Appian' },
      { label: 'LDAP' },
      { label: 'Maintenance Window' },
      { label: 'Sign-In Page' },
      { label: 'Single Sign-On' },
      { label: 'Users' },
      { label: 'Web API Authentication' },
    ],
  },
  {
    heading: 'DEVOPS',
    items: [
      { label: 'Deployment' },
      { label: 'Health Check' },
      { label: 'Infrastructure' },
    ],
  },
  {
    heading: 'INTEGRATION',
    items: [
      { label: 'AI Services' },
      { label: 'Certificates' },
      { label: 'Data Sources' },
      { label: 'Email' },
      { label: 'Embedded Interfaces' },
      { label: 'HTTP Proxy' },
      { label: 'Legacy Web Services' },
      { label: 'Logging' },
      { label: 'Microsoft Office' },
      { label: 'Third-Party Credentials' },
      { label: 'WalkMe' },
    ],
  },
  {
    heading: 'MONITORING',
    items: [
      { label: 'Current User Activity' },
      { label: 'Document Reports' },
      { label: 'Import History' },
      { label: 'Rule Performance' },
    ],
  },
  {
    heading: 'ENGINEERING',
    items: [
      { label: 'Data Calls by Request' },
      { label: 'Development Configurations' },
      { label: 'Feature Toggles' },
    ],
  },
]

/**
 * SideNavAdmin Component
 * Admin console side navigation with grouped sections and active item indicator
 */
export const SideNavAdmin: React.FC<SideNavAdminProps> = ({
  sections = DEFAULT_SECTIONS,
  activeItem = 'Branding',
  onItemClick,
}) => {
  return (
    <nav className="py-4 px-4 w-64" aria-label="Admin navigation">
      {sections.map((section) => (
        <div key={section.heading} className="mb-4">
          <RichTextDisplayField
            marginBelow="EVEN_LESS"
            value={[
              <TextItem
                key="heading"
                text={section.heading}
                size="SMALL"
                color="SECONDARY"
              />,
            ]}
          />
          <ul className="list-none p-0 m-0 pl-3">
            {section.items.map((item) => {
              const isActive = item.label === activeItem
              return (
                <li key={item.label} className="mb-1">
                  <RichTextDisplayField
                    marginBelow="EVEN_LESS"
                    value={
                      isActive
                        ? [
                            <TextItem
                              key="label"
                              text={item.label}
                              style="STRONG"
                              color="STANDARD"
                              size="SMALL"
                            />,
                            <span key="spacer">&nbsp;&nbsp;</span>,
                            <Icon
                              key="caret"
                              icon="chevron-right"
                              size="SMALL"
                              color="STANDARD"
                            />,
                          ]
                        : [
                            <TextItem
                              key="label"
                              text={item.label}
                              color="ACCENT"
                              size="SMALL"
                              link={
                                item.link ||
                                (onItemClick
                                  ? () => onItemClick(item.label)
                                  : undefined)
                              }
                              linkStyle="STANDALONE"
                            />,
                          ]
                    }
                  />
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
