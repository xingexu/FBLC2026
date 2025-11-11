# LocaLink - Toronto Small Business Directory

A production-grade Progressive Web App (PWA) that helps users discover nearby small businesses in Toronto. Built with React, TypeScript, and IndexedDB for full offline functionality.

## 🎯 Requirements Satisfaction

This project satisfies all requirements from the 2025-26 event brief:

### Core Features
- ✅ **Sorting businesses by category** (e.g., food, retail, services)
- ✅ **Allowing users to leave reviews or ratings** (1-5 stars with text)
- ✅ **Sorting businesses by reviews or ratings**
- ✅ **Saving or bookmarking favorite businesses**
- ✅ **Display special deals or coupons** with expiry dates and copy codes
- ✅ **Verification step to prevent bot activity** (slider captcha + timing checks)

### Event Rules Compliance
- ✅ **Standalone solution** - Runs with no programming errors, no external servers required
- ✅ **7-minute presentation + 3-minute Q&A** - See demo script below
- ✅ **Offline functionality** - Works in airplane mode with seed data cached in IndexedDB

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Validation**: Zod
- **Database**: IndexedDB via `idb` library
- **Maps**: Leaflet with OpenStreetMap tiles
- **PDF Export**: jsPDF + jspdf-autotable
- **Forms**: React Hook Form

### Why React PWA with IndexedDB?

**Standalone Operation**: 
- No backend server required - all data stored client-side in IndexedDB
- Seed data bundled with the app ensures functionality even without network
- Service Worker caches app shell and assets for offline access

**No Power/Network Assumptions**:
- Works fully offline after initial load
- IndexedDB persists data across browser sessions
- Seed data provides 50+ Toronto businesses for demo purposes
- Overpass API integration gracefully falls back to seed data on network failure

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BusinessCard.tsx
│   ├── CategoryChips.tsx
│   ├── RatingStars.tsx
│   ├── DealCard.tsx
│   ├── BookmarkButton.tsx
│   ├── CaptchaSlider.tsx
│   ├── MapView.tsx
│   └── ...
├── pages/              # Route pages
│   ├── Home.tsx
│   ├── Explore.tsx
│   ├── Business.tsx
│   ├── Deals.tsx
│   ├── Bookmarks.tsx
│   ├── Report.tsx
│   └── AddBusiness.tsx
├── db/                  # Database layer
│   ├── indexeddb.ts     # Schema and initialization
│   ├── repo.ts          # CRUD operations
│   ├── init.ts          # Seed data loader
│   └── seed.json        # 50 Toronto businesses
├── overpass/            # Overpass API integration
│   ├── queryTemplate.ts
│   ├── bbox.ts
│   └── fetchNearby.ts
├── reviews/             # Review system
│   ├── schemas.ts       # Zod validation
│   └── ReviewForm.tsx   # Form with captcha
├── reco/                # Recommendation engine
│   ├── recommend.ts     # Cosine similarity
│   └── recommend.test.ts
├── export/              # Export utilities
│   ├── csv.ts
│   └── pdf.ts
├── utils/               # Utility functions
│   ├── geo.ts          # Haversine distance
│   └── links.ts        # URL sanitization
├── store/              # Zustand stores
├── types/              # TypeScript types
└── styles/             # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Modern browser with IndexedDB support

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Lint code
pnpm lint
```

The app will be available at `http://localhost:3000`

## 📊 Data

### Seed Data
- **50 Toronto businesses** across 10 neighborhoods:
  - Kensington Market
  - Leslieville
  - The Junction
  - Roncesvalles
  - Danforth
  - North York
  - Scarborough
  - Etobicoke
  - Midtown
  - Chinatown

- **Categories**: food, retail, services, health, arts, fitness, repair, books
- **12 active deals** with expiry dates within 6 months
- **Realistic coordinates**: Toronto area (43.58-43.76 lat, -79.50 to -79.24 lng)

### Overpass API Integration
- Fetches nearby businesses from OpenStreetMap
- **Brand filtering**: Excludes chain stores (Starbucks, McDonald's, etc.)
- **Fallback**: Uses seed data if network fails or rate limited
- **Small business heuristic**: Requires website/phone OR no brand tag

## 🎬 7-Minute Demo Script

### 0:00 - Launch & Overview
- Open app, explain goal: "Discover Toronto's small businesses"
- Grant geolocation permission
- Show Near Me button working

### 0:45 - Category Filtering & Sorting
- Filter by "Food" category
- Sort by rating (highest first)
- Sort by distance (nearest first)
- Show map view with markers

### 1:30 - Business Details
- Click on a business card
- Show website link, phone, directions
- Display hours of operation
- Show active deals with copy code button

### 2:00 - Review System
- Click "Write a Review"
- Complete slider captcha (bot prevention)
- Submit review with rating and text
- Show updated rating on business page

### 2:30 - Bookmarks
- Bookmark a business
- Navigate to Bookmarks page
- Show saved businesses

### 2:50 - Deals Page
- Navigate to Deals
- Filter by category
- Copy a coupon code
- Show expiry date

### 3:20 - Recommendations
- Show "Recommended for you" panel (if implemented)
- Explain cosine similarity algorithm

### 3:45 - Offline Demo
- **Toggle airplane mode**
- Show app still works
- Browse businesses from IndexedDB
- Add bookmark (saves locally)
- View deals (cached)

### 4:30 - Export Reports
- Navigate to Report page
- Export top-rated businesses to CSV
- Export bookmarks to PDF
- Open files to verify

### 5:00 - Code Walkthrough
- Show folder structure
- Highlight code comments
- Show Zod validation schemas
- Show brand exclusion logic

### 6:00 - Rubric Mapping
- **Functionality**: All features working
- **Input Validation**: Zod schemas, URL sanitization
- **Output & Analysis**: CSV/PDF export, sorting, filtering
- **Intelligent Feature**: Recommendation engine with cosine similarity

### 6:45 - Future Work
- Owner claim flow
- Photo uploads
- Real-time updates

## ❓ 3-Minute Q&A Cheat Sheet

### Why PWA and IndexedDB for standalone?
- **PWA**: Installable, works offline, no app store needed
- **IndexedDB**: Client-side database, persists data, no backend required
- **Seed data**: Ensures demo works without network
- **Service Worker**: Caches assets for offline access

### Fairness of brand exclusion?
- **Focus on small businesses**: Event brief emphasizes local businesses
- **Manual add flow**: `/add-business` allows adding any business
- **Transparent filtering**: Code clearly shows exclusion list
- **OSM data**: Overpass API naturally favors businesses with website/phone

### Bot prevention choices and privacy?
- **Slider captcha**: Simple, accessible, no external service
- **Timing checks**: Minimum 5 seconds on form (human behavior)
- **Rate limiting**: 30-second cooldown between reviews
- **Privacy**: All data stored locally, no tracking

### Accessibility measures?
- **Keyboard navigation**: All interactive elements keyboard-accessible
- **ARIA labels**: Screen reader support throughout
- **Focus management**: Visible focus indicators
- **High contrast theme**: Toggle for visual accessibility
- **Semantic HTML**: Proper landmarks and structure

## 🔒 Security & Validation

### Input Validation
- **Zod schemas**: All forms validated with Zod
- **URL sanitization**: Website and phone links validated
- **XSS prevention**: React escapes content by default
- **Type safety**: TypeScript prevents type errors

### Bot Prevention
- **Slider captcha**: Must slide to 80%+ to verify
- **Timing check**: Minimum 5 seconds on review form
- **Rate limiting**: 30-second cooldown between reviews
- **Human behavior**: Checks for natural interaction patterns

## ♿ Accessibility

See `src/a11y-checklist.md` for detailed accessibility checklist.

### Key Features
- ✅ Keyboard-first navigation
- ✅ ARIA labels on all interactive elements
- ✅ Focus management and visible focus indicators
- ✅ High contrast theme toggle
- ✅ Screen reader support
- ✅ WCAG AA color contrast compliance

## 🧪 Testing

### Unit Tests
- Recommendation engine (cosine similarity)
- Input validation schemas
- Geographic utilities (Haversine distance)

### Integration Tests
- Database operations with fake IndexedDB
- Repository functions

### E2E Tests (Playwright)
- Add review flow
- Bookmark flow
- Search and filter

Run tests: `pnpm test`

## 📦 Build & Deploy

### Production Build
```bash
pnpm build
```

Output: `dist/` directory with optimized assets

### PWA Features
- **Manifest**: `public/manifest.webmanifest`
- **Service Worker**: Auto-generated by Vite PWA plugin
- **Offline support**: Caches shell and seed data
- **Installable**: Add to home screen on mobile/desktop

## 🌐 Offline Demo Steps

1. **Initial Load**: Open app, allow geolocation
2. **Enable Airplane Mode**: Toggle airplane mode in browser/dev tools
3. **Verify Functionality**:
   - Browse businesses (from IndexedDB)
   - Search and filter (client-side)
   - View business details
   - Add bookmark (saves to IndexedDB)
   - View deals (cached)
   - Export reports (client-side generation)

## 📝 Notes

### Overpass API Limits
- **Rate limiting**: May be rate limited with frequent requests
- **Fallback**: Automatically uses seed data on failure
- **Brand filtering**: Excludes known chain stores
- **Small business heuristic**: Requires website/phone OR no brand tag

### Toronto Seed Data
- **Provenance**: Generated for demo purposes
- **Disclaimer**: Business names and details are fictional
- **Coordinates**: Realistic Toronto area coordinates
- **Categories**: Covers all required categories

### Data Structures
- **Lists and arrays**: Used throughout (categories, tags, hours)
- **Typed repositories**: TypeScript interfaces for all data
- **Clear scope**: Each module has single responsibility

## 📄 License

This project is created for the 2025-26 event demonstration.

## 🙏 Acknowledgments

- OpenStreetMap for map tiles and business data
- Overpass API for live business queries
- Toronto small business community

