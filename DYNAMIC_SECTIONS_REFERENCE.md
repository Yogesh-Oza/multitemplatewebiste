# Dynamic Sections Quick Reference

## Homepage Template - Dynamic Sections

All sections below are **DYNAMIC** and can be managed via the Admin Panel at `/admin/village-info`

### 1. Hero Section
- **Component**: `HeroSection`
- **Data Models**: `HeroImage`, `HomepageSettings`
- **Admin Path**: `/admin/village-info` → "मुख्य प्रतिमा" (Hero Images)
- **Dynamic Fields**:
  - Multiple hero images (slider)
  - Main heading (Marathi)
  - Subtitle (Marathi)

### 2. About Section
- **Component**: `AboutSection`
- **Data Model**: `VillageInfo`
- **Admin Path**: `/admin/village-info` → "गाव माहिती" (Village Info)
- **Dynamic Fields**:
  - Village name, description
  - Village logo
  - Statistics (JSON array)
  - Three custom content sections

### 3. Leaders Hierarchy Section
- **Component**: `LeadersHierarchySection`
- **Data Model**: `Leader`
- **Admin Path**: `/admin/village-info` → "आपले नेते व पदसोपान रचना" (Leaders)
- **Dynamic Fields**:
  - Chief Minister, Deputy CMs, Ministers, Officials
  - Names, roles (Marathi & English)
  - Images, order

### 4. Progress Meter (Pragati Meter)
- **Component**: `PragatiMeterSection`
- **Data Model**: `ProgressMetric`
- **Admin Path**: `/admin/village-info` → "प्रगती मीटर" (Progress Metrics)
- **Dynamic Fields**:
  - Metric key, label (Marathi & English)
  - Value, unit, target
  - Icon, color, order

### 5. Welcome Video Section
- **Component**: `WelcomeVideoSection`
- **Data Model**: `HomepageSettings`
- **Admin Path**: `/admin/village-info` → "गावाचे स्वागत व्हिडिओ" (Welcome Video)
- **Dynamic Fields**:
  - YouTube/Vimeo URL
  - Video title, description

### 5A. Water & Sanitation Section
- **Component**: `WaterSanitationSection`
- **Data Models**: `WaterSanitationSnapshot`, `WaterSanitationFacility`
- **Admin Path**: `/admin/water-sanitation`
- **Dynamic Fields**:
  - Water supply stats (connections, supply hours, storage)
  - Sanitation stats (functional/public toilets, waste collection, drainage)
  - Issue CTA copy & emergency contact
  - Facility cards (treatment plant, tanks, sanitation centers, waste processing) with status, location, capacity, contact
  - Demo data auto-fills until first save

### 6. QR Tax Payment Section
- **Component**: `QRTaxPaymentSection`
- **Data Model**: `QRCodeSettings`
- **Admin Path**: `/admin/village-info` → "QR कोड सेटिंग्स" (QR Code Settings)
- **Dynamic Fields**:
  - Property tax QR code (UPI string)
  - Water tax QR code (UPI string)
  - Instructions for both

### 7. News Updates Section
- **Component**: `NewsUpdatesSection`
- **Data Model**: `NewsItem`
- **Admin Path**: `/admin/village-info` → "ताज्या बातम्या व अद्यतन" (News Updates)
- **Dynamic Fields**:
  - Title, description, date
  - Image URL, category, categoryColor
  - Urgent flag, order

### 8. Daily Message Section
- **Component**: `DailyMessageSection`
- **Data Model**: `DailyMessage`
- **Admin Path**: `/admin/village-info` → "आजचा सुविचार / पंचायत संदेश" (Daily Message)
- **Dynamic Fields**:
  - Message text
  - Author title (Sarpanch, etc.)
  - Date, category, icon, color

### 9. Announcements Section
- **Component**: `AnnouncementsSection`
- **Data Model**: `Announcement`
- **Admin Path**: `/admin/village-info` → "सूचना व्यवस्थापन" (Announcements)
- **Dynamic Fields**:
  - Title, date, description, fullDescription
  - Image, category, priority, status
  - Order, isActive

### 10. History Section
- **Component**: `HistorySection`
- **Data Models**: `HistoryCard`, `TimelineItem`
- **Admin Path**: `/admin/village-info` → "इतिहास व्यवस्थापन" (History)
- **Dynamic Fields**:
  - History cards (title, description, gradient, icon)
  - Timeline items (year, title, description, side)

### 11. Cultural Heritage Section
- **Component**: `CulturalHeritageSection`
- **Data Model**: `CulturalHeritage`
- **Admin Path**: `/admin/village-info` → "सांस्कृतिक वारसा" (Cultural Heritage)
- **Dynamic Fields**:
  - Title, description (Marathi & English)
  - Image, category, order

### 12. Header (Dynamic)
- **Component**: `Header` (in layout)
- **Data Model**: `VillageInfo`
- **Admin Path**: `/admin/village-info` → "गाव ब्रँडिंग" (Village Branding)
- **Dynamic Fields**:
  - Village logo
  - Village name
  - Government logos (Satyamev Jayate, Digital India)
  - Government department text
  - Official site text

### 13. Footer (Dynamic)
- **Component**: `Footer` (in layout)
- **Data Model**: `FooterContent`
- **Admin Path**: `/admin/village-info` → "Footer Content Management"
- **Dynamic Fields**:
  - Footer description
  - Social media links (JSON array)
  - Contact information
  - Government branding for footer

### 14. “My Village, My Progress” Dashboard
- **Frontend Page**: `/subdomain/[subdomain]/dashboard`
- **Admin Path**: `/admin/dashboard-metrics`
- **Data Models**: `DashboardOverview`, `DashboardKpiMetric`, `DashboardProgressIndicator`, `DashboardContentStat`, `DashboardWardComparison`, `DashboardAchievement`, `DashboardRecentActivity`
- **API Routes**: `/api/dashboard/overview`, `/api/dashboard/kpis`, `/api/dashboard/progress`, `/api/dashboard/content-stats`, `/api/dashboard/wards`, `/api/dashboard/achievements`, `/api/dashboard/activities`
- **Dynamic Fields**:
  - Hero titles/subtitles and highlight text
  - KPI cards with icons, colors, units, order, and active state
  - Progress indicators (value %, color, icon, order)
  - Content stats with optional breakdown chips
  - Ward wise comparison rows (population, sanitation, utilities, complaints)
  - Top achievements with category, impact, year, icon
  - Recent activity entries with icon, color, date (relative label computed on frontend)
- **Notes**: When a section has no saved records, curated demo data is rendered on both Admin and Public pages to keep the layout intact.

## Other Dynamic Pages

### Programs Page (`/programs`)
- **Data Model**: `Program`
- **Admin Path**: `/admin/programs`
- Events and festivals management

### Gallery Page (`/gallery`)
- **Data Model**: `Gallery`
- **Admin Path**: `/admin/gallery`
- Photo/video gallery

### Income-Expense Page (`/jama-kharch`)
- **Data Model**: `IncomeExpense`
- **Admin Path**: `/admin/income-expense`
- Financial records

### Government Schemes Page (`/sarkari-yojana`)
- **Data Model**: `GovernmentScheme`
- **Admin Path**: `/admin/government-schemes`
- Government scheme information

### Departments Page (`/vibhag`)
- **Data Model**: `Department`
- **Admin Path**: `/admin/departments`
- Departmental information

### Facilities Page (`/suvidha`)
- **Data Model**: `Facility`
- **Admin Path**: `/admin/facilities`
- Village facilities

### Contact Page (`/sampark`)
- **Data Model**: `Contact`, `OfficeDetails`
- **Admin Path**: `/admin/contact`
- Contact information

### Projects Page (`/prakalp`)
- **Data Model**: `Project`
- **Admin Path**: `/admin/projects`
- Development projects

### Government Resolutions Page (`/sarkari-tharav`)
- **Data Model**: `GovernmentResolution`
- **Admin Path**: `/admin/government-resolutions`
- Government resolutions and circulars

## Static Sections (Not Dynamic)

- **Weather Section**: Uses external weather API (no admin control)

## Key Points

1. **All homepage sections are dynamic** except Weather
2. **All content is subdomain-specific** (isolated per village)
3. **Admin can enable/disable** most sections via `isActive` flag
4. **Ordering is supported** for lists (via `order` field)
5. **Multi-language support** (Marathi primary, English secondary)

