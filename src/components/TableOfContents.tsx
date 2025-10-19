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
    title: "Example Interfaces",
    items: [
      {
        title: "Task Dashboard",
        path: "/examples/taskdashboard",
        description: "Task management interface with status tracking"
      },
      {
        title: "Application Status",
        path: "/examples/applicationstatus", 
        description: "Application review and approval workflow"
      },
      {
        title: "Document Review",
        path: "/examples/documentreview",
        description: "Document approval and feedback interface"
      },
      {
        title: "User Profile",
        path: "/examples/userprofile",
        description: "User information and settings management"
      },
      {
        title: "Form Entry",
        path: "/examples/formentry",
        description: "Data entry form with validation"
      },
      {
        title: "ESG Conference Registration",
        path: "/examples/esgconferenceregistration",
        description: "Event registration with multiple steps"
      },
      {
        title: "Insurance Quote Wizard",
        path: "/examples/insurancequotewizard",
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
          {tocConfig.map((group, index) => (
            <TocGroupComponent key={index} group={group} />
          ))}
        </div>
      </CardLayout>
    </div>
  )
}
