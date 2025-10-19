import { Link } from 'wouter'
import { HeadingField, ButtonWidget } from '../components'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <HeadingField
          text="Page Not Found"
          size="LARGE_PLUS"
          headingTag="H1"
          marginBelow="STANDARD"
        />
        <p className="text-base text-gray-700 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <ButtonWidget
            label="Go Home"
            style="SOLID"
            color="ACCENT"
            size="STANDARD"
          />
        </Link>
      </div>
    </div>
  )
}
