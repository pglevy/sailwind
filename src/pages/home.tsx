import { HeadingField } from '../components'
import { TableOfContents } from '../components/TableOfContents'

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <HeadingField
            text="Sailwind"
            size="LARGE_PLUS"
            headingTag="H1"
            color="ACCENT"
            marginBelow="NONE"
            align='CENTER'
            fontWeight='BOLD'
          />
        </div>

        {/* Table of Contents */}
        <TableOfContents />
      </div>
    </div>
  )
}
