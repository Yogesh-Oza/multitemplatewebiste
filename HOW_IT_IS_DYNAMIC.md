# How the Gram Panchayat Website is Dynamic from Admin Panel

## Overview
This is a **fully dynamic, multi-tenant CMS system** where every piece of content on the website can be managed through the admin panel. Each village gets its own subdomain (e.g., `pune.mahagp.in`) with completely isolated, customizable content.

---

## Architecture Flow

### 1. **Multi-Tenancy System**
```
Subdomain Detection → Data Isolation → Admin Access Control
```

- **Subdomain Detection**: Middleware (`src/middleware.ts`) detects subdomain from URL
- **Data Isolation**: All database queries filter by `subdomainId` 
- **Admin Access**: Each admin can only manage their assigned subdomain's content

### 2. **Data Flow: Admin Panel → Database → Frontend**

```
Admin Panel (React Component)
    ↓ [User edits content]
API Route (/api/hero-images, /api/village-info, etc.)
    ↓ [Validates subdomain & saves]
MongoDB Database (Prisma ORM)
    ↓ [Stored with subdomainId]
Frontend Page (Server-Side Rendering)
    ↓ [Fetches data by subdomainId]
Website Display (Dynamic Content)
```

---

## Complete Dynamic Content Management

### **Homepage Sections (All Dynamic)**

#### 1. **Hero Section** (`HeroSection`)
- **Admin Path**: `/admin/village-info` → "मुख्य प्रतिमा" (Hero Images)
- **Data Models**: 
  - `HeroImage` - Multiple slider images
  - `HomepageSettings` - Main heading & subtitle
- **What's Dynamic**:
  - Hero slider images (upload, delete, reorder, activate/deactivate)
  - Main heading text (Marathi)
  - Subtitle text (Marathi)
- **API Routes**: `/api/hero-images`, `/api/homepage-settings`
- **Component**: `src/components/admin/homepage/hero-images-section.tsx`
- **Frontend**: `src/components/sections/hero-section.tsx`

#### 2. **About Section** (`AboutSection`)
- **Admin Path**: `/admin/village-info` → "गाव माहिती" (Village Info)
- **Data Model**: `VillageInfo`
- **What's Dynamic**:
  - Village name & description
  - Village logo (upload)
  - Statistics (JSON array - fully customizable)
  - Three custom content sections (sectionOneTitle/Body, sectionTwoTitle/Body, sectionThreeTitle/Body)
  - Government branding (Satyamev Jayate logo, Digital India logo, department text)
- **API Route**: `/api/village-info`
- **Component**: `src/components/admin/homepage/village-info-section.tsx`
- **Frontend**: `src/components/sections/about-section.tsx`

#### 3. **Leaders Hierarchy Section** (`LeadersHierarchySection`)
- **Admin Path**: `/admin/village-info` → "आपले नेते व पदसोपान रचना" (Leaders)
- **Data Model**: `Leader`
- **What's Dynamic**:
  - Add/Edit/Delete leaders (Chief Minister, Deputy CMs, Ministers, Officials)
  - Leader name, role (Marathi & English)
  - Leader image (upload)
  - Order/sequence
  - Activate/deactivate
- **API Route**: `/api/leaders`
- **Component**: `src/components/admin/homepage/leaders-section.tsx`
- **Frontend**: `src/components/sections/leaders-hierarchy-section.tsx`

#### 4. **Progress Meter Section** (`PragatiMeterSection`)
- **Admin Path**: `/admin/village-info` → "प्रगती मीटर" (Progress Metrics)
- **Data Model**: `ProgressMetric`
- **What's Dynamic**:
  - Add/Edit/Delete metrics (sanitation, electricity, water, trees, etc.)
  - Metric label (Marathi & English)
  - Current value, target value, unit
  - Icon selection, color selection
  - Order/sequence
  - Activate/deactivate
- **API Route**: `/api/progress-metrics`
- **Component**: `src/components/admin/homepage/progress-metrics-section.tsx`
- **Frontend**: `src/components/sections/pragati-meter-section.tsx`

#### 5. **Welcome Video Section** (`WelcomeVideoSection`)
- **Admin Path**: `/admin/village-info` → "गावाचे स्वागत व्हिडिओ" (Welcome Video)
- **Data Model**: `HomepageSettings`
- **What's Dynamic**:
  - YouTube/Vimeo video URL
  - Video title & description
  - Activate/deactivate video
- **API Route**: `/api/homepage-settings`
- **Component**: `src/components/admin/homepage/village-info-section.tsx` (embedded)
- **Frontend**: `src/components/sections/welcome-video-section.tsx`

#### 6. **QR Tax Payment Section** (`QRTaxPaymentSection`)
- **Admin Path**: `/admin/village-info` → "QR कोड सेटिंग्स" (QR Code Settings)
- **Data Model**: `QRCodeSettings`
- **What's Dynamic**:
  - Property tax QR code (UPI payment string)
  - Water tax QR code (UPI payment string)
  - Instructions for property tax payment
  - Instructions for water tax payment
- **API Route**: `/api/qr-code-settings`
- **Component**: `src/components/admin/homepage/qr-code-settings-section.tsx`
- **Frontend**: `src/components/sections/qr-tax-payment-section.tsx`

#### 7. **News Updates Section** (`NewsUpdatesSection`)
- **Admin Path**: `/admin/village-info` → "ताज्या बातम्या व अद्यतन" (News Updates)
- **Data Model**: `NewsItem`
- **What's Dynamic**:
  - Add/Edit/Delete news items
  - Title, description, date
  - Image (upload)
  - Category & category color
  - Urgent flag
  - Order/sequence
  - Activate/deactivate
- **API Route**: `/api/news-items`
- **Component**: `src/components/admin/homepage/news-updates-section.tsx`
- **Frontend**: `src/components/sections/news-updates-section.tsx`

#### 8. **Daily Message Section** (`DailyMessageSection`)
- **Admin Path**: `/admin/village-info` → "आजचा सुविचार / पंचायत संदेश" (Daily Message)
- **Data Model**: `DailyMessage`
- **What's Dynamic**:
  - Message text
  - Author title (Sarpanch, etc.)
  - Date
  - Category, icon, color
  - Activate/deactivate
- **API Route**: `/api/daily-messages`
- **Component**: `src/components/admin/homepage/daily-message-section.tsx`
- **Frontend**: `src/components/sections/daily-message-section.tsx`

#### 9. **Announcements Section** (`AnnouncementsSection`)
- **Admin Path**: `/admin/village-info` → "सूचना व्यवस्थापन" (Announcements)
- **Data Model**: `Announcement`
- **What's Dynamic**:
  - Add/Edit/Delete announcements
  - Title, date, description, full description
  - Image (upload)
  - Category, priority, status
  - Order/sequence
  - Activate/deactivate
- **API Route**: `/api/announcements`
- **Component**: `src/components/admin/homepage/announcements-section.tsx`
- **Frontend**: `src/components/sections/announcements-section.tsx`

#### 10. **History Section** (`HistorySection`)
- **Admin Path**: `/admin/village-info` → "इतिहास व्यवस्थापन" (History)
- **Data Models**: `HistoryCard`, `TimelineItem`
- **What's Dynamic**:
  - History cards (title, description, gradient, icon, order)
  - Timeline items (year, title, description, side - left/right, order)
  - Add/Edit/Delete both
  - Activate/deactivate
- **API Routes**: `/api/history-cards`, `/api/timeline-items`
- **Component**: `src/components/admin/homepage/history-section.tsx`
- **Frontend**: `src/components/sections/history-section.tsx`

#### 11. **Cultural Heritage Section** (`CulturalHeritageSection`)
- **Admin Path**: `/admin/village-info` → "सांस्कृतिक वारसा" (Cultural Heritage)
- **Data Model**: `CulturalHeritage`
- **What's Dynamic**:
  - Add/Edit/Delete cultural items
  - Title, description (Marathi & English)
  - Image (upload)
  - Category
  - Order/sequence
  - Activate/deactivate
- **API Route**: `/api/cultural-heritage`
- **Component**: `src/components/admin/homepage/cultural-heritage-section.tsx`
- **Frontend**: `src/components/sections/cultural-heritage-section.tsx`

#### 12. **Header** (Dynamic)
- **Admin Path**: `/admin/village-info` → "गाव ब्रँडिंग" (Village Branding)
- **Data Model**: `VillageInfo`
- **What's Dynamic**:
  - Village logo (upload)
  - Village name
  - Government logos (Satyamev Jayate, Digital India) - upload
  - Government department text
  - Official site text
- **API Route**: `/api/village-info`
- **Component**: `src/components/admin/homepage/village-info-section.tsx`
- **Frontend**: `src/components/layout/header.tsx`

#### 13. **Footer** (Dynamic)
- **Admin Path**: `/admin/village-info` → "Footer Content Management"
- **Data Model**: `FooterContent`
- **What's Dynamic**:
  - Footer description
  - Social media links (JSON array - add/remove platforms)
  - Contact information (office name, address, phone, email, website)
  - Government branding for footer (logos, text)
- **API Route**: `/api/footer-content`
- **Component**: `src/components/admin/homepage/footer-content-section.tsx`
- **Frontend**: `src/components/layout/footer.tsx`

#### 14. **Sankalp Tracker Section** (`SankalpTrackerSection`)
- **Admin Path**: `/admin/sankalp-tracker`
- **Data Model**: `SankalpItem`
- **What's Dynamic**:
  - Ten-point ग्राम संकल्प tracker cards (title, descriptions in Marathi & English)
  - Progress values (`currentValue`, `targetValue`, units)
  - Priority & status chips (high/medium/low, completed/in-progress/pending)
  - Icon + gradient color selection
  - Ordering and activate/deactivate toggles
- **API Route**: `/api/sankalp-items`
- **Component**: `src/app/admin/sankalp-tracker/page.tsx`
- **Frontend**: `src/components/sections/sankalp-tracker-section.tsx` (fed from `src/app/subdomain/[subdomain]/projects/page.tsx`)

---

## Other Dynamic Pages

### **Programs Page** (`/programs`)
- **Admin Path**: `/admin/programs`
- **Data Model**: `Program`
- **What's Dynamic**: Events, festivals, dates, locations, images, categories

### **Gallery Page** (`/gallery`)
- **Admin Path**: `/admin/gallery`
- **Data Model**: `Gallery`
- **What's Dynamic**: Photos, videos, categories, descriptions

### **Income-Expense Page** (`/jama-kharch`)
- **Admin Path**: `/admin/income-expense`
- **Data Model**: `IncomeExpense`
- **What's Dynamic**: Financial records, income, expenses, categories, amounts, dates

### **Government Schemes Page** (`/sarkari-yojana`)
- **Admin Path**: `/admin/government-schemes`
- **Data Model**: `GovernmentScheme`
- **What's Dynamic**: Scheme details, eligibility, benefits, documents, application process

### **Departments Page** (`/vibhag`)
- **Admin Path**: `/admin/departments`
- **Data Model**: `Department`
- **What's Dynamic**: Department info, head, services, contact details

### **Facilities Page** (`/suvidha`)
- **Admin Path**: `/admin/facilities`
- **Data Model**: `Facility`
- **What's Dynamic**: Village facilities, locations, contact info, working hours

### **Contact Page** (`/sampark`)
- **Admin Path**: `/admin/contact`
- **Data Models**: `Contact`, `OfficeDetails`
- **What's Dynamic**: Contact persons, office details, addresses, phone, email

### **Projects Page** (`/prakalp`)
- **Admin Path**: `/admin/projects`
- **Data Model**: `Project`
- **What's Dynamic**: Development projects, before/after images, budgets, status, impact metrics

### **Government Resolutions Page** (`/sarkari-tharav`)
- **Admin Path**: `/admin/government-resolutions`
- **Data Model**: `GovernmentResolution`
- **What's Dynamic**: Resolutions, circulars, PDF files, dates, departments

---

## How It Works: Technical Details

### **1. Subdomain Validation**
Every API route uses `validateSubdomain(request)` to:
- Extract subdomain from request headers/cookies
- Verify subdomain exists and is active
- Get `subdomainId` for database queries
- Ensure admin has access to that subdomain

```typescript
// Example from /api/hero-images/route.ts
const { isValid, subdomainId } = await validateSubdomain(request);
if (!isValid) {
  return NextResponse.json({ message: 'Invalid subdomain' }, { status: 404 });
}
```

### **2. Database Queries (Subdomain-Scoped)**
All queries filter by `subdomainId`:

```typescript
// Example: Fetching hero images
const heroImages = await prisma.heroImage.findMany({
  where: { 
    isActive: true, 
    subdomainId  // Only get images for this subdomain
  },
  orderBy: { createdAt: 'asc' }
});
```

### **3. Admin Component → API → Database Flow**

**Step 1: Admin Component (Client-Side)**
```typescript
// src/components/admin/homepage/hero-images-section.tsx
const handleUpload = async (file) => {
  // 1. Upload file to Vercel Blob
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  // 2. Save to database
  const saveResponse = await fetch('/api/hero-images', {
    method: 'POST',
    body: JSON.stringify({ imageUrl, title, description, isActive: true }),
  });
};
```

**Step 2: API Route (Server-Side)**
```typescript
// src/app/api/hero-images/route.ts
export async function POST(request: NextRequest) {
  // 1. Validate subdomain
  const { isValid, subdomainId } = await validateSubdomain(request);
  
  // 2. Save to database with subdomainId
  const heroImage = await prisma.heroImage.create({
    data: {
      imageUrl,
      title,
      description,
      isActive: true,
      subdomainId,  // Links to specific subdomain
    },
  });
  
  // 3. Log activity
  await logCrudActivity(request, 'CREATE', 'HeroImage', heroImage.id, ...);
  
  return NextResponse.json(heroImage);
}
```

**Step 3: Frontend Page (Server-Side Rendering)**
```typescript
// src/app/subdomain/[subdomain]/page.tsx
export default async function SubdomainPage({ params }) {
  const { subdomain } = await params;
  
  // Fetch subdomain data with all relations
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      heroImages: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
      // ... other relations
    }
  });
  
  // Render with dynamic data
  return <HeroSection heroImages={subdomainData.heroImages} />;
}
```

### **4. Real-Time Updates**
- Admin changes are saved immediately to database
- Frontend uses Server-Side Rendering (SSR) - changes appear on next page load
- No need for client-side state management for content

---

## Key Features

### **1. Complete Content Control**
- ✅ Every text, image, and setting is editable
- ✅ No hardcoded content (except default fallbacks)
- ✅ Multi-language support (Marathi primary, English secondary)

### **2. File Upload System**
- Uses Vercel Blob Storage
- Supports JPG, PNG, WebP
- Max 5-10MB per file
- Automatic URL generation

### **3. Ordering & Activation**
- All list items have `order` field for custom sequencing
- `isActive` flag to show/hide items without deleting
- Drag-and-drop reordering in admin panel (where implemented)

### **4. Activity Logging**
- All admin actions are logged
- Tracks: user, action (CREATE/UPDATE/DELETE), model, timestamp
- Useful for audit trails

### **5. Subdomain Isolation**
- Each village's data is completely isolated
- Admins can only access their assigned subdomain
- No cross-contamination between villages

---

## Example: Adding a New Hero Image

1. **Admin goes to**: `/admin/village-info` → "मुख्य प्रतिमा" section
2. **Clicks**: "नवीन प्रतिमा अपलोड करा" (Upload New Image)
3. **Selects file**: Image file from computer
4. **System uploads**: File to Vercel Blob Storage
5. **System saves**: Image URL + metadata to MongoDB with `subdomainId`
6. **Frontend displays**: New image appears in hero slider on next page load

**Result**: The hero section on the website now shows the new image automatically!

---

## Summary

**Everything is dynamic!** The admin panel provides complete control over:
- ✅ All homepage sections
- ✅ All page content
- ✅ Images, videos, files
- ✅ Text content (Marathi & English)
- ✅ Settings and configurations
- ✅ Ordering and visibility
- ✅ Branding and logos

The website is essentially a **template** that gets populated with data from the database based on the subdomain. Each village's website is unique, but uses the same codebase and template structure.

