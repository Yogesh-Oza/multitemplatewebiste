# Gram Panchayat Website - Project Context Documentation

## Overview
This is a multi-tenant dynamic template system for Gram Panchayat (village council) websites in Maharashtra, India. Each village gets its own subdomain (e.g., `pune.localhost:3000` or `pune.mahagp.in`) with a fully customizable website.

## Architecture

### 1. Multi-Tenancy (Subdomain-Based)
- **Subdomain Detection**: Middleware (`src/middleware.ts`) detects subdomains from the hostname
- **URL Rewriting**: Subdomain requests are rewritten to `/subdomain/[subdomain]/*` routes
- **Data Isolation**: Each subdomain has its own data in MongoDB via Prisma, linked by `subdomainId`
- **Example**: `pune.localhost:3000` → `/subdomain/pune/`

### 2. Dynamic Template System

#### How Templates Work
1. **Subdomain Route**: `src/app/subdomain/[subdomain]/page.tsx` is the main homepage
2. **Data Fetching**: Server-side data fetching based on subdomain from database
3. **Component Rendering**: Reusable section components that accept dynamic data
4. **Layout**: Shared layout with dynamic header/footer per subdomain

#### Template Structure
```
src/app/subdomain/[subdomain]/
├── page.tsx              # Homepage (main template)
├── layout.tsx            # Subdomain-specific layout
├── about/page.tsx        # About page
├── announcements/page.tsx
├── programs/page.tsx
├── gallery/page.tsx
├── jama-kharch/page.tsx  # Income-Expense
├── sarkari-yojana/page.tsx  # Government Schemes
├── vibhag/page.tsx       # Departments
├── suvidha/page.tsx      # Facilities
├── sampark/page.tsx      # Contact
├── prakalp/page.tsx      # Projects
├── sarkari-tharav/page.tsx  # Government Resolutions
├── feedback/page.tsx
├── sitemap/page.tsx
└── [other pages]
```

## Dynamic Sections on Homepage Template

The homepage (`src/app/subdomain/[subdomain]/page.tsx`) renders these sections in order:

### 1. **HeroSection** (Dynamic)
- **Data Source**: `heroImages` (HeroImage model), `homepageSettings` (HomepageSettings model)
- **Dynamic Content**:
  - Hero slider images (multiple, ordered)
  - Main heading (Marathi)
  - Subtitle (Marathi)
- **Admin Control**: `/admin/village-info` → Hero Images Section

### 2. **WeatherSection** (Static)
- Weather widget (external API)

### 3. **AboutSection** (Dynamic)
- **Data Source**: `villageInfo` (VillageInfo model)
- **Dynamic Content**:
  - Village name, description
  - Village logo
  - Statistics (JSON array)
  - Three custom sections (sectionOneTitle/Body, etc.)
- **Admin Control**: `/admin/village-info` → Village Info Section

### 4. **LeadersHierarchySection** (Dynamic)
- **Data Source**: `leaders` (Leader model)
- **Dynamic Content**:
  - Chief Minister, Deputy CMs, Ministers, Officials
  - Images, names, roles
- **Admin Control**: `/admin/village-info` → Leaders Section

### 5. **PragatiMeterSection** (Dynamic)
- **Data Source**: `progressMetrics` (ProgressMetric model)
- **Dynamic Content**:
  - Progress metrics (sanitation, electricity, water, trees, etc.)
  - Values, targets, units, icons, colors
- **Admin Control**: `/admin/village-info` → Progress Metrics Section

### 6. **WelcomeVideoSection** (Dynamic)
- **Data Source**: `homepageSettings` (HomepageSettings model)
- **Dynamic Content**:
  - YouTube/Vimeo video URL
  - Video title and description
- **Admin Control**: `/admin/village-info` → Village Info Section

### 7. **QRTaxPaymentSection** (Dynamic)
- **Data Source**: `qrCodeSettings` (QRCodeSettings model)
- **Dynamic Content**:
  - Property tax QR code (UPI payment string)
  - Water tax QR code (UPI payment string)
  - Instructions for both
- **Admin Control**: `/admin/village-info` → QR Code Settings Section

### 8. **NewsUpdatesSection** (Dynamic)
- **Data Source**: `newsItems` (NewsItem model)
- **Dynamic Content**:
  - News items with title, description, date, image, category
  - Urgent flag
- **Admin Control**: `/admin/village-info` → News Updates Section

### 9. **DailyMessageSection** (Dynamic)
- **Data Source**: `dailyMessages` (DailyMessage model)
- **Dynamic Content**:
  - Daily message/quote
  - Author title (Sarpanch, etc.)
  - Date, category, icon, color
- **Admin Control**: `/admin/village-info` → Daily Message Section

### 10. **AnnouncementsSection** (Dynamic)
- **Data Source**: `announcements` (Announcement model)
- **Dynamic Content**:
  - Announcements with title, date, description, image
  - Category, priority, status
- **Admin Control**: `/admin/village-info` → Announcements Section

### 11. **HistorySection** (Dynamic)
- **Data Source**: `historyCards` (HistoryCard model), `timelineItems` (TimelineItem model)
- **Dynamic Content**:
  - History cards (title, description, gradient, icon)
  - Timeline items (year, title, description, side)
- **Admin Control**: `/admin/village-info` → History Section

### 12. **CulturalHeritageSection** (Dynamic)
- **Data Source**: `culturalHeritage` (CulturalHeritage model)
- **Dynamic Content**:
  - Cultural items (title, description, image, category)
- **Admin Control**: `/admin/village-info` → Cultural Heritage Section

### Header & Footer (Dynamic)
- **Header**: Village logo, name, government branding (Satyamev Jayate, Digital India logos)
- **Footer**: Footer content, social media links, contact info, government branding
- **Admin Control**: `/admin/village-info` → Footer Content Section

## API Routes Structure

### Admin API Routes (Subdomain-Specific)
All admin APIs automatically use the authenticated user's subdomain context.

```
/api/
├── admin/
│   ├── announcements/          # GET, POST, PUT, DELETE
│   └── footer-content/         # GET, POST, PUT
├── announcements/              # GET (public), POST, PUT, DELETE
├── hero-images/                # GET, POST, PUT, DELETE
├── village-info/               # GET, PUT
├── leaders/                    # GET, POST, PUT, DELETE
├── progress-metrics/           # GET, POST, PUT, DELETE
├── qr-code-settings/           # GET, PUT
├── news-items/                 # GET, POST, PUT, DELETE
├── daily-messages/             # GET, POST, PUT, DELETE
├── history-cards/              # GET, POST, PUT, DELETE
├── timeline-items/             # GET, POST, PUT, DELETE
├── cultural-heritage/          # GET, POST, PUT, DELETE
├── programs/                   # GET, POST, PUT, DELETE
├── gallery/                    # GET, POST, PUT, DELETE
├── facilities/                 # GET, POST, PUT, DELETE
├── contacts/                   # GET, POST, PUT, DELETE
├── departments/                # GET, POST, PUT, DELETE
├── government-schemes/         # GET, POST, PUT, DELETE
├── government-resolutions/     # GET, POST, PUT, DELETE
├── projects/                   # GET, POST, PUT, DELETE
├── income-expense/             # GET, POST, PUT, DELETE
├── dashboard-metrics/          # GET, POST, PUT, DELETE
├── footer-content/             # GET, POST, PUT
├── homepage-settings/          # GET, PUT
├── upload/                     # POST (file upload to Vercel Blob)
├── search/                     # GET (site search)
├── sitemap/                    # GET (generate sitemap)
└── auth/[...nextauth]/         # NextAuth authentication
```

### Super Admin API Routes
```
/api/super-admin/
├── users/                      # GET, POST, PUT, DELETE
├── users/[id]/                 # GET, PUT, DELETE
├── subdomains/                 # GET, POST
├── subdomains/[id]/            # GET, PUT, DELETE
├── campaign-forms/             # GET, POST
├── campaign-forms/[formId]/    # GET, PUT, DELETE
├── campaign-forms/[formId]/sections/     # GET, POST, PATCH
├── campaign-forms/[formId]/sections/[sectionId]/  # PUT, DELETE
├── campaign-forms/[formId]/items/        # GET, POST
├── campaign-forms/[formId]/items/[itemId]/  # PUT, DELETE
└── create/                     # POST (create super admin)
```

### Public API Routes
```
/api/
├── subdomain/validate/         # POST (validate subdomain availability)
├── subdomain/register/         # POST (register new subdomain)
├── villages/districts/         # GET (list districts)
├── villages/subdistricts/      # GET (list sub-districts)
├── villages/villages/          # GET (list villages)
└── weather/                    # GET (weather data)
```

## Database Schema (Prisma)

### Core Models

#### Subdomain (Main Tenant Model)
- `id`, `subdomain` (unique), `villageName`, `villageNameEn`
- `contactPerson`, `email`, `phone`, `address`
- `districtId`, `districtName`, `subDistrictId`, `subDistrictName`, `villageId`
- `adminUsername`, `adminPassword`
- `status` (pending/active/suspended), `isActive`
- **Relations**: All content models link to Subdomain via `subdomainId`

#### VillageInfo
- Village branding (logo, name)
- Government branding (Satyamev Jayate, Digital India logos)
- Village description, statistics (JSON)
- Three custom sections

#### HomepageSettings
- Main heading, subtitle (Marathi & English)
- Welcome video URL

#### HeroImage
- Image URL, title, description
- Order, isActive

#### Leader
- Name, role (Marathi & English)
- Image URL, order

#### ProgressMetric
- Key, label (Marathi & English)
- Value, unit, target
- Icon, color, order

#### QRCodeSettings
- Property tax QR data (UPI string)
- Water tax QR data (UPI string)
- Instructions

#### NewsItem
- Title, description, date
- Image URL, category, categoryColor
- isUrgent flag

#### DailyMessage
- Message, authorTitle, date
- Category, icon, color

#### Announcement
- Title, date, description, fullDescription
- Image, category, priority, status

#### HistoryCard
- Title, description (Marathi & English)
- Gradient, icon, order

#### TimelineItem
- Year, title, description (Marathi & English)
- Side (left/right), order

#### CulturalHeritage
- Title, description (Marathi & English)
- Image, category, order

#### FooterContent
- Description, social media links (JSON)
- Contact info (office name, address, phone, email, website)
- Government branding for footer

### Content Models (All have subdomainId)

- **Program**: Events and festivals
- **Gallery**: Photo/video gallery
- **Facility**: Village facilities
- **Contact**: Contact information
- **Department**: Departmental information
- **GovernmentScheme**: Government schemes
- **GovernmentResolution**: Government resolutions and circulars
- **Project**: Development projects
- **IncomeExpense**: Financial records
- **Complaint**: Citizen complaints/feedback
- **TeamMember**: Village team members (Sarpanch, etc.)
- **OfficeDetails**: Office contact details
- **MapSettings**: Google Maps embed

### Campaign Form System (Super Admin Only)

- **CampaignForm**: Form templates
- **FormSection**: Sections within forms
- **FormItem**: Items/fields within sections
- **FormSubmission**: Village submissions
- **FormItemValue**: Values for each item in submission

## Admin Panel Structure

### Admin Panel (`/admin/*`)
**Access**: Subdomain-specific admins (role: `admin` or `editor`)

#### Main Sections:
1. **Homepage** (`/admin/village-info`)
   - Hero Images
   - Village Info & Branding
   - Leaders
   - Progress Metrics
   - QR Code Settings
   - News Updates
   - Daily Message
   - Announcements
   - History
   - Cultural Heritage
   - Footer Content

2. **Programs** (`/admin/programs`)
   - Manage events and festivals

3. **Gallery** (`/admin/gallery`)
   - Photo/video gallery management

4. **Income-Expense** (`/admin/income-expense`)
   - Financial records management

5. **Government Schemes** (`/admin/government-schemes`)
   - Government scheme information

6. **Departments** (`/admin/departments`)
   - Departmental information

7. **Facilities** (`/admin/facilities`)
   - Village facilities

8. **Contact** (`/admin/contact`)
   - Contact information

9. **Projects** (`/admin/projects`)
   - Development projects

10. **Government Resolutions** (`/admin/government-resolutions`)
    - Government resolutions and circulars

11. **Feedback** (`/admin/feedback`)
    - Citizen feedback/complaints

12. **Dashboard Metrics** (`/admin/dashboard-metrics`)
    - Dashboard statistics

13. **Search & Sitemap** (`/admin/search-sitemap`)
    - Search functionality and sitemap generation

14. **Campaign Form** (`/admin/campaign-form`)
    - Fill and submit campaign forms (created by super admin)

15. **Settings** (`/admin/settings`)
    - Theme, font, general settings

16. **Profile** (`/admin/profile`)
    - Admin profile management

### Super Admin Panel (`/super-admin/*`)
**Access**: Super admins only (role: `super_admin`)

#### Main Sections:
1. **Overview Dashboard**
   - Statistics (users, subdomains, etc.)
   - Recent activity

2. **User Management**
   - Create, edit, delete admin users
   - Assign roles (super_admin, admin, editor)
   - Assign subdomains to users
   - Activate/deactivate users

3. **Subdomain Management**
   - View all subdomains
   - Create, edit, delete subdomains
   - Activate/deactivate subdomains
   - Filter by district, sub-district, village
   - Search and sort

4. **Campaign Forms** (`/super-admin/campaign-forms`)
   - Create form templates
   - Form builder with sections and items
   - Manage form submissions
   - Export to Excel

## Authentication & Authorization

### NextAuth Configuration
- **Provider**: Credentials
- **Session Strategy**: JWT
- **Roles**: `super_admin`, `admin`, `editor`
- **Subdomain Context**: Admin users linked to subdomain via `subdomainId`

### Middleware Protection
- `/super-admin/*`: Requires `super_admin` role
- `/admin/*`: Requires authenticated admin with subdomain access
- Subdomain validation ensures users can only access their assigned subdomain

## File Upload System

- **Storage**: Vercel Blob Storage
- **API Route**: `/api/upload`
- **Supported Formats**: JPG, PNG, WebP
- **Max Size**: 5MB (configurable)
- **Usage**: Hero images, gallery, village logos, etc.

## Key Features

### 1. Multi-Language Support
- Marathi (primary) and English
- All content models have both language fields

### 2. Dynamic Content Management
- All sections are CMS-managed
- Admin can enable/disable sections
- Ordering support for lists

### 3. Government Branding
- Satyamev Jayate logo
- Digital India logo
- Government department text
- Consistent across all villages

### 4. Campaign Form System
- Super admin creates flexible form templates
- Villages fill and submit forms
- Auto-calculation of marks/scores
- Excel export functionality

### 5. Search & Sitemap
- Site-wide search
- Dynamic sitemap generation per subdomain

## Development URLs

- **Main Site**: `http://localhost:3000`
- **Subdomain Site**: `http://pune.localhost:3000` (example)
- **Admin Panel**: `http://pune.localhost:3000/admin`
- **Super Admin**: `http://localhost:3000/super-admin`

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB (via Prisma ORM)
- **Authentication**: NextAuth.js
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **File Storage**: Vercel Blob
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form (implied)
- **Notifications**: Sonner

## Important Files

### Core Files
- `src/middleware.ts` - Subdomain detection and routing
- `src/app/subdomain/[subdomain]/page.tsx` - Main template
- `src/app/subdomain/[subdomain]/layout.tsx` - Subdomain layout
- `prisma/schema.prisma` - Database schema
- `src/lib/subdomain.ts` - Subdomain utilities
- `src/lib/subdomain-auth.ts` - Subdomain authentication

### Admin Files
- `src/app/admin/layout.tsx` - Admin layout
- `src/app/admin/village-info/page.tsx` - Homepage management
- `src/components/admin/admin-sidebar.tsx` - Admin navigation
- `src/components/admin/homepage/*` - Homepage management components

### Super Admin Files
- `src/app/super-admin/page.tsx` - Super admin dashboard
- `src/app/super-admin/campaign-forms/` - Campaign form builder

## Notes

1. **Subdomain Isolation**: Each subdomain's data is completely isolated via `subdomainId`
2. **Dynamic Sections**: All homepage sections are dynamic and manageable via admin panel
3. **Super Admin Powers**: Can manage all subdomains, users, and create campaign forms
4. **Admin Powers**: Can manage only their assigned subdomain's content
5. **Template Reusability**: Same template code serves all subdomains with different data

