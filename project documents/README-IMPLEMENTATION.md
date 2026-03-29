# Gram Panchayat Website – Government Guideline Implementation Plan

This document maps the Government guideline to the current codebase and outlines concrete implementation steps: pages, data model, APIs, admin UI, and design. It focuses on the dynamic subdomain site (`/subdomain/[subdomain]`) that each Gram Panchayat uses.

## 1) Current Capabilities vs Guideline – Gap Analysis

Existing public pages under `src/app/subdomain/[subdomain]`:
- Home: `page.tsx` (uses sections like hero, announcements, programs)
- About: `about/page.tsx` (Village info)
- History: `history/page.tsx` (history cards + timeline)
- Programs/Events: `programs/page.tsx`
- Gallery: `gallery/page.tsx`
- Announcements & Circulars: `announcements/page.tsx`
- Government Schemes: `gov-programs/page.tsx`
- Departments: `departments/page.tsx`
- Amenities/Facilities: `amenities/page.tsx`
- Income & Expense (Finance): `jama-kharch/page.tsx`
- Contact: `contact/page.tsx`

Existing admin pages under `src/app/admin` cover the above sections and branding/footer/settings.

APIs exist for: announcements, programs, gallery, gov schemes, departments, facilities, income-expense, contacts, team-members, office-details, map-settings, village-info, history-cards, timeline-items, hero-images, homepage-settings, footer-content.

Guideline items covered:
- Branding, ownership, footer contacts (FooterContent, Header/Footer components)
- Bilingual support (Marathi + English fields in schema)
- Regular content updates (admin CRUD + APIs)
- Announcements, schemes, departments, facilities, finance, culture, gallery

Missing or partial items:
- Government Resolutions (GR) listing/downloads
- Projects/Key Initiatives with status, before/after sliders, impact metrics
- Search functionality across content
- Sitemap/Content Index page per subdomain
- Citizen feedback/grievance with tracking + escalation
- Social media integration blocks (RDD handles embeds)
- Weather widget, calendar of events/grahamsabha
- Employment & Skill Development (jobs/tenders/training)
- Education & Youth corner (students, scholarships, NSS, highlights)
- Environment & Sustainability (campaigns, dashboards)
- Farmer assistance (crop prices, advisories) – optional integration
- Dashboard “My Village, My Progress” KPIs and charts

## 2) Data Model Additions (Prisma)

Add new models (MongoDB via Prisma) with `subdomainId` linkage:
- GovernmentResolution: title, number, date, department, fileUrl, category, isActive, order
- Project: title, description, startDate, endDate, status, budget, photosBefore, photosAfter, impactMetrics Json, category, isFeatured, order
- Complaint: type, subject, description, citizenName, phone, status, priority, createdBy(optional), trackingCode, escalatedTo, history Json, attachments, isPublic(optional)
- Employment: type(job/tender/contract), title, org, location, lastDate, link, description, category
- EducationItem: type(school, scholarship, program, award), title, description, links, images, date, tags
- EnvironmentInitiative: title, type(tree, plastic-free, water, solar, waste), metrics Json, startDate, endDate, status, images, description
- DashboardMetric: key, label, value, unit, period(month, year), source, order
- SocialFeed: platform, url, handle, isActive, order

Keep bilingual fields where useful: `titleEn`, `descriptionEn` etc.

## 3) APIs (App Router `src/app/api/...`)

Create REST endpoints mirroring existing patterns using `validateSubdomain(request)` to scope by `subdomainId` and verifying ownership on mutations.
- government-resolutions: `GET` list + query by category/date; `POST` create; `PUT` update; `DELETE` delete; file upload via existing `upload` route
- projects: `GET` list + filters (status, featured); `POST` create; `PUT`; `DELETE`
- complaints: `POST` create (public); `GET` own list (admin); `PUT` status/progress (admin); track: `GET /api/complaints/track?code=...`
- employment: jobs/tenders listings CRUD
- education: listings CRUD
- environment: initiatives CRUD
- dashboard-metrics: CRUD
- search: unified `GET /api/search?q=...` across content types (titles/descriptions)
- sitemap: `GET /api/sitemap` returns structured content index per subdomain

Reuse existing `upload` and add minimal validation.

## 4) Admin Panel – New/Updated Screens

New sections under `/admin`:
- Government Resolutions: table + upload (PDF), filters
- Projects & Initiatives: create/edit with status, budget, before/after images, impact metrics
- Complaints: inbox, detail timeline, status changes, escalation
- Employment & Skill: jobs/tenders/training entries
- Education & Youth: items (schools highlights, scholarships, achievements)
- Environment & Sustainability: campaigns and metrics
- Dashboard Metrics: KPI manager (cards and charts order/period)
- Search settings: enable/disable content types, synonyms (optional)

Enhancements to existing:
- Home/Settings: add weather widget config, welcome video URL, calendar integration, featured toggles
- Footer: RDD/department social handles via `SocialFeed` or embed URLs

Each admin page will call its matching API and restrict by `subdomainId` (JWT).

## 5) Public Pages – New Routes under Subdomain

- `/subdomain/[subdomain]/gr` – Government Resolutions list + downloads
- `/subdomain/[subdomain]/projects` – Key Projects & Initiatives with filters, before/after sliders, impact blocks
- `/subdomain/[subdomain]/jobs` – Employment & Skill Development (jobs, tenders, training)
- `/subdomain/[subdomain]/education` – Education & Youth Corner
- `/subdomain/[subdomain]/environment` – Environment & Sustainability
- `/subdomain/[subdomain]/feedback` – Grievance & Feedback form with tracking code result
- `/subdomain/[subdomain]/dashboard` – My Village, My Progress dashboards
- `/subdomain/[subdomain]/search` – Search results page
- `/subdomain/[subdomain]/sitemap` – Content index

Widgets on Home:
- Weather widget (embedded or API)
- Panchayat/Events calendar (ics/Google Calendar embed)
- Welcome video (YouTube/Vimeo URL)
- “Pragati Meter” – highlights sourced from `DashboardMetric`

## 6) Design & UX Guidelines

- Branding: place Government logo(s) top-left; color tokens aligned with GoM style; consistent header/footer
- Accessibility: high contrast, keyboard navigation, alt text, semantic HTML
- Bilingual: language toggle; fields stored in both Marathi/English where available; fallback to Marathi
- Performance: image optimization via Next Image, pagination for lists, server-side caching where safe
- Transparency: finance page uses charts (e.g., stacked bars, pie) from dashboard metrics
- Mobile-first layouts with grid cards; print-friendly for GRs

## 7) Implementation Steps (Milestones)

M1 – Foundations
- Prisma schema: add models above; `npm run db:push`
- Seed minimal demo data for each model per subdomain
- Shared components: KPI Card, BeforeAfterSlider, MetricChart, SocialEmbed, WeatherWidget, CalendarEmbed

M2 – APIs
- Implement CRUD routes for: government-resolutions, projects, employment, education, environment, dashboard-metrics, search, sitemap
- Ensure mutation ownership checks by `subdomainId`

M3 – Admin UI
- Build admin pages for the new sections with forms, tables, filters
- Extend Settings page: weather, calendar, welcome video, featured toggles
- Add social feeds configuration

M4 – Public Pages
- Create new subdomain routes listed in section 5
- Integrate sections into Home as tiles/sections
- Add search and sitemap routes

M5 – QA & Compliance
- Cross-check against guideline list
- Accessibility and bilingual review
- Add e2e smoke tests for main flows

## 8) Security & Validation
- Use session JWT role/subdomain checks in middleware (already present)
- On update/delete, verify document belongs to `subdomainId`
- Rate-limit public complaint submission (basic throttle)
- File uploads: allowlist mime types (PDF/images)

## 9) Env & Config
- Reuse existing DATABASE_URL and NEXTAUTH_SECRET
- Add WEATHER_API_KEY (optional), CALENDAR_SOURCE (URL), YOUTUBE_VIDEO_URL per subdomain settings

## 10) Deliverables
- Updated Prisma schema and seeds
- New API routes
- New admin pages + updated settings/footer
- New public pages under subdomain
- Readme updates and admin guide for data entry
