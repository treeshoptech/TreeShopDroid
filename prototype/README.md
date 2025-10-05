# TreeShopDroid Interactive Prototype

**Live Web Blueprint for Kotlin Android Development**

## Overview

This is a fully interactive web prototype of TreeShopDroid that demonstrates the exact UI/UX and features that will be built in the Android app. Use this as a living reference when implementing the Kotlin version.

## Features Demonstrated

### ✅ Map-First Interface
- **Interactive Leaflet map** with dark theme
- **Workflow-colored markers**:
  - 🔵 Blue = Lead
  - 🟠 Orange = Proposal
  - 🟢 Green = Work Order
  - 🔴 Red = Invoice
  - ⚪ Gray = Completed
- Click markers to view lead details
- Auto-pan to lead locations

### ✅ Navigation System
- **3-tier navigation drawer** (matching iOS design)
  - Tier 1: Main sections (Map)
  - Tier 2: Workflow sections (Leads, Proposals, Work Orders, Invoices)
  - Tier 3: Tools (Calendar, Customers)
- Badge counts for active items
- Smooth Material 3 transitions

### ✅ Lead Management
- **Create new leads** via FAB + modal form
- **View lead details** in bottom sheet
- **Filter leads** by workflow stage
- **List view** with cards
- **Workflow advancement** - move leads through stages

### ✅ Workflow System
```
LEAD → PROPOSAL → WORK_ORDER → INVOICE → COMPLETED
```
One-way advancement with proper validation

### ✅ Material 3 Design
- Dark theme optimized
- Proper elevation and shadows
- Rounded corners (12px, 16px, 20px)
- Color system matching Android
- Typography system
- Interactive states (hover, active)

## Running the Prototype

```bash
cd ~/TreeShopDroid/prototype
npx http-server -p 3005
```

Visit: **http://localhost:3005**

## Sample Data

The prototype includes 5 sample leads across different workflow stages:
- **John Smith** - Lead (Tree Removal, High Priority, $3,500)
- **Sarah Johnson** - Proposal (Tree Trimming, Medium, $1,200)
- **Mike Davis** - Work Order (Stump Grinding, Low, $800)
- **Emily Wilson** - Invoice (Forestry Mulching, Medium, $5,500)
- **David Brown** - Lead (Tree Assessment, Critical, $2,000)

## Interactive Features

### Try These Actions:

1. **Navigation**
   - Click menu icon (☰) to open drawer
   - Switch between Map and Leads views
   - Explore other menu sections

2. **View Leads**
   - Click map markers to see details
   - View leads in bottom sheet
   - Switch to Leads view for list

3. **Create Lead**
   - Click FAB (+) button
   - Fill out form
   - Save and see it on map

4. **Advance Workflow**
   - Open a lead detail
   - Click workflow action button
   - Watch marker color change

5. **Filter Leads**
   - Go to Leads view
   - Click filter chips at top
   - See filtered results

## Mapping to Kotlin Implementation

### UI Components → Compose

**HTML/CSS Component** → **Jetpack Compose Equivalent**

```
Navigation Drawer → ModalNavigationDrawer
Bottom Sheet → ModalBottomSheet
FAB → FloatingActionButton
Cards → Card with MaterialTheme
Buttons → Button, OutlinedButton
Text Fields → OutlinedTextField
App Bar → TopAppBar
```

### JavaScript Functions → Kotlin/ViewModel

```javascript
// Prototype
function saveLead() { ... }
```

```kotlin
// Android Implementation
class AddLeadViewModel : ViewModel() {
    fun saveLead(lead: Lead) { ... }
}
```

### Map → Google Maps Compose

```javascript
// Prototype (Leaflet)
L.circleMarker([lat, lng], { fillColor: color })
```

```kotlin
// Android (Maps Compose)
Marker(
    state = MarkerState(LatLng(lat, lng)),
    icon = BitmapDescriptorFactory.defaultMarker(color)
)
```

### Styling → Material 3 Theme

The CSS variables map directly to Compose Material Theme:

```css
/* Prototype */
--md-sys-color-primary: #D0BCFF;
```

```kotlin
// Android
val LightColorScheme = lightColorScheme(
    primary = Color(0xFFD0BCFF)
)
```

## Design Specifications

### Colors
- **Lead Blue**: `#2196F3`
- **Proposal Orange**: `#FF9800`
- **Work Order Green**: `#4CAF50`
- **Invoice Red**: `#F44336`
- **Completed Gray**: `#9E9E9E`

### Spacing
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- XLarge: 20px
- Round: 24px/28px

### Elevation Shadows
- Level 1: `0 1px 2px rgba(0,0,0,0.3)`
- Level 2: `0 2px 4px rgba(0,0,0,0.3)`
- Level 3: `0 4px 8px rgba(0,0,0,0.3)`
- Level 4: `0 8px 16px rgba(0,0,0,0.4)`

## Files Structure

```
prototype/
├── index.html      # Main structure and components
├── styles.css      # Material 3 design system
├── app.js         # Interactivity and data management
└── README.md      # This file
```

## Key Interactions to Implement

1. **Drawer Toggle**
   - Hamburger menu opens/closes drawer
   - Overlay dims background
   - Click outside to close

2. **Bottom Sheet**
   - Slides up from bottom
   - Drag handle at top
   - Scrollable content

3. **Modal Form**
   - Centered overlay
   - Click outside to close
   - Form validation

4. **Workflow Transitions**
   - Button shows next action
   - One-way advancement
   - Updates marker color
   - Shows success toast

5. **Map Interactions**
   - Click marker for details
   - Pan/zoom controls
   - Auto-center on new leads

## Development Notes

- All animations use `cubic-bezier(0.4, 0, 0.2, 1)` easing
- Transitions are 300ms
- Dark theme is primary (matches iOS)
- Mobile-first responsive design
- Touch targets minimum 48x48px

## Next Steps for Kotlin Implementation

1. **Phase 1**: Replicate the theme system in Compose
2. **Phase 2**: Build the navigation structure
3. **Phase 3**: Implement the map with Google Maps SDK
4. **Phase 4**: Create the lead management UI
5. **Phase 5**: Add workflow logic and state management
6. **Phase 6**: Integrate Room database for persistence

## Testing Checklist

Use this prototype to verify your Kotlin implementation:

- [ ] Navigation drawer matches design
- [ ] Map markers show correct colors
- [ ] Bottom sheet slides smoothly
- [ ] Forms validate properly
- [ ] Workflow advancement works
- [ ] Filtering functions correctly
- [ ] Colors match exactly
- [ ] Spacing is consistent
- [ ] Animations feel natural
- [ ] Mobile responsive

---

**This prototype is your blueprint - build the Android app to match this exactly!** 🌳
