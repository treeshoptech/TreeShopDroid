# TreeShop Development Mind Map

A visual mind map PWA for planning and tracking TreeShopDroid development.

## Features

- **Visual Mind Map**: Interactive canvas-based node visualization
- **Hierarchical Structure**: Parent-child relationships between tasks
- **Detailed Node Information**: Store comprehensive details in each node
  - Title & Description
  - Status (Pending, In Progress, Completed, Blocked)
  - Priority (Low, Medium, High, Critical)
  - Tags for categorization
  - Technical notes and implementation details
- **Offline Support**: Works completely offline as a PWA
- **Auto-Save**: Automatically saves to localStorage every 30 seconds
- **Export/Import**: Save and load project data as JSON
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Shortcuts**: Efficient workflow

## Getting Started

### Quick Start

1. Open `index.html` in a modern web browser
2. Click "Add Root Node" to create your first task
3. Select a node and click "Add Child Node" to create subtasks
4. Double-click any node to edit details
5. Drag nodes to reposition them

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save data
- `Ctrl/Cmd + E`: Export data
- `Delete`: Delete selected node
- `Escape`: Deselect / Close modal
- `Enter`: Edit selected node

### Mouse Controls

- **Click**: Select node
- **Double-click**: Edit node
- **Drag node**: Reposition
- **Drag canvas**: Pan view
- **Scroll**: Zoom in/out

## Installation as PWA

1. Open the app in Chrome, Edge, or Safari
2. Click the install icon in the address bar
3. The app will be installed on your device
4. Launch it from your home screen/app menu

## Data Storage

All data is stored in your browser's localStorage:
- Automatic saving every 30 seconds
- Manual save with Ctrl/Cmd + S
- Export to JSON file for backup
- Import JSON to restore or share

## Node Structure

Each node can contain:
- **Title**: Short name for the task
- **Description**: Detailed explanation
- **Status**: Current state (Pending, In Progress, Completed, Blocked)
- **Priority**: Importance level
- **Tags**: Categories like "frontend", "android", "feature"
- **Technical Notes**: Implementation details, code snippets, dependencies

## Status Colors

- 🟡 **Pending**: Yellow/Orange - Not started
- 🔵 **In Progress**: Blue - Currently working
- 🟢 **Completed**: Green - Finished (shows checkmark)
- 🔴 **Blocked**: Red - Waiting on dependencies

## Use Cases

### Project Planning
- Break down large projects into manageable tasks
- Visualize project structure and dependencies
- Track progress across all components

### Development Tracking
- Create nodes for features, bugs, and improvements
- Store technical implementation details in each node
- Tag nodes by area (UI, backend, database, etc.)

### Sprint Planning
- Map out sprint goals visually
- Update status as work progresses
- See overall completion percentage

## Technical Stack

- **HTML5 Canvas**: For mind map rendering
- **Vanilla JavaScript**: No dependencies, fast and lightweight
- **LocalStorage API**: For data persistence
- **Service Worker**: For offline functionality
- **Web App Manifest**: For PWA installation

## File Structure

```
planner/
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── app.js         # Main application controller
├── mindmap.js     # Canvas visualization engine
├── storage.js     # LocalStorage handling
├── manifest.json  # PWA manifest
├── sw.js          # Service worker
└── README.md      # This file
```

## Tips

1. **Start with high-level nodes**: Create main categories first, then break them down
2. **Use tags consistently**: Makes filtering and searching easier
3. **Add technical notes**: Store implementation details, links, code snippets
4. **Regular exports**: Backup your data periodically
5. **Color coding**: Use priority levels to highlight critical tasks

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

This is a standalone PWA with no build process required. To modify:

1. Edit the source files directly
2. Refresh the browser to see changes
3. Update the service worker version in `sw.js` for cache busting

## License

Proprietary - TreeShop Tech

---

Built for systematic TreeShopDroid development planning 🌳
