# Sailwind Vibes

Example interfaces ("vibes") demonstrating Sailwind components in realistic Appian-style applications.

## Available Vibes

### 1. Task Dashboard (`TaskDashboard.tsx`)
A project task management interface showing:
- High priority, in-progress, and completed tasks
- Progress bars for task completion
- Status tags with semantic colors
- Card layouts with decorative bars
- Action buttons for task management

**Components used:**
- CardLayout with decorative bars
- HeadingField for titles
- TagField for status indicators
- ProgressBar for completion tracking
- ButtonArrayLayout for actions
- MessageBanner for notifications

### 2. Application Status (`ApplicationStatus.tsx`)
An application review workflow showing:
- Application metadata and details
- Status summary cards
- Document information grid
- Review timeline with status indicators
- Multiple action buttons

**Components used:**
- CardLayout with grid layouts
- HeadingField for section titles
- TagField for categories and status
- RichTextDisplayField for formatted content
- MessageBanner for status updates
- ButtonArrayLayout for multiple actions

### 3. Document Review (`DocumentReview.tsx`)
A contract review interface showing:
- Document metadata and information
- Review summary with metrics
- Review history from multiple stakeholders
- Action buttons for approval workflow

**Components used:**
- CardLayout with complex nested layouts
- HeadingField for document titles
- RichTextDisplayField with mixed content
- TagField for document categories
- MessageBanner for urgent actions
- Custom metric cards with color coding

### 4. User Profile (`UserProfile.tsx`)
A comprehensive user profile page showing:
- User header with contact info
- About section with bio and details
- Skills & expertise with progress bars
- Recent activity timeline
- Certifications showcase

**Components used:**
- CardLayout for section organization
- HeadingField for section titles
- RichTextDisplayField with icons
- ProgressBar for skill levels
- TagField for roles and categories
- Icon integration throughout

## Key Patterns Demonstrated

### Layout Patterns
- Grid layouts using Tailwind classes
- Card-based sections with decorative bars
- Sticky navigation headers
- Responsive column layouts

### Color Usage
- Semantic colors (ACCENT, POSITIVE, NEGATIVE)
- Custom hex colors for branding
- Consistent color families (50, 100, 200, 500, 700, 900)
- Light backgrounds with dark text

### Typography
- Heading hierarchy (H1, H2, H3)
- Font weight variations (BOLD, SEMI_BOLD, REGULAR)
- Rich text with mixed styles
- Icon + text combinations

### Interactive Elements
- Button groups with multiple actions
- Status-based styling
- Progress tracking
- Timeline visualizations

## SAIL Compatibility

All vibes use SAIL-exact parameter names and values:
- `size="STANDARD"` not `size="standard"`
- `align="START"` not `align="left"`
- `backgroundColor="ACCENT"` not `backgroundColor="blue"`

These examples can be translated almost directly to SAIL code for Appian production use.

## Usage

The vibes are integrated into the main App.tsx with navigation buttons. Click through each vibe to see:
1. How components work together
2. Realistic data structures
3. Common Appian interface patterns
4. SAIL-compatible styling

## Adding New Vibes

To add a new vibe:
1. Create a new file in `src/vibes/YourVibe.tsx`
2. Export the component from `src/vibes/index.ts`
3. Import and add navigation in `App.tsx`
4. Follow existing patterns for consistency
5. Use only existing Sailwind components
6. Maintain SAIL parameter naming conventions
