# Copilot Instructions - Accessibility Reviews App

## Project Overview
This is a **single-page client-side accessibility review web application**. Users can write reviews, reply to reviews, and vote with thumbs up/down. The app uses vanilla JavaScript with Bootstrap 5.3.3 for UI, bundled with Vite.

## Architecture & Data Flow

### Page Navigation Flow
1. `index.html` → Entry point with single CTA button linking to reviews
2. `results.html` → Full review system (create, reply, vote, delete)

Note: `locationf.html`, `room.html`, and `filter.html` exist but are not in the main user flow.

### State Management Pattern
**localStorage for all review data**:
- Structure: `{ "general": [...reviews] }` (or room-specific keys if building/room params used)

## Critical Conventions

### UI Framework
- **Bootstrap 5.3.3** loaded via CDN (no custom CSS files)
- **Bootstrap Icons 1.11.3** for UI elements (`bi-arrow-left`, `bi-search`)

### Review Voting System
User votes stored in review object to prevent duplicate voting:
```javascript
review.votes[currentUserId] = 'up'; // or 'down'
if (review.votes[currentUserId] === 'up') review.thumbsUp++;
```
Users can change their vote or remove it by clicking same button again.

## Development Workflow

### Running the App
```bash
npm run dev     # Start Vite dev server (default port 5173)
npm run build   # Build for production
npm run preview # Preview production build
```

### Debugging
- Use Chrome debugger configured in `.vscode/launch.json` (port 8080)
- Console logging is acceptable for debugging
- No testing framework is set up

## Review System Features

### On `results.html`:
- **Average Rating**: Calculates percentage positive/negative from all thumbs up/down votes
- **Create Review**: Form to post new reviews (name + text)
- **Vote on Reviews**: Thumbs up/down (one vote per user per review)
- **Reply to Reviews**: Nested replies under each review
- **Delete Own Content**: Users can delete their own reviews and replies

### Data Persistence:
- All review data stored in browser localStorage
- No backend/database - purely client-side
- Data persists across sessions but is browser-specific

## Current Limitations

1. **No backend** - everything is static/client-side
2. Reviews stored per browser (not synced across devices)
3. `locationf.html`, `room.html`, and `filter.html` exist but are not in the main navigation flow

## When Adding Features

### Adding Review Categories/Tags
- Reviews are currently freeform text only
- Could add category selection (Seating, Lighting, Space, etc.) to review form
- Would need to update review object structure and localStorage schema

### Backend Integration
- To sync reviews across users/devices, replace localStorage with API calls
- Keep the same data structure but POST/GET from server
- Consider authentication for user management instead of client-side userId

### Accessibility Considerations
- This app is **about** accessibility, so maintain:
  - Semantic HTML (`<nav>`, `<main>`, proper heading hierarchy)
  - ARIA labels where needed
  - Keyboard navigation support
  - High contrast maintained via Bootstrap defaults
