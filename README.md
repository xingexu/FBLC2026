LocaLink – Toronto Small Business Directory

LocaLink is a production-grade Progressive Web App (PWA) designed to help users discover small businesses across Toronto. It operates fully offline using IndexedDB and a client-side architecture, making it a complete standalone solution.

Overview

LocaLink allows users to search, filter, review, and bookmark Toronto small businesses with no backend server required. The application uses React, TypeScript, and IndexedDB to ensure reliable functionality both online and offline.

Features
Core Functionality

Sorting businesses by category (food, retail, services, etc.)

Sorting by rating, distance, or review count

Business detail pages with website links, directions, contact, and operating hours

Review system with rating, text, slider verification, and timing checks

Bookmarking and saved business lists

Map view using Leaflet and OpenStreetMap tiles

Dedicated deals page with expiry dates and copyable coupon codes

Export of data to CSV or PDF

Offline operation through IndexedDB and service worker caching

Standalone Capability

Fully functional without network access after initial load

Seed data containing fifty Toronto small businesses

Automatic fallback to seed data if Overpass API is unavailable

Technology Stack

React 18 with Vite

TypeScript

React Router 6

TailwindCSS

Zustand for state management

Zod for validation

IndexedDB via the idb library

Leaflet for mapping

jsPDF and jspdf-autotable for exporting

React Hook Form for forms

Project Structure
src/
  components/
  pages/
  db/
  overpass/
  reviews/
  reco/
  export/
  utils/
  store/
  types/
  styles/


Each folder handles a single responsibility: UI components, database layer, business logic, utilities, and so on.

Getting Started
Requirements

Node.js 18 or higher

npm or pnpm

Modern browser with IndexedDB support

Installation
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm lint


The development server runs at http://localhost:3000
.

Data and API Integration
Seed Data

The application includes fifty Toronto businesses across ten neighborhoods, each with a category, coordinates, and optional deals.

Overpass API

If network access is available, the app attempts to fetch nearby businesses from OpenStreetMap. If the request fails or times out, the app falls back to the bundled seed data. Chain businesses are filtered out to keep results focused on local establishments.

Offline Operation

The project uses:

Service worker caching for all app assets

IndexedDB for persistent client-side storage

Seed data for full functionality without internet

After the first load, the app continues to work in airplane mode, including search, sorting, review creation, bookmarks, and viewing deals.

Security and Validation

All forms validated with Zod

URL and phone fields sanitized

Review system uses slider verification, timing checks, and local rate-limiting

React’s escape-by-default behavior prevents script injection

Accessibility

LocaLink includes:

Keyboard-accessible interface

Semantic HTML structure

ARIA labels

High-contrast theme option

Visible focus indicators

These features follow WCAG AA guidelines.

Testing

The project includes:

Unit tests for recommendation logic, validation schemas, and utility functions

Integration tests for database operations

End-to-end tests for key flows such as adding reviews and bookmarking

Run all tests with:

pnpm test

Build and Deployment
Production Build
pnpm build


This generates an optimized dist folder ready for deployment.

PWA Configuration

Manifest at public/manifest.webmanifest

Service worker generated automatically through Vite’s PWA plugin

Offline caching for assets and seed data

Notes

Overpass API may enforce rate limits; the application degrades gracefully to local data.

Business data bundled with the project is fictional and used for demonstration only.

No backend servers, databases, or external authentication services are required.

License

This project was developed for the 2025–26 Coding and Programming competitive event.
