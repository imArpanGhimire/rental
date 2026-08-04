# Rentora — Frontend

A rental platform for Nepal — hostel rooms, rental rooms, and flats — connecting renters directly with owners, no middlemen. This is a ground-up rebuild: a refined design system and a folder structure built to grow past auth pages into a full listings marketplace.

---

## Table of Contents

- [Design System](#design-system)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Internationalization](#internationalization)
- [Feature Roadmap](#feature-roadmap)
- [Suggested Additions](#suggested-additions)
- [Getting Started](#getting-started)
- [Conventions](#conventions)

---

## Design System

**Direction: Minimal Luxury.** Few colors, generous whitespace, restrained typography, one signature detail rather than many. The subject is people's homes — the design should feel calm and trustworthy, not loud.

**Palette — "Ink & Brass"**

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1B1A17` | Primary text, headings |
| `--ivory` | `#F7F4EE` | Page background (light) |
| `--charcoal` | `#111110` | Page background (dark) |
| `--brass` | `#A9812E` | Accent — CTAs, active states, links |
| `--brass-light` | `#F1E7D0` | Accent tint — badges, hover backgrounds |
| `--stone` | `#DCD5C6` | Borders, dividers |

All colors are defined once, as CSS custom properties, in `src/styles/tokens.css` — never hardcoded in components. Light/dark mode swaps the same token names, so components never need `dark:` conditionals for color.

**Typography**
- Display: a serif with real presence (e.g. **Fraunces** or **Source Serif 4**) for headings — this carries the "luxury" feel
- Body/UI: a clean grotesk (e.g. **Inter** or **General Sans**) for everything functional
- One scale, used consistently: `text-xs` (labels/eyebrows) → `text-sm` (body/UI) → `text-2xl`/`text-4xl` (headings)

**Signature element:** thin 1px hairline borders and dividers instead of shadows/cards everywhere — reinforces the minimal, precise feel rather than a soft SaaS look. Reserve shadow only for one elevated surface at a time (e.g. an open modal).

**Rule:** no more than one accent color live on screen at once outside of photos. Brass is for action and emphasis only, not decoration.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React + Vite | Fast dev loop, what you know already |
| Routing | React Router v6 | |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | Single token source, no config file needed |
| Data fetching | **Axios + TanStack Query** *(new)* | Previously there was no real API layer — this gives caching, loading/error states, and retries for free instead of hand-rolled `useState`/`setTimeout` |
| Forms | **React Hook Form** *(new)* | Manual `useState` per field works for 2 fields, not for a listing form with 15+ |
| i18n | `i18next` + `react-i18next` | English / Nepali |
| Icons | `lucide-react` | |
| Auth state | React Context (`AuthContext`) | Fine at this scale — revisit only if state sharing gets genuinely complex |

**Worth deciding now, before you build listings pages:** rental listings benefit a lot from SEO (people search "hostel room Baneshwor" on Google). Plain Vite SPAs don't get indexed well. If discoverability matters, consider **Next.js** for the rebuild instead of Vite — same React code, but pages are server-rendered/indexable. If listings will mostly be found through the app itself (shared links, word of mouth) rather than search, Vite is simpler and fine. Worth a deliberate choice rather than a default.

---

## Folder Structure

The old structure split `pages/owner/` and `pages/renter/` as if they were separate apps. But "listings," "favorites," and "reviews" are used by *both* roles — that split forces duplication as features grow. This structure groups by **feature domain** instead:

```
frontend/
├── src/
│   ├── api/                    # One file per domain, all HTTP calls live here
│   │   ├── client.js            # axios instance, interceptors, base URL from env
│   │   ├── auth.api.js
│   │   ├── listings.api.js
│   │   ├── favorites.api.js
│   │   └── reviews.api.js
│   │
│   ├── components/
│   │   ├── ui/                  # Truly generic, zero domain knowledge
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Badge.jsx
│   │   └── layout/               # App chrome
│   │       ├── AppShell.jsx
│   │       ├── AuthLayout.jsx
│   │       ├── Sidebar.jsx
│   │       └── TopBar.jsx
│   │
│   ├── features/                 # One folder per domain — this is the core of the scalability
│   │   ├── auth/
│   │   │   ├── components/        # LoginForm, RegisterForm, RoleToggle
│   │   │   ├── hooks/              # useLogin, useRegister
│   │   │   └── AuthContext.jsx
│   │   ├── listings/
│   │   │   ├── components/        # ListingCard, ListingFilters, ListingGallery
│   │   │   ├── hooks/              # useListings, useListing, useCreateListing
│   │   │   └── types.js
│   │   ├── favorites/
│   │   └── reviews/
│   │
│   ├── pages/                     # Route-level only — thin, compose feature components
│   │   ├── auth/                   # Login.jsx, Register.jsx, ForgetPassword.jsx
│   │   ├── listings/                # Browse.jsx, ListingDetail.jsx
│   │   ├── owner/                    # Dashboard.jsx, MyListings.jsx
│   │   └── renter/                    # Dashboard.jsx, SavedListings.jsx
│   │
│   ├── context/                    # App-wide only (Theme). Feature-specific context lives in features/
│   │   └── ThemeContext.jsx
│   │
│   ├── i18n/
│   │   ├── index.js
│   │   └── locales/
│   │       ├── en.json
│   │       └── ne.json
│   │
│   ├── styles/
│   │   ├── tokens.css              # Single source of color/type/radius tokens
│   │   └── base.css                 # Reset, base element styles
│   │
│   ├── hooks/                       # Genuinely shared hooks only (useDebounce, useMediaQuery)
│   ├── utils/                       # formatPrice, formatDate, etc.
│   ├── App.jsx
│   └── main.jsx
├── public/
└── vite.config.js
```

**Why this holds up as the app grows:** when you add "messaging" or "booking requests" later, it's a new folder under `features/`, not a rework of existing ones. A component only moves to `components/ui/` if it has zero knowledge of listings, auth, or any other domain — that's the test.

---

## Internationalization

Same pattern as before (it worked well): `i18next` + `react-i18next`, language auto-detected from `localStorage` then browser, falling back to English. Key structure mirrors the feature folders — `auth.login.title`, `listings.filters.priceRange`, etc. — so it's obvious where a string belongs as the app grows past auth pages.

---

## Feature Roadmap

**Now**
- [ ] Auth: login / register (owner + renter roles), forgot password
- [ ] Browse listings: hostel rooms, rental rooms, flats
- [ ] Listing detail page: photos, amenities, location, price
- [ ] Owner: create / edit / delete listings
- [ ] Renter: save to favorites
- [ ] Reviews & ratings per listing
- [ ] Light / dark mode
- [ ] English / Nepali toggle

**Next**
- [ ] Search + filters (price range, room type, location)
- [ ] Owner dashboard: manage all listings, view inquiries
- [ ] Renter dashboard: saved listings, past inquiries

---

## Suggested Additions

A few things worth planning for now, even if built later — they're much cheaper to design for upfront than to retrofit:

- **Map-based search** — Kathmandu/Pokhara valley, pin-drop listings (Leaflet or Mapbox). Very high-value for a Nepal rental app specifically.
- **Nepal-relevant filters** — gender preference for shared hostel rooms (common expectation here), furnished/unfurnished, distance to nearest college or office, water supply (jar/tanker/municipal — genuinely a differentiator in Kathmandu listings).
- **In-app inquiry / messaging** — let renters message owners without exposing phone numbers immediately; reduces spam and builds trust.
- **Request-a-viewing scheduling** — instead of just "contact owner," a structured "request to visit" flow.
- **Owner verification badge** — ID/citizenship verification, shown on listings. Directly addresses the "no middlemen, no scams" trust story from your original tagline.
- **eSewa / Khalti integration** — for booking deposits or paid "featured listing" placement for owners. Both are the standard payment rails in Nepal; Stripe alone won't cover your market.
- **Nearby amenities** — bus stop, hospital, market distance shown on listing detail. Small addition, meaningfully useful.
- **Report/flag a listing** — basic trust & safety, cheap to build now, expensive to bolt on after you have real users.
- **Notifications** — new message, listing approved/rejected, price drop on a saved listing.
- **Admin moderation panel** — approve new listings before they go live; you'll want this before opening signups publicly.

---

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Environment variables (create `.env`):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Conventions

- **Colors:** always a token (`bg-primary`, `text-ink`), never a raw hex in a component
- **New feature:** add a folder under `features/`, not new top-level folders
- **API calls:** always go through `src/api/`, never `fetch`/`axios` directly inside a component
- **Forms with 3+ fields:** use React Hook Form, not manual `useState` per field
- **i18n:** no hardcoded UI strings — every label goes through `t()`, even if English-only for now# Rentora
