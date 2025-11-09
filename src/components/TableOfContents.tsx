import { useLocation } from 'wouter'
import { CardLayout } from './Card/CardLayout'
import { HeadingField } from './Heading/HeadingField'
import { RichTextDisplayField, TextItem } from './RichText'

interface TocItem {
  title: string
  path: string
  description?: string
}

interface TocGroup {
  title: string
  items: TocItem[]
}

const tocConfig: TocGroup[] = [
  {
    title: "Component Library",
    items: [
      {
        title: "Components",
        path: "/components",
        description: "Interactive component demos and documentation"
      }
    ]
  },
  {
    title: "Interface Patterns",
    items: [
      {
        title: "Task Dashboard",
        path: "/patterns/taskdashboard",
        description: "Task management interface with status tracking"
      },
      {
        title: "Application Status",
        path: "/patterns/applicationstatus",
        description: "Application review and approval workflow"
      },
      {
        title: "Document Review",
        path: "/patterns/documentreview",
        description: "Document approval and feedback interface"
      },
      {
        title: "User Profile",
        path: "/patterns/userprofile",
        description: "User information and settings management"
      },
      {
        title: "Form Entry",
        path: "/patterns/formentry",
        description: "Data entry form with validation"
      },
      {
        title: "Publications",
        path: "/patterns/publications",
        description: "List of items in a card with tags and filtering"
      }
    ]
  },
  {
    title: "Pages",
    items: [
      {
        title: "Button + TextField Alignment Test",
        path: "/buttontextfieldtest",
        description: "Test page for TextField and button vertical alignment"
      },
      {
        title: "ESG Conference Registration",
        path: "/esgconferenceregistration",
        description: "Event registration with multiple steps"
      },
      {
        title: "Insurance Quote Wizard",
        path: "/insurancequotewizard",
        description: "Multi-step insurance quote process"
      }
    ]
  }
]

const TocItemComponent = ({ item }: { item: TocItem }) => {
  const [, setLocation] = useLocation()
  
  return (
    <div className="mb-4">
      <RichTextDisplayField
        value={[
          <TextItem
            key="title"
            text={item.title}
            color="ACCENT"
            size='MEDIUM'
            link={() => setLocation(item.path)}
            linkStyle="STANDALONE"
          />,
          <br />, 
          <TextItem
              key="desc"
              text={item.description}
              color="SECONDARY"
              size="STANDARD"
            />
        ]}
        marginBelow="EVEN_LESS"
      />
    </div>
  )
}

const TocGroupComponent = ({ group }: { group: TocGroup }) => (
  <div>
    <HeadingField
      text={group.title}
      size="MEDIUM"
      fontWeight='SEMI_BOLD'
      headingTag="H2"
      marginBelow="STANDARD"
    />
    <div className="space-y-2">
      {group.items.map((item, index) => (
        <TocItemComponent key={index} item={item} />
      ))}
    </div>
  </div>
)

export const TableOfContents = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <HeadingField
        text="Table of Contents"
        size="LARGE"
        headingTag="H2"
        align="CENTER"
        marginBelow="EVEN_LESS"
      />
      <RichTextDisplayField
        value={["Explore the available components and example interfaces"]}
        align="CENTER"
        marginBelow="MORE"
      />
      <CardLayout padding="MORE" marginBelow="NONE" showBorder={false} showShadow={true}>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <TocGroupComponent group={tocConfig[0]} />
            <TocGroupComponent group={tocConfig[1]} />
          </div>
          <div>
            <TocGroupComponent group={tocConfig[2]} />
          </div>
        </div>
      </CardLayout>
    </div>
  )
}
