# Amlak Web Pro v2

Production-ready real estate platform with React + Vite frontend and Express + MongoDB backend, including role-based access, admin dashboard, image upload flow, and modular component architecture.

## Repository

- GitHub: [MHDcoderC/amlak-web](https://github.com/MHDcoderC/amlak-web)
- Live demo: [amlak.mmdcode.top](https://amlak.mmdcode.top/)

## Key Features
- Advanced property listing, filtering, and search (including server-side pagination)
- Free-text search and advanced filter search with structured criteria (province, city, property type, min/max price, min/max area, rooms)
- JWT authentication + role-based authorization (user/admin) with frontend token expiry checks
- Unified Authentication Modal (single UI for login + simplified registration)
- Interactive Leaflet map UX with:
  - click-to-select coordinates
  - Nominatim-powered location search
  - custom marker styling
- Image upload workflow with drag-and-drop multi-image gallery, preview, remove, and reordering (validated types + size limits)
- Favorites modal, Mortgage Calculator modal, and Theme Toggle (light/dark)
- Ad analytics: view/click tracking + admin rating (1-5 stars)
- Admin dashboard: JWT-protected moderation actions (approve/reject), user management (ban/unban + safe delete), and analytics charts
- Component-level tests with Vitest + Testing Library
- Security hardening for API and upload surfaces (helmet, strict CORS allowlist, rate limiting, auth-required upload, sanitized paths)

## What's New in v2.0.0
Pro v2 adds stronger moderation, richer analytics, and more production-safe security defaults:
- Backend enhancements:
  - Advanced search: `GET /api/ads/search/advanced` with filters + pagination (province, city, property type, min/max price, min/max area, rooms)
  - Admin moderation: `PATCH /api/ads/:id/status` (pending/approved/rejected with optional `adminNotes`)
  - Hardened uploads: `multer` validates file type (jpg/png/gif/webp) and enforces `MAX_FILE_SIZE`
  - Usage analytics endpoints: `POST /api/ads/:id/view`, `POST /api/ads/:id/click`, `POST /api/ads/:id/rate`
  - Production healthcheck: `GET /api/health` and strict CORS allowlist behavior
- Frontend UX upgrades:
  - Unified Authentication Modal (login + simplified registration)
  - Favorites modal, Mortgage Calculator modal, and Theme Toggle (light/dark)
  - Map interactions that directly update selected lat/lng
- Operations:
  - `setup:full` script automates install -> download images -> seed -> create admin
- Production:
  - Backend static serving supports multiple build layouts (more robust SPA hosting)

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, Mongoose (MongoDB)
- Security: JWT, bcryptjs, helmet, express-rate-limit, CORS allowlist
- UI/Data: Leaflet, Chart.js, Lucide icons
- Testing: Vitest, @testing-library/react, jsdom

## Requirements

- Node.js 18+
- MongoDB 6+

## Quick Start

### 1) Install Dependencies

```bash
cd frontend
npm run install:all
```

### 2) Configure Environment

Copy `Backend/.env.example` to `Backend/.env` and update (from the repo root):

- `MONGODB_URI`
- `JWT_SECRET` (required)
- `JWT_EXPIRE`
- `PORT`
- `ALLOWED_ORIGINS`
- `MAX_FILE_SIZE`
- `API_RATE_LIMIT_WINDOW_MS`
- `API_RATE_LIMIT_MAX`

### 3) Run Development

```bash
cd frontend
npm run dev:all
```

Or separately:

```bash
# terminal 1
cd frontend
npm run dev

# terminal 2
cd frontend
npm run backend:dev
```

### 4) Seed and Admin Setup (Optional)

```bash
npm run seed
npm run create:admin
```

## Scripts

All commands are run from `frontend/`.

- `npm run dev`: start frontend (Vite)
- `npm run backend:dev`: start backend with nodemon
- `npm run dev:all`: run frontend + backend together
- `npm run lint`: run ESLint with zero warnings policy
- `npm run test`: run component tests (Vitest)
- `npm run test:watch`: run tests in watch mode
- `npm run build`: build frontend
- `npm run deploy`: run deployment helper
- `npm run download:images`: download asset images

## Pro v2 Structure

```text
amlak-web/
  frontend/
    src/
    components/
      home/
        Pagination.jsx
        StatsSection.jsx
      modal/
        ModalFormSection.jsx
        ModalGallerySection.jsx
        ModalMapSection.jsx
      adminAdModal/
        AdminAdHeader.jsx
        AdminAdGallery.jsx
        AdminAdMeta.jsx
        AdminAdContact.jsx
    utils/
      adPresentation.js
      imageUpload.js
  Backend/
    config/
    middleware/
      auth.js
    routes/
      ads.js
      users.js
    utils/
      request.js
    scripts/
      seedDatabase.js
      createAdmin.js
```

## Security Model

- Mandatory `JWT_SECRET` on backend startup
- Role-based middleware for protected/admin routes
- API rate limiting (`/api`) with configurable thresholds
- Helmet headers and disabled `x-powered-by`
- Strict CORS allowlist behavior
- Auth-required image upload endpoint
- Upload file type and size validation
- Sanitized image paths for server-trusted assets only

See `SECURITY.md` for reporting and policy details.

## Testing

Current test coverage includes component-level validation for:

- Pagination interaction
- Modal image upload preview flow

Run:

```bash
npm run test
```

## Deployment Notes

- Build frontend with `npm run build`
- Use `deploy.js` when packaging deployment artifacts
- Ensure production env vars are configured on server
- Enforce HTTPS and strict domain allowlist in production

## Local Upgrades (Applied)

This local copy includes a few practical fixes/enhancements on top of the upstream repo:

- Ads pagination now works with server-side `page`/`limit` requests to avoid page-change issues.
- Development CORS allowlist expanded to include `127.0.0.1` variants (easier local testing without CORS errors).
- Production static serving in the backend supports multiple build locations (more robust SPA hosting).
- JWT expiry detection in the frontend properly handles base64url payload encoding and checks `exp` to clear stale sessions.
- Vite base/API URL handling adjusted to better match dev/prod environments.

## License

MIT

