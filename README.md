# TreeShopDroid

**Android Port of TreeShop - Map-First Business Operations for Tree Care Professionals**

## Overview

TreeShopDroid is the Android version of TreeShop, bringing the revolutionary map-first business operations platform to Android devices. Based on the iOS app architecture, TreeShopDroid delivers the same powerful workflow management with native Android performance.

## Project Status

🚧 **In Active Development**

This repository contains:
- ✅ **Development Mind Map PWA** - Visual planning tool for tracking Android development
- 🔄 **Android App** - Coming soon

## Quick Start

### Access the Development Planner

The visual mind map for planning and tracking development:

```bash
cd planner
# Open index.html in your browser
```

Or use a simple HTTP server:

```bash
cd planner
python -m http.server 8000
# Visit http://localhost:8000
```

### Import Initial Roadmap

1. Open the planner in your browser
2. Click the import button (📥)
3. Select `initial-roadmap.json`
4. View the complete TreeShopDroid development roadmap

## What is TreeShop?

TreeShop is a map-first business operations platform that treats geography as the primary data structure. Unlike traditional directory-based apps, TreeShop positions the map as the interface where every tree, job, and customer exists first as a location.

**The Differentiator:** When you drive past a property where you've worked, TreeShop shows you. When you tap a parcel, you see every tree scored, every job completed, every dollar earned - all in one card.

## Core Features (Planned)

### 4-Stage Workflow
- **LEAD** (Blue) → New leads coming in
- **PROPOSAL** (Orange) → Proposals sent to customers
- **WORK_ORDER** (Green) → Active jobs in progress
- **INVOICE** (Red) → Jobs completed, payment pending
- **COMPLETED** (Gray) → Fully completed and paid

### Map-First Interface
- User location tracking and auto-zoom
- Address search with autocomplete
- Custom workflow-colored markers
- Tap markers for lead details
- Google Maps integration

### Offline-First Architecture
- Room database for local persistence
- Works in no-signal environments
- Automatic sync when online
- WorkManager for background tasks

## Technical Stack

### Android App (Planned)
- **Platform**: Android 8.0+ (API 26+)
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM with StateFlow
- **Database**: Room
- **Maps**: Google Maps SDK for Android
- **DI**: Hilt
- **Async**: Coroutines + Flow
- **Design**: Material 3, Dark mode first

### Development Planner (Current)
- **PWA**: HTML5 + CSS3 + Vanilla JS
- **Canvas**: Mind map visualization
- **Storage**: LocalStorage
- **Offline**: Service Worker

## Project Structure

```
TreeShopDroid/
├── planner/              # Visual development mind map (PWA)
│   ├── index.html       # Main app interface
│   ├── styles.css       # Styling
│   ├── app.js          # Application controller
│   ├── mindmap.js      # Visualization engine
│   ├── storage.js      # Data persistence
│   ├── manifest.json   # PWA manifest
│   ├── sw.js          # Service worker
│   ├── initial-roadmap.json  # Development roadmap
│   └── README.md       # Planner documentation
├── app/                # Android app (coming soon)
└── README.md          # This file
```

## Development Roadmap

View the complete development roadmap in the mind map planner:

### Phase 1: Foundation
- Project setup and architecture
- Core data layer with Room
- MVVM structure
- Dependency injection

### Phase 2: Map Integration
- Google Maps SDK setup
- Custom markers by workflow stage
- Address search and autocomplete
- User location tracking

### Phase 3: Lead Management
- 4-stage workflow system
- Add lead form
- Lead detail views
- Status transitions

### Phase 4: UI Components
- Material 3 theming
- Reusable Compose components
- Navigation drawer
- Dark mode support

### Phase 5: Advanced Features
- Offline-first sync
- Authentication
- Testing suite
- Performance optimization

## Based on TreeShop iOS

This Android app is a port of the successful iOS TreeShop app. Key reference points:

- **TreeShop iOS Repository**: [github.com/treeshoptech/TreeShop](https://github.com/treeshoptech/TreeShop)
- **Data Models**: LEAD.swift with 50+ fields
- **Workflow System**: WORKFLOW_MANAGER.swift
- **UI Design**: Dark mode native design
- **Architecture**: SwiftData persistence, MapKit integration

## Development Workflow

1. **Plan in Mind Map**: Use the visual planner to break down features
2. **Track Progress**: Update node status as you work
3. **Store Details**: Keep implementation notes in each node
4. **Export Regularly**: Backup your planning data

## Getting Involved

This is an internal TreeShop Tech project. Development progress is tracked in the mind map planner.

### Development Tips

- Start with the planner to understand the full scope
- Reference the iOS app for feature parity
- Follow Android best practices
- Maintain offline-first architecture
- Test on multiple device sizes

## Resources

- [TreeShop iOS App](https://github.com/treeshoptech/TreeShop)
- [Android Developer Docs](https://developer.android.com)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Google Maps SDK](https://developers.google.com/maps/documentation/android-sdk)
- [Material Design 3](https://m3.material.io)

## License

Proprietary - All Rights Reserved

© 2025 TreeShop Tech

---

**Built to bring systematic tree care operations to Android** 🌳

*Two empires cannot exist. TreeShop chooses systematic domination.*
