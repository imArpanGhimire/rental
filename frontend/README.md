# Frontend Integration Roadmap — Rental Management System

**Backend:** `http://localhost:3000/api` (Express + MongoDB + JWT httpOnly cookies)
**Frontend:** React + Vite, structure already scaffolded

Two weeks, ~1–3 hrs/day. Each day ends with something testable against the live backend.

---

## Week 1 — Foundation, Auth, Core Browsing

### Day 1 — API Client Layer
Files: `src/api/client.js`, `auth.api.js`, `listings.api.js`, `reviews.api.js`, `favorites.api.js`
- `client.js`: axios instance, `baseURL: http://localhost:3000/api`, `withCredentials: true` (required for httpOnly cookie auth), response interceptor to catch 401 and redirect to login.
- Wrap each backend route from the README into a typed function (e.g. `login(email, password)`, `getAllProperties(params)`, `getNearby(params)`, `createReview(propertyId, data)`, `addForLater(propertyId)`).
- **Test:** hit `/register` and `/login` from browser console via these functions, confirm cookie is set (check DevTools → Application → Cookies).

### Day 2 — Auth Context & Hooks
Files: `features/auth/AuthContext.jsx`, `useLogin.js`, `useRegister.js`, `components/routing/ProtectedRoute.jsx`
- `AuthContext`: holds `user`, `role`, `isLoading`, `login()`, `logout()`, `register()`. On mount, call a `/me`-style check (or decode from a `getProfile` call if backend has one — confirm with Arpan; if not, persist role/user in context only after login response).
- `ProtectedRoute`: redirect to `/login` if no user; support `allowedRoles={['owner']}` for owner-only routes.
- **Test:** wrap `App.jsx` in `AuthProvider`, confirm context updates after login.

### Day 3 — Auth Pages
Files: `pages/auth/Login.jsx`, `Register.jsx`, `ForgetPassword.jsx`, `features/auth/components/LoginForm.jsx`, `RegisterForm.jsx`, `RoleToggle.jsx`
- Wire forms to `useLogin`/`useRegister` hooks. `RoleToggle` picks Owner vs Renter at registration (maps to backend `role` field).
- Use `AuthField`, `Input`, `PasswordInput`, `Button` from `components/ui`.
- `ForgetPassword.jsx` can be a UI-only placeholder for now (backend has no reset-password route yet — it's in the README's Future Improvements).
- **Test:** full register → login → redirect to dashboard flow.

### Day 4 — App Shell & Routing
Files: `App.jsx`, `components/layout/AppShell.jsx`, `AuthLayout.jsx`, `Sidebar.jsx`, `TopBar.jsx`, `MobileBottomNav.jsx`
- Set up React Router: public routes (Browse, ListingDetail, Login, Register) + protected owner routes (`/owner/*`) + protected renter routes (`/renter/*`).
- `AppShell` renders Sidebar/TopBar for desktop, `MobileBottomNav` for mobile (use `useMediaQuery`).
- **Test:** navigate all routes, confirm protected ones bounce unauthenticated users to `/login`.

### Day 5 — Browse Listings
Files: `features/listings/hooks/useListings.js`, `components/ListingCard.jsx`, `ListingFilters.jsx`, `pages/listings/Browse.jsx`
- `useListings`: wraps `GET /get-all-properties` with `page`, `limit`, `search`, `minPrice`, `maxPrice`, `sort`. Debounce search input (`useDebounce`).
- `ListingFilters`: price range, sort dropdown (`price_asc`, `price_desc`, `newest`, `oldest`).
- Pagination controls in `Browse.jsx`.
- **Test:** search, filter, sort, and paginate against real data.

### Day 6 — Listing Detail + Map + Nearby
Files: `useListing.js`, `ListingGallery.jsx`, `ListingMap.jsx`, `pages/listings/ListingDetail.jsx`
- `useListing(id)`: `GET /get-property/:id`.
- `ListingMap`: plot the property's GeoJSON coordinates; optionally trigger `GET /nearby` with `lng`/`lat`/`radius` to show similar listings nearby.
- **Test:** open a listing, confirm gallery + map render, nearby results load.

### Day 7 — Buffer / Review
- Fix bugs from Days 1–6, check loading/error states everywhere so far, confirm cookie-based auth survives page refresh.

---

## Week 2 — Owner Tools, Reviews, Favorites, Polish

### Day 8 — Create Listing (Owner)
Files: `useCreateListing.js`, `CreateListingForm.jsx`, `pages/owner/CreateListing.jsx`
- Form fields matching the Rental model: title, description, type, location (map picker or lat/lng input), price, rooms, sizeSqft, furnished, genderPreference, waterSupply, amenities, images.
- `POST /add-property`, owner-only (guard with `ProtectedRoute allowedRoles={['owner']}`).
- **Test:** create a listing, confirm it appears in Browse.

### Day 9 — Owner Dashboard & My Listings
Files: `pages/owner/MyListings.jsx`, `pages/owner/Dashboard.jsx`
- `GET /view-my-listings`; edit (`PUT /update-property/:id`) and delete (`DELETE /delete-property/:id`) actions per card.
- Dashboard: simple stats (total listings, maybe avg rating once reviews are wired).
- **Test:** full CRUD cycle on a property as an owner.

### Day 10 — Reviews
Files: `useReviews.js`, `ReviewCard.jsx`, `ReviewForm.jsx`
- Renter: `POST /create-review/:propertyid`, `DELETE /delete-review/:reviewid` (own reviews only).
- Owner: `POST /reply-review/:reviewid`, `PATCH /edit-reply/:reviewid`.
- Mount review list + form inside `ListingDetail.jsx`.
- **Test:** post a review as renter, reply as owner, edit the reply.

### Day 11 — Favorites
Files: `useFavorites.js`, `pages/renter/SavedListings.jsx`, `pages/renter/Dashboard.jsx`
- Heart/save icon on `ListingCard` and `ListingDetail` → `POST /add-forlater/:propertyid` / `remove-forlater`.
- `GET /get-forlater` populates Saved Listings page.
- **Test:** save/unsave from multiple entry points, confirm state stays in sync.

### Day 12 — i18n & Theming Polish
Files: `i18n/locales/en.json`, `ne.json`, `context/ThemeContext.jsx`, `ui/Badge.jsx`, `Modal.jsx`, `ErrorState.jsx`, `StatCard.jsx`
- Wire real strings into `i18n`, hook up language switch.
- Consistent empty/error/loading states across Browse, MyListings, SavedListings using `ErrorState`.

### Day 13 — Edge Cases & Hardening
- Global 401 handling → auto-logout + redirect.
- Form validation everywhere (client-side, matching backend constraints).
- Duplicate review/favorite prevention feedback (backend already blocks it — surface a clean error message).
- Image upload note: backend has no Cloudinary yet (README's Future Improvements) — decide with Arpan whether to stub this or block it in the UI for now.

### Day 14 — Final QA
- Full user journeys: renter signup → browse → save → review; owner signup → create → edit → reply to review.
- Responsive check (mobile bottom nav vs sidebar).
- Deploy prep: env vars for API base URL, CORS origin confirmed with backend.

---

## Notes
- Confirm with Arpan whether there's a `/me` or `/profile` route to rehydrate auth state on refresh — the README doesn't list one, and you'll need it for Day 2.
- Confirm exact `location` shape expected by `POST /add-property` (GeoJSON `{ type: "Point", coordinates: [lng, lat] }` per the README).
- Once you paste in your existing file contents, I'll adjust this plan around what's already built rather than assuming empty stubs.