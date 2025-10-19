import { Link } from 'wouter'

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

const TocItemComponent = ({ item }: { item: TocItem }) => (
  <li className="mb-2">
    <Link 
      to={item.path} 
      className="text-blue-500 hover:text-blue-700 underline font-medium"
    >
      {item.title}
    </Link>
    {item.description && (
      <p className="text-sm text-gray-700 mt-1">{item.description}</p>
    )}
  </li>
)

const TocGroupComponent = ({ group }: { group: TocGroup }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-900">
      {group.title}
    </h2>
    <ul className="space-y-2">
      {group.items.map((item, index) => (
        <TocItemComponent key={index} item={item} />
      ))}
    </ul>
  </div>
)

export const TableOfContents = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Table of Contents
      </h2>
      <p className="text-base text-gray-700 mb-8 text-center">
        Explore the available components and example interfaces
      </p>
      <div className="grid gap-8 md:grid-cols-2 bg-white shadow-lg p-8 rounded-lg">
        {tocConfig.map((group, index) => (
          <TocGroupComponent key={index} group={group} />
        ))}
      </div>
    </div>
  )
}
