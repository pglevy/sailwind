import * as React from 'react'
import { CardLayout } from '../components/Card/CardLayout'
import { HeadingField } from '../components/Heading/HeadingField'
import { TextField } from '../components/TextField/TextField'
import { DropdownField } from '../components/Dropdown/DropdownField'
import { ButtonArrayLayout } from '../components/Button/ButtonArrayLayout'
import { TagField } from '../components/Tag/TagField'
import { Book, FileText } from 'lucide-react'

// Sample publication data
interface Publication {
  title: string
  publishing: string
  tags: string[]
  icon: 'book' | 'doc'
}

const PUBLICATIONS: Publication[] = [
  {
    title: 'Tradition Japanese Literature Through an American Lens',
    publishing: 'University of Central Vermont Press, 2017, Walton, M.; Adams, J.',
    tags: ['PERSPECTIVE PIECE', 'TRADITIONS', 'LITERATURE'],
    icon: 'book'
  },
  {
    title: 'The Tale of Genji Revisited',
    publishing: 'Asian Literature Quarterly, Mar 2016. Walton, M.',
    tags: ['HISTORY', 'REVIEW'],
    icon: 'doc'
  },
  {
    title: 'Essential Works of Japanese Literature: An Annotated Collection',
    publishing: 'Adams Press, Sep 2015, Walton, M., Shikibu, M., Ichiyo, H., Soseki, N., Naoya, S., Kawabata, Y., Shohei, O., Mishima, Y.',
    tags: ['HISTORY', 'LITERATURE', 'ANTHOLOGY'],
    icon: 'book'
  },
  {
    title: '"I Am a Cat": Natsume\'s Prescient Observations',
    publishing: 'Kansai Review, Jun 2015. Walton, M., Takahashi, K.',
    tags: ['PSYCHOLOGY', 'REVIEW'],
    icon: 'doc'
  }
]

/**
 * Publications Page
 * Displays a list of academic publications with search, filtering, and tagging functionality
 */
export const Publications: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterType, setFilterType] = React.useState('')

  // Filter publications based on search and type
  const filteredPublications = PUBLICATIONS.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.publishing.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterType || pub.icon === filterType
    return matchesSearch && matchesFilter
  })

  const handleUpdate = () => {
    // Placeholder for update functionality
    console.log('Update clicked')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Page Heading */}
      <HeadingField
        text="Publications"
        size="MEDIUM_PLUS"
        fontWeight="BOLD"
        marginBelow="STANDARD"
      />

      <CardLayout
        shape="SEMI_ROUNDED"
        padding="STANDARD"
        showBorder={true}
        showShadow={true}
        marginBelow="STANDARD"
      >
        {/* Search, Filter, and Update Controls */}
        <div className="flex gap-4 items-end mb-6">
          <div className="flex-1">
            <TextField
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={setSearchTerm}
              labelPosition="COLLAPSED"
              marginBelow="NONE"
            />
          </div>

          <div className="flex-1">
            <DropdownField
              choiceLabels={['All', 'Books', 'Documents']}
              choiceValues={['', 'book', 'doc']}
              value={filterType}
              onChange={setFilterType}
              placeholder="Select type..."
              marginBelow="NONE"
            />
          </div>

          <ButtonArrayLayout
            buttons={[
              {
                label: 'Update',
                style: 'OUTLINE',
                color: 'ACCENT',
                size: 'STANDARD',
                onClick: handleUpdate,
                className: 'border-1'
              }
            ]}
            marginBelow="NONE"
          />
        </div>

        {/* Publications List */}
        <div className="space-y-4">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((publication, index) => (
              <div key={index} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
                {/* Publication Title with Icon */}
                <div className="flex items-start gap-3 mb-2">
                  {publication.icon === 'book' ? (
                    <Book size={20} className="text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <FileText size={20} className="text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <h3 className="text-base font-medium text-blue-500 flex-1">
                    {publication.title}
                  </h3>
                </div>

                {/* Publishing Info */}
                <p className="text-sm text-gray-700 mb-3 ml-7">
                  {publication.publishing}
                </p>

                {/* Tags */}
                <div className="ml-7">
                  <TagField
                    tags={publication.tags.map(tag => ({
                      text: tag,
                      backgroundColor: 'SECONDARY',
                      textColor: 'STANDARD'
                    }))}
                    size="SMALL"
                    align="START"
                    marginBelow="NONE"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No publications found matching your search.
            </div>
          )}
        </div>
      </CardLayout>
    </div>
  )
}

export default Publications
