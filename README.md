# PropStat Pro — Rental Property Inspection System

A full-stack monorepo for managing rental property portfolios, scheduling inspections, and operating role-based portals for admins, property managers, inspectors, and tenants. Guests can browse vacant units and submit booking requests without logging in.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Data & Credentials](#demo-data--credentials)
- [Routing Overview](#routing-overview)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Development Workflow](#development-workflow)
- [Production Notes](#production-notes)
- [Troubleshooting](#troubleshooting)

---

## Features

### Public (no authentication)

- **Marketing landing page** (`/`) with feature sections, pricing, and contact
- **Public listings** (`/listings`) — grid of vacant rental units with photos, specs, and monthly rent
- **Guest booking flow** — modal form to request a unit; auto-creates a tenant account when the email is new
- **Authentication pages** — login and sign-up

### Admin portal (`/admin/*`)

- Portfolio dashboard with stats and recent activity
- Property management with search, unit cards, and sidebar forms to add properties or units
- Inspection scheduling and status tracking
- User management (create accounts, assign roles)
- Workspace settings

### Manager portal (`/manager/*`)

- Task board and property overview
- Assign inspections to inspectors
- Approvals and tenant communications views

### Inspector portal (`/inspector/*`)

- Today's schedule and field checklist workflow
- Inspection history and profile

### Tenant portal (`/tenant/*`)

- Dashboard with upcoming visits and maintenance shortcuts
- **My Lease** — live lease details fetched from the API
- Report history and maintenance request UI

### Cross-cutting

- Role-based access control (RBAC) with JWT bearer tokens
- Dark mode support
- Responsive Tailwind UI with shared component library
- Vite dev-server proxy to Flask API

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 4, Lucide icons |
| **Backend** | Python 3, Flask 3, Flask-SQLAlchemy, Flask-CORS |
| **Database** | SQLite (default local dev) or PostgreSQL via `DATABASE_URL` |
| **Auth** | Werkzeug password hashing, signed JWT-style tokens (`itsdangerous`) |

---

## Repository Structure

```
inspection system/
├── README.md                 # This file
├── backend/
│   ├── app.py                # Flask application entry point
│   ├── models.py             # SQLAlchemy models
│   ├── seed.py               # Demo data seeder
│   ├── init_db.py            # Create/sync database tables
│   ├── inspection_system.db  # Default SQLite database (local)
│   ├── config/
│   │   └── settings.py       # Env loading & database URI
│   ├── routes/               # API blueprints
│   ├── services/             # Business logic layer
│   ├── utils/                # Auth helpers, serializers, HTTP utilities
│   └── venv/                 # Python virtual environment (local)
└── frontend/
    ├── index.html
    ├── vite.config.js        # Dev server + /api proxy
    ├── package.json
    └── src/
        ├── App.jsx           # React Router configuration
        ├── api/client.js     # Fetch wrapper & API methods
        ├── components/       # UI, auth, landing, listings, properties, etc.
        ├── constants/        # RBAC, images, theme
        ├── context/          # Auth & theme providers
        ├── hooks/
        ├── pages/            # Route-level page components
        └── utils/            # Validation, formatters, auth storage
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- Git

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd "inspection system"
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment (if not already present)
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies (from the active venv)
pip install Flask Flask-SQLAlchemy flask-cors python-dotenv itsdangerous psycopg psycopg-binary

# Optional: copy and edit environment file
# cp .env.example .env

# Initialize database schema
python init_db.py

# Seed demo properties, units, and users
python seed.py

# Start the API server (port 5000)
python app.py
```

The API will be available at `http://localhost:5000`. Health check: `GET /api/health`.

### 3. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. API requests to `/api/*` are proxied to Flask during development (see `frontend/vite.config.js`).

### 4. Verify the stack

1. Visit `http://localhost:5173` — landing page loads
2. Click **Find a Rental** → vacant units grid at `/listings`
3. Log in with demo credentials (see below) → redirected to the correct role dashboard

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | SQLite file `backend/inspection_system.db` |
| `SECRET_KEY` | Token signing secret | `dev-secret-change-in-production` |

PostgreSQL URLs starting with `postgresql://` are automatically converted to use the `psycopg` driver.

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | Empty (uses Vite proxy in dev) |

For production builds, set `VITE_API_URL` to your deployed API origin, e.g. `https://api.example.com`.

---

## Demo Data & Credentials

After running `python seed.py`, the following demo accounts may be available:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@rentalinspection.local` | `Admin123!` |
| Tenant | `tenant@rentalinspection.local` | `Tenant123!` |

Seed data includes sample properties (**Sunset Apartments**, **Greenview Estates**), units, and links the demo tenant to Unit 101. Re-running `seed.py` is safe — existing records are skipped.

---

## Routing Overview

### Public routes

| Path | Page |
|------|------|
| `/` | Landing / marketing homepage |
| `/listings` | Public vacant unit listings |
| `/login` | Login |
| `/signup` | Registration |

Landing navbar section links (Features, Pricing, etc.) scroll to homepage sections. From other pages they navigate to `/#section-id` on the homepage.

### Protected routes (require login)

All routes below are wrapped in `ProtectedRoute` and further restricted by role via `RoleGuard`.

| Prefix | Role | Examples |
|--------|------|----------|
| `/admin/*` | Admin | `/admin/dashboard`, `/admin/properties`, `/admin/inspections` |
| `/manager/*` | Property Manager | `/manager/dashboard`, `/manager/assign` |
| `/inspector/*` | Inspector | `/inspector/dashboard`, `/inspector/history` |
| `/tenant/*` | Tenant | `/tenant/dashboard`, `/tenant/lease` |

Unauthenticated users are redirected to `/login`. Wrong-role users are redirected to their own dashboard.

---

## API Reference

Base URL: `http://localhost:5000` (development)

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Service health check |

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Create account, returns token |
| POST | `/api/auth/login` | No | Login, returns token |

Protected endpoints expect: `Authorization: Bearer <token>`

### Public listings & bookings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/listings` | No | Vacant units for public grid |
| POST | `/api/bookings` | No | Submit booking + auto-register tenant |

**Booking request body:**

```json
{
  "unit_id": 2,
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+254700000000",
  "preferred_move_in_date": "2026-08-01"
}
```

### Properties & units

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/properties` | Yes* | List active properties |
| POST | `/api/properties` | Yes* | Create property |
| GET | `/api/units` | Yes* | List units (`?property_id=` optional) |
| POST | `/api/units` | Yes* | Create unit for a property |

### Inspections

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/inspections` | Yes* | List inspections (filterable by status) |
| POST | `/api/inspections` | Yes* | Schedule inspection |
| PATCH | `/api/inspections/:id` | Yes* | Update inspection status/notes |

### Users & dashboard

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users` | Yes* | List users |
| POST | `/api/users` | Yes* | Create user |
| GET | `/api/dashboard` | Yes* | Dashboard aggregate stats |

### Tenant

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/tenant/lease` | Yes | Active lease details for logged-in tenant |

\*Most admin endpoints are consumed by authenticated dashboard sessions; enforce auth at the route level where `@require_auth` is applied.

---

## Data Model

| Table | Purpose |
|-------|---------|
| `users` | Accounts with roles: `admin`, `property_manager`, `inspector`, `tenant` |
| `properties` | Rental buildings / portfolio entries |
| `units` | Rentable units (`tenant_id` null = vacant); optional `monthly_rent`, `image_url` |
| `inspections` | Scheduled/completed unit inspections |
| `inspection_items` | Checklist line items per inspection |
| `bookings` | Guest/tenant rental booking requests |

**Vacant unit logic:** `is_active = true` and `tenant_id IS NULL`.

**Lease display:** Units linked to a tenant via `units.tenant_id` appear on the tenant lease page.

---

## Development Workflow

### Backend

```bash
cd backend
venv\Scripts\activate      # Windows
python app.py              # Run with debug on port 5000
python seed.py             # Re-seed demo data
python init_db.py          # Sync schema
```

On startup, `app.py` runs `db.create_all()` and applies lightweight SQLite column migrations for newer fields (`monthly_rent`, `image_url`).

### Frontend

```bash
cd frontend
npm run dev      # Development server (port 5173)
npm run build    # Production build → frontend/dist
npm run preview  # Preview production build
npm run lint     # Oxlint
```

### Adding unit images

Set an image URL on a unit record:

```sql
UPDATE units SET image_url = 'https://example.com/photos/unit-102.jpg' WHERE unit_number = '102';
```

Listings without `image_url` show a styled architectural placeholder.

### Linking a tenant to a unit

```sql
UPDATE units SET tenant_id = <user_id> WHERE id = <unit_id>;
```

---

## Production Notes

1. Set a strong `SECRET_KEY` in backend environment variables.
2. Use PostgreSQL via `DATABASE_URL` for production databases.
3. Build the frontend with `VITE_API_URL` pointing to your API.
4. Serve `frontend/dist` from a static host or reverse proxy; run Flask with a WSGI server (e.g. Gunicorn).
5. Configure CORS appropriately if frontend and API are on different origins.
6. Email delivery for booking temporary credentials is not yet implemented — passwords are stored hashed server-side only.

---

## Troubleshooting

| Issue | Likely cause | Fix |
|-------|--------------|-----|
| API errors on every page | Flask not running | Start `python app.py` in `backend/` |
| Empty listings grid | All units occupied | Ensure some units have `tenant_id = NULL` |
| Tenant lease page empty | No unit linked | Set `units.tenant_id` for that user |
| 401 on protected routes | Missing/expired token | Log in again |
| Schema errors after pull | New columns added | Restart Flask (`app.py` runs migrations) or run `init_db.py` |
| Frontend can't reach API in prod | Missing `VITE_API_URL` | Set env var and rebuild |

---

## License

Private / internal project. Add license terms here if applicable.

---

**Last updated:** July 2026
