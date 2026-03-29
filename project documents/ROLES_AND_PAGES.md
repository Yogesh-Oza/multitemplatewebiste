# Roles and pages reference

This document lists **login roles** for `AdminUser`, clarifies the separate **village “Role” content model**, and catalogs **App Router pages** with file locations and short descriptions.

For architecture and APIs, see [`../PROJECT_DOCUMENTATION.md`](../PROJECT_DOCUMENTATION.md).

---

## 1. User roles (authentication)

These values are stored on **`AdminUser.role`** in MongoDB (`prisma/schema.prisma`). They control access to `/super-admin`, `/admin`, and related APIs.

| Role | Description | Typical access |
|------|-------------|----------------|
| **`super_admin`** | Full platform operator | `/super-admin` UI and `/api/super-admin/*`. Can delete tenants, users, campaign form parts, and export activity logs. Enforced via `canDelete()` in `src/lib/auth-helpers.ts` and various route handlers. |
| **`super_admin_viewer`** | Read-oriented super user | Same areas as super admin for viewing and many non-destructive actions; **delete** operations are restricted (same helpers as above). |
| **`admin`** | Panchayat administrator | Assigned to a **`subdomainId`**. Manages content for one Gram Panchayat via `/admin/*` after login at `/admin-login`. Default role when a subdomain is provisioned (`/api/subdomain/register`, super-admin subdomain create). |
| **`editor`** | Content editor | Panchayat-side **`/admin/*`** with a lower-privilege label in the UI; still tied to a subdomain. Use when you want a non–full-admin content role (product convention in this codebase). |

**How enforcement works (summary)**

- **Middleware** (`src/middleware.ts`): `/super-admin` (except login) requires `super_admin` or `super_admin_viewer`. `/admin/*` and subdomain admin paths require a valid JWT.
- **Helpers** (`src/lib/auth-helpers.ts`): `isSuperAdmin()`, `canDelete()`, `getUserRole()`.
- **Super-admin APIs**: Generally allow `super_admin` and `super_admin_viewer` for reads/writes; **delete** and **activity log export** often require `super_admin` only.

**Login entry points**

| Page | Route | File |
|------|-------|------|
| Panchayat admin sign-in | `/admin-login` | `src/app/admin-login/page.tsx` |
| Super admin sign-in | `/super-admin-login` | `src/app/super-admin-login/page.tsx` |
| Password reset (admin flow) | `/admin-reset-password` | `src/app/admin-reset-password/page.tsx` |

NextAuth is configured with `pages.signIn: '/admin/login'` in `src/lib/auth.ts`; the app’s primary panchayat login UI used with middleware callbacks is **`/admin-login`**.

---

## 2. Not a login role: `Role` (panchayat positions)

The Prisma model **`Role`** (`@@map("roles")`) stores **village office roles** (e.g. सरपंच / Sarpanch) with responsibilities for the **public About** experience. It is **not** the same as `AdminUser.role`.

- **API:** `src/app/api/roles/route.ts`
- **Admin UI:** `src/app/admin/about/page.tsx` (panchayat roles & responsibilities section)
- **Public:** Consumed via subdomain about/office-style sections as configured

---

## 3. Pages catalog

Convention:

- **Route** = URL path on the **apex** host (e.g. `localhost:3000`, main marketing domain).
- **Tenant public routes** also appear as **`/{path}`** on a **subdomain** host (e.g. `village.example.com/about`) because middleware **rewrites** them to `/subdomain/[subdomain]/...` internally.

---

### 3.1 Marketing / root site (no tenant)

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Business / product landing (`BusinessLandingPage`). |
| `/about` | `src/app/about/page.tsx` | Static marketing about page. |
| `/announcements` | `src/app/announcements/page.tsx` | Marketing or sample announcements listing. |
| `/history` | `src/app/history/page.tsx` | Marketing or sample history page. |
| `/programs` | `src/app/programs/page.tsx` | Marketing or sample programs page. |
| `/subdomain-register` | `src/app/subdomain-register/page.tsx` | Public form to request/register a new Gram Panchayat subdomain. |

---

### 3.2 Auth & account recovery

| Route | File | Description |
|-------|------|-------------|
| `/admin-login` | `src/app/admin-login/page.tsx` | Panchayat admin credentials login. |
| `/super-admin-login` | `src/app/super-admin-login/page.tsx` | Super admin login; redirects if already in super role. |
| `/admin-reset-password` | `src/app/admin-reset-password/page.tsx` | Reset password using emailed token. |

---

### 3.3 Panchayat admin (`/admin/*`)

All files under `src/app/admin/`. Requires authenticated **admin** or **editor** (and valid subdomain context when on tenant hosts). `/admin` redirects to village hub.

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `src/app/admin/page.tsx` | Redirects to `/admin/village-info`. |
| `/admin/village-info` | `src/app/admin/village-info/page.tsx` | Homepage content: hero, village branding, leaders, progress meter, QR settings, etc. |
| `/admin/about` | `src/app/admin/about/page.tsx` | About page content: office info, emergency contacts, panchayat **Role** CRUD, deadlines, downloadable files, etc. |
| `/admin/history` | `src/app/admin/history/page.tsx` | History cards and timeline items. |
| `/admin/announcements-circulars` | `src/app/admin/announcements-circulars/page.tsx` | Announcements, circulars, meetings, deadlines, calendar, downloadable files. |
| `/admin/programs` | `src/app/admin/programs/page.tsx` | Programs / events. |
| `/admin/gallery` | `src/app/admin/gallery/page.tsx` | Photo/video gallery. |
| `/admin/government-schemes` | `src/app/admin/government-schemes/page.tsx` | Government schemes content. |
| `/admin/departments` | `src/app/admin/departments/page.tsx` | Department listings. |
| `/admin/facilities` | `src/app/admin/facilities/page.tsx` | Amenities / facilities (incl. GIS-style fields where used). |
| `/admin/contact` | `src/app/admin/contact/page.tsx` | Contacts, team, map settings. |
| `/admin/income-expense` | `src/app/admin/income-expense/page.tsx` | Income and expense (transparency). |
| `/admin/settings` | `src/app/admin/settings/page.tsx` | Site/footer and general settings. |
| `/admin/government-resolutions` | `src/app/admin/government-resolutions/page.tsx` | Government resolutions (GR) uploads/metadata. |
| `/admin/projects` | `src/app/admin/projects/page.tsx` | Projects / initiatives (before/after, impact). |
| `/admin/feedback` | `src/app/admin/feedback/page.tsx` | Citizen complaints / feedback inbox and management. |
| `/admin/employment-skill` | `src/app/admin/employment-skill/page.tsx` | Jobs, tenders, training, FPO, talent, employment contacts. |
| `/admin/education-youth` | `src/app/admin/education-youth/page.tsx` | Schools, scholarships, achievements, NSS, youth stories, career guidance, contacts. |
| `/admin/environment-sustainability` | `src/app/admin/environment-sustainability/page.tsx` | Environmental metrics, green initiatives, waste, water conservation, trees, events, contacts. |
| `/admin/dashboard-metrics` | `src/app/admin/dashboard-metrics/page.tsx` | “My village, my progress” dashboard KPIs, charts, ward stats, etc. |
| `/admin/water-sanitation` | `src/app/admin/water-sanitation/page.tsx` | Water & sanitation snapshot + related facilities. |
| `/admin/roads-lighting` | `src/app/admin/roads-lighting/page.tsx` | Roads & street lighting snapshot + facilities. |
| `/admin/education-health` | `src/app/admin/education-health/page.tsx` | Education & health snapshot + facilities. |
| `/admin/infrastructure-smart-village` | `src/app/admin/infrastructure-smart-village/page.tsx` | Infrastructure page copy, facility cards, smart village metrics, service status. |
| `/admin/beneficiary-stories` | `src/app/admin/beneficiary-stories/page.tsx` | Scheme beneficiary stories. |
| `/admin/ward-coverage` | `src/app/admin/ward-coverage/page.tsx` | Ward-wise scheme coverage data. |
| `/admin/application-process` | `src/app/admin/application-process/page.tsx` | Generic application process steps / documents config. |
| `/admin/before-after-gallery` | `src/app/admin/before-after-gallery/page.tsx` | Before/after transformation gallery. |
| `/admin/sankalp-tracker` | `src/app/admin/sankalp-tracker/page.tsx` | Sankalp / target tracker items. |
| `/admin/impact-dashboard` | `src/app/admin/impact-dashboard/page.tsx` | Impact dashboard metrics. |
| `/admin/search-sitemap` | `src/app/admin/search-sitemap/page.tsx` | Search / sitemap related admin configuration. |
| `/admin/campaign-form` | `src/app/admin/campaign-form/page.tsx` | Campaign evaluation form hub. |
| `/admin/campaign-form/basic-info` | `src/app/admin/campaign-form/basic-info/page.tsx` | Submission basic info step. |
| `/admin/campaign-form/form` | `src/app/admin/campaign-form/form/page.tsx` | Fill evaluation form. |
| `/admin/campaign-form/results` | `src/app/admin/campaign-form/results/page.tsx` | View results / scores. |
| `/admin/profile` | `src/app/admin/profile/page.tsx` | Logged-in admin profile / password change. |

---

### 3.4 Super admin (`/super-admin/*`)

Requires **`super_admin`** or **`super_admin_viewer`**. Files under `src/app/super-admin/`.

| Route | File | Description |
|-------|------|-------------|
| `/super-admin` | `src/app/super-admin/page.tsx` | Dashboard: subdomains, platform users, stats, modals for create/edit. |
| `/super-admin/activity-logs` | `src/app/super-admin/activity-logs/page.tsx` | Audit log viewer (export may be super_admin-only in API). |
| `/super-admin/campaign-forms` | `src/app/super-admin/campaign-forms/page.tsx` | List campaign forms. |
| `/super-admin/campaign-forms/builder/[formId]` | `src/app/super-admin/campaign-forms/builder/[formId]/page.tsx` | Visual builder for sections/items of a form. |

---

### 3.5 Tenant public site (`/subdomain/[subdomain]/...`)

**File root:** `src/app/subdomain/[subdomain]/`.

On a live **subdomain** host, paths are usually **`/`**, **`/about`**, etc.; Next.js internally serves these pages via rewrite to `/subdomain/{slug}/...`.

| Route (internal / dev path) | File | Description |
|----------------------------|------|-------------|
| `/subdomain/[subdomain]` | `src/app/subdomain/[subdomain]/page.tsx` | Tenant home: hero, about, announcements, history, heritage, weather, pragati meter, news, daily message, leaders, QR tax, water snapshot block, etc. |
| `/subdomain/[subdomain]/about` | `src/app/subdomain/[subdomain]/about/page.tsx` | Village about + office / roles / emergency / downloads / deadlines. |
| `/subdomain/[subdomain]/history` | `src/app/subdomain/[subdomain]/history/page.tsx` | History cards + timeline. |
| `/subdomain/[subdomain]/announcements` | `src/app/subdomain/[subdomain]/announcements/page.tsx` | Announcements & circulars hub. |
| `/subdomain/[subdomain]/programs` | `src/app/subdomain/[subdomain]/programs/page.tsx` | Programs / events. |
| `/subdomain/[subdomain]/gallery` | `src/app/subdomain/[subdomain]/gallery/page.tsx` | Gallery. |
| `/subdomain/[subdomain]/gov-programs` | `src/app/subdomain/[subdomain]/gov-programs/page.tsx` | Government schemes. |
| `/subdomain/[subdomain]/departments` | `src/app/subdomain/[subdomain]/departments/page.tsx` | Departments. |
| `/subdomain/[subdomain]/amenities` | `src/app/subdomain/[subdomain]/amenities/page.tsx` | Facilities / amenities. |
| `/subdomain/[subdomain]/jama-kharch` | `src/app/subdomain/[subdomain]/jama-kharch/page.tsx` | Income & expense (finance transparency). |
| `/subdomain/[subdomain]/contact` | `src/app/subdomain/[subdomain]/contact/page.tsx` | Contact / team / map. |
| `/subdomain/[subdomain]/gr` | `src/app/subdomain/[subdomain]/gr/page.tsx` | Government resolutions list/downloads. |
| `/subdomain/[subdomain]/projects` | `src/app/subdomain/[subdomain]/projects/page.tsx` | Key projects / before-after / impact. |
| `/subdomain/[subdomain]/jobs` | `src/app/subdomain/[subdomain]/jobs/page.tsx` | Employment, tenders, training, FPO, talent. |
| `/subdomain/[subdomain]/education` | `src/app/subdomain/[subdomain]/education/page.tsx` | Education & youth corner. |
| `/subdomain/[subdomain]/environment` | `src/app/subdomain/[subdomain]/environment/page.tsx` | Environment & sustainability. |
| `/subdomain/[subdomain]/dashboard` | `src/app/subdomain/[subdomain]/dashboard/page.tsx` | Public progress / KPI dashboard. |
| `/subdomain/[subdomain]/feedback` | `src/app/subdomain/[subdomain]/feedback/page.tsx` | Grievance / feedback submission and tracking. |
| `/subdomain/[subdomain]/citizen-services` | `src/app/subdomain/[subdomain]/citizen-services/page.tsx` | Citizen services hub. |
| `/subdomain/[subdomain]/sitemap` | `src/app/subdomain/[subdomain]/sitemap/page.tsx` | Human-readable content index / sitemap page. |

---

### 3.6 Development / utility

| Route | File | Description |
|-------|------|-------------|
| `/debug` | `src/app/debug/page.tsx` | Internal debugging UI (do not expose in production without review). |
| `/test-images` | `src/app/test-images/page.tsx` | Image upload / display tests. |

---

## 4. Layout files (not pages)

Layouts wrap segments and are useful when tracing chrome (nav, session providers):

- `src/app/layout.tsx` — Root layout
- `src/app/admin/layout.tsx` — Panchayat admin shell
- `src/app/super-admin/layout.tsx` — Super admin shell
- `src/app/subdomain/[subdomain]/layout.tsx` — Tenant public site shell (header/footer)
- `src/app/admin-login/layout.tsx` — Admin login page layout
- `src/app/super-admin-login/layout.tsx` — Super admin login layout

*(If a segment has no `layout.tsx`, it inherits from parents.)*

---

## 5. Quick counts

| Area | `page.tsx` count |
|------|------------------|
| Root + auth + utilities | 11 |
| `/admin/*` | 36 |
| `/super-admin/*` | 4 |
| `/subdomain/[subdomain]/*` | 20 |
| **Total** | **71** |

---

*Last aligned with repository structure at authoring time. New `page.tsx` files under `src/app` should be appended here when adding features.*
