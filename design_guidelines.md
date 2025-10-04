# Design Guidelines: Retail Manager Budget & Resource Tracker

## Design Approach
**System-Based with Modern Dashboard Inspiration**: Drawing from Linear's clean data presentation, Notion's organizational clarity, and Material Design's structured components. Focus on clarity, efficiency, and data comprehension over visual decoration.

**Key Principles:**
- Function over form: Every element serves a purpose
- Data clarity: Information hierarchy guides user attention
- Efficient workflows: Minimize clicks to access critical data
- Professional aesthetic: Trust-building visual language

## Core Design Elements

### A. Color Palette

**Dark Mode Primary** (default):
- Background: 222 14% 11%
- Surface: 222 14% 15%
- Surface Elevated: 222 14% 18%
- Primary Action: 212 95% 58%
- Success/On-track: 142 76% 36%
- Warning/At-risk: 38 92% 50%
- Error/Over-budget: 0 84% 60%
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 71%
- Border: 222 14% 25%

**Light Mode**:
- Background: 0 0% 100%
- Surface: 0 0% 98%
- Surface Elevated: 0 0% 96%
- Primary Action: 212 95% 48%
- Text Primary: 222 14% 11%
- Text Secondary: 222 14% 45%

### B. Typography

**Font Stack**: 
- Primary: 'Inter' (Google Fonts) - clean, readable for data
- Monospace: 'JetBrains Mono' - for numerical values, code

**Type Scale**:
- Dashboard Title: 2xl font-semibold
- Section Headers: xl font-medium
- Card Titles: base font-medium
- Data Labels: sm font-normal text-secondary
- Data Values: lg font-semibold (numerical), base font-medium (text)
- Buttons: sm font-medium
- Table Headers: xs font-medium uppercase tracking-wide

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16 consistently
- Component padding: p-6
- Section gaps: gap-6 or gap-8
- Card spacing: p-6 with gap-4 for internal elements
- Dashboard margins: p-8

**Grid Structure**:
- Sidebar navigation: w-64 fixed
- Main content: flex-1 with max-w-7xl mx-auto
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Responsive breakpoints align with Tailwind defaults

### D. Component Library

**Navigation**:
- Fixed left sidebar with icon + label format
- Sections: Dashboard, Projects, Resources, Reports, Settings
- Active state: Primary color background with rounded-lg
- Hover: Surface elevated background

**Dashboard Cards**:
- White/Surface background with border
- Rounded-xl corners
- Budget summary card with circular progress indicator
- Resource utilization horizontal bar chart
- Recent projects list with status badges
- Quick stats grid showing key metrics

**Project Cards**:
- Header: Project name (font-medium) + status badge (pill-shaped, small)
- Progress bar showing budget consumed (height-2, rounded-full)
- Metrics row: Budget | Spent | Remaining in grid layout
- Resource count with avatars (max 3 visible + "+N more")
- Action menu (three dots) top-right
- Color-coded alert badges for over-budget (subtle, not alarming)

**Data Tables**:
- Sticky header with sort indicators
- Row hover: Subtle background change
- Zebra striping optional (every other row slightly darker)
- Action buttons: Icon-only on row hover
- Pagination at bottom-right

**Forms & Inputs**:
- Dark mode: Surface elevated background, border on focus (primary color)
- Labels: Text-sm font-medium mb-2
- Input height: h-10 or h-11 for better touch targets
- Select dropdowns with search capability for resources
- Date pickers: Clean, integrated calendar widget

**Charts & Visualizations**:
- Use Chart.js or Recharts library
- Budget pie chart: Allocated vs Spent vs Remaining
- Timeline Gantt chart for project milestones
- Resource allocation bar chart by team member
- Color consistent with status (success, warning, error)
- Tooltips on hover with detailed data

**Export Functionality**:
- Prominent "Export" button (outline variant) in toolbar
- Dropdown menu: "Export as CSV" | "Export as Excel"
- Success toast notification post-export
- Download icon from Heroicons library

**Status Indicators**:
- Pills/badges: rounded-full px-3 py-1 text-xs font-medium
- On Track: Success color with lighter background
- At Risk: Warning color with lighter background
- Over Budget: Error color with lighter background
- Completed: Neutral gray tone

**Modals & Overlays**:
- Create/Edit Project modal: max-w-2xl centered
- Backdrop: bg-black/50 backdrop-blur-sm
- Modal: Surface elevated background, rounded-xl, p-6
- Close button: top-right with hover state

### E. Animations
Use sparingly:
- Smooth transitions on hover states (150ms ease)
- Modal slide-in (200ms ease-out)
- Data loading skeleton screens (pulse animation)
- NO complex scroll animations or decorative motion

## Key Feature Layouts

**Dashboard Overview**:
- Top metrics bar: 4 stat cards (Total Budget, Active Projects, Resource Utilization %, Overdue Tasks)
- Middle section: 2-column grid (Budget Overview Chart | Resource Allocation Chart)
- Bottom section: Recent Projects table with inline actions

**Project Detail View**:
- Header: Project name, status, edit/delete actions
- Budget tracker: Visual progress with alert threshold indicators
- Resource assignment section: Avatar grid with allocation percentages
- Timeline view: Gantt-style milestone tracker
- Notes/comments area at bottom

**Resource Management**:
- Left: Team member list with availability indicators
- Right: Assignment calendar/grid showing allocations
- Filter bar: By department, availability, skills

**Export Interface**:
- Filter options before export (date range, projects, metrics)
- Preview table of data to be exported
- Format selection (CSV/Excel) with file naming
- Clear success confirmation

## Images
No hero images needed - this is a utility dashboard tool where immediate data access is priority. Use icons from Heroicons library throughout for navigation and actions (ChartBarIcon, UserGroupIcon, DocumentArrowDownIcon, etc.).