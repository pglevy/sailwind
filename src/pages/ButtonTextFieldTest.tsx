import { TextField } from '../components/TextField/TextField'
import { ButtonWidget } from '../components/Button/ButtonWidget'

export default function ButtonTextFieldTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-8 py-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          TextField + Button Alignment Test
        </h1>

        {/* Test 1: Search box pattern */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search Box Pattern
          </h2>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <TextField
                label="Search"
                placeholder="Enter search term..."
                labelPosition="ABOVE"
                marginBelow="NONE"
              />
            </div>
            <ButtonWidget
              label="Search"
              size="SMALL"
              style="SOLID"
              color="ACCENT"
            />
          </div>
        </div>

        {/* Test 2: Inline form without label */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Inline Form (Collapsed Label)
          </h2>
          <div className="flex gap-2 items-center">
            <TextField
              label="Email"
              labelPosition="COLLAPSED"
              placeholder="Enter your email"
              marginBelow="NONE"
            />
            <ButtonWidget
              label="Subscribe"
              size="SMALL"
              style="SOLID"
              color="ACCENT"
            />
          </div>
        </div>

        {/* Test 3: Filter bar */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Filter Bar
          </h2>
          <div className="flex gap-2 items-end">
            <TextField
              label="Name"
              placeholder="Filter by name"
              marginBelow="NONE"
            />
            <TextField
              label="Status"
              placeholder="Filter by status"
              marginBelow="NONE"
            />
            <ButtonWidget
              label="Apply"
              size="SMALL"
              style="SOLID"
              color="ACCENT"
            />
            <ButtonWidget
              label="Clear"
              size="SMALL"
              style="OUTLINE"
              color="SECONDARY"
            />
          </div>
        </div>

        {/* Test 4: Size comparison */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Button Size Comparison with TextField
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <TextField label="SMALL Button" marginBelow="NONE" />
              <ButtonWidget label="Small" size="SMALL" style="SOLID" color="ACCENT" />
            </div>
            <div className="flex gap-2 items-end">
              <TextField label="STANDARD Button" marginBelow="NONE" />
              <ButtonWidget label="Standard" size="STANDARD" style="SOLID" color="ACCENT" />
            </div>
            <div className="flex gap-2 items-end">
              <TextField label="MEDIUM Button" marginBelow="NONE" />
              <ButtonWidget label="Medium" size="MEDIUM" style="SOLID" color="ACCENT" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
