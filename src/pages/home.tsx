import { HeadingField, TagField } from '../components'
import { TableOfContents } from '../components/TableOfContents'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <HeadingField
            text="Sailwind"
            size="EXTRA_LARGE"
            headingTag="H1"
            color="ACCENT"
            marginBelow="EVEN_LESS"
          />
          <p className="text-lg text-gray-700 mb-4">
            React component library for rapid prototyping of Appian applications
          </p>
          <TagField
            tags={[{ text: "SAIL-Compatible", backgroundColor: "ACCENT" }]}
            size="STANDARD"
            align="CENTER"
          />
        </div>

        {/* Table of Contents */}
        <TableOfContents />
      </div>
    </div>
  )
}
