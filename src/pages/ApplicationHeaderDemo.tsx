import { ApplicationHeader, CardLayout, HeadingField } from '../components'

export default function ApplicationHeaderDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationHeader
        name="Sailwind Component Library"
        userInitials="PL"
        objectType="app"
      />
      
      <div className="container mx-auto px-8 py-8">
        <HeadingField
          text="ApplicationHeader Component"
          size="LARGE"
          headingTag="H1"
          marginBelow="MORE"
        />
        
        <CardLayout padding="MORE" showShadow={true} marginBelow="STANDARD">
          <HeadingField
            text="Basic Usage"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="STANDARD"
          />
          <p className="text-gray-700">The ApplicationHeader component displays the main application header with navigation, controls, and user info.</p>
        </CardLayout>

        <CardLayout padding="MORE" showShadow={true} marginBelow="STANDARD">
          <HeadingField
            text="With Designer Controls"
            size="MEDIUM"
            headingTag="H2"
            marginBelow="STANDARD"
          />
          <ApplicationHeader
            name="My Interface"
            userInitials="JD"
            objectType="interface"
            showDesignerControls={true}
            previewEnabled={false}
            showStoriesView={false}
            onPreviewToggle={(enabled) => console.log('Preview:', enabled)}
            onStoryToggle={() => console.log('Stories toggled')}
            onBackClick={() => console.log('Back clicked')}
          />
        </CardLayout>
      </div>
    </div>
  )
}
