# UI Design Analysis & Feature Extraction

## 📸 UI Designs Received

### 1. New Valuation - Step 1 (Address & Property Type)
**Components:**
- Page title: "New Property Valuation"
- Left section: "Start New Valuation" card
  - Progress tabs: 01. Address (active) → 02. Info → 03. Purpose
  - Property Address input field (with Geoapify autocomplete)
  - Property Type buttons (5 options):
    - Single Family
    - Condo
    - Townhouse
    - Multi-Family
    - Land
  - "Next →" button (blue, primary)
- Right section: "Live Map" showing location pin
- Bottom left: Credit indicator "5/20" with "Pro Plan Active" and "Purchase More Credits" link

**Technical Requirements:**
- ✅ Multi-step form component with progress indicator
- ✅ Geoapify address autocomplete integration
- ✅ Property type selection (radio buttons styled as cards)
- ✅ Interactive map (Google Maps or Mapbox)
- ✅ Real-time map updates when address is entered
- ✅ Credit display component (dynamic based on subscription)

---

### 2. New Valuation - Step 2 (Client Information)
**Components:**
- Progress tabs: 01. Address (complete) → 02. Info (active) → 03. Purpose
- Toggle buttons: "Create New Client" (active) | "Select Existing Lead"
- Form fields:
  - Client Name * (required)
  - Email
  - Phone
- "← Back" button | "Next →" button

**Technical Requirements:**
- ✅ Toggle between "Create New Client" and "Select Existing Lead"
- ✅ When "Select Existing Lead" is active, show dropdown with existing leads
- ✅ Form validation (client name required)
- ✅ Email and phone validation
- ✅ Back button to return to Step 1 (preserve data)

---

### 3. New Valuation - Step 3 (Purpose)
**Components:**
- Progress tabs: 01. Address (complete) → 02. Info (complete) → 03. Purpose (active)
- "Valuation Purpose" dropdown (e.g., Seller Listing)
- "← Back" button | "💾 Save Draft" button | "✨ Generate Report" button

**Technical Requirements:**
- ✅ Purpose dropdown (predefined options: Seller Listing, Buyer Assessment, Refinance, etc.)
- ✅ "Save Draft" functionality (save without consuming credit)
- ✅ "Generate Report" button (calls Rentcast API, consumes 1 credit, generates PDF)
- ✅ Loading state during report generation

---

### 4. Property Valuation Detail Page
**Components:**
- **Header Actions:**
  - "← Back to dashboard"
  - "Download PDF" button
  - "Share Link" button
  - "Email Client" button

- **Left Section:**
  - Address: "5500 Grand Lake Dr, San Antonio, TX 78244"
  - Estimated Market Value: "$250,000" (large, prominent)
  - Property details grid (2 columns):
    - Property Type: Single Family
    - Beds: 3
    - Baths: 2
    - Square Foot: 1,878 Sq Ft
    - Date Built: 1973
    - Lot Square Foot: 8,843 Sq Ft
    - Price Range: $195,000 - $304,000
    - Last Sold: Nov 2024 for $270k

- **Market Pulse & Value Range:**
  - Visualization showing price range with slider
  - Lowest: $195,000 | Current Estimate: $250,000 | Highest: $304,000

- **Comparable Market Activity:**
  - Map with comparable property pins (numbered)
  - List of comparables:
    - Address (distance away)
    - Beds/Baths/Sqft
    - Correlation score (e.g., 99% Match)
    - Days on Market
    - Days Old
    - Price (e.g., $289,444)
    - Status badge (Active)

- **Realtor Contact Section:**
  - Realtor headshot (circular)
  - Name: "John Smith"
  - Tagline: "Questions about this value? I'm the local expert."
  - "Call John" button | "Email John" button

- **Footer:**
  - Important Disclaimer (legal text)

**Technical Requirements:**
- ✅ Display valuation data from Rentcast API response
- ✅ Price range visualization (slider/chart component)
- ✅ Interactive map with comparable property markers
- ✅ Comparable properties table/cards
- ✅ Correlation score calculation
- ✅ Realtor branding (pull from user profile)
- ✅ PDF download functionality
- ✅ Public share link generation
- ✅ Email client functionality (send PDF via SMTP)

---

### 5. History Page (Valuation History)
**Components:**
- **Stats Cards (3 columns):**
  1. Total Valuations: "5" (+2 reports in last 7 days)
  2. Portfolio Volume: "$2M+" (Combined value of all properties)
  3. Avg. Property Value: "$400K" (Average market price point)

- **All Valuation Reports Table:**
  - Title: "All Valuation Reports" with subtitle
  - Search bar: "Search by address..."
  - Filters: "Sort" dropdown | "Export" button
  - Table columns:
    - Property Details (address)
    - Lead Name
    - Valuation (price)
    - Specs (beds/baths/sqft with icons)
    - Status (badges: Viewed, Sent, Draft)
    - Actions (view 👁️ | download 📥 | delete 🗑️)

**Technical Requirements:**
- ✅ Aggregate statistics calculation
  - Total valuations count
  - Sum of all property values (portfolio volume)
  - Average property value
  - Recent activity tracking (e.g., "+2 in last 7 days")
- ✅ Filterable/searchable table
- ✅ Search by address
- ✅ Sort functionality (by date, value, status)
- ✅ Export to CSV/Excel
- ✅ Status tracking:
  - **Draft:** Saved but not sent
  - **Sent:** PDF emailed to client
  - **Viewed:** Client opened the report (track via public link)
- ✅ Quick actions: View, Download, Delete
- ✅ Pagination

---

## 🆕 Additional Features Identified

### Property Type Selection
The UI shows 5 property types:
1. Single Family
2. Condo
3. Townhouse
4. Multi-Family
5. Land

**Database Update Required:**
```prisma
enum PropertyType {
  SINGLE_FAMILY
  CONDO
  TOWNHOUSE
  MULTI_FAMILY
  LAND
}

model Valuation {
  // ... existing fields
  propertyType PropertyType? @map("property_type")
}
```

### Valuation Purpose
Dropdown options (suggested):
- Seller Listing
- Buyer Assessment
- Refinance
- Investment Analysis
- Estate Planning
- Divorce Settlement
- Tax Appeal

**Database Update Required:**
```prisma
model Valuation {
  // ... existing fields
  purpose String?
}
```

### Draft Functionality
Users can save valuations as drafts without:
- Consuming a credit
- Generating a PDF
- Calling Rentcast API

**Implementation:**
- Save form data to database with status: "DRAFT"
- "Generate Report" converts draft to completed valuation
- Credits only consumed on "Generate Report"

### Status Tracking
Three statuses for valuations:
1. **Draft:** Saved, not completed
2. **Sent:** PDF generated and emailed to client
3. **Viewed:** Client opened the public share link

**Database Update Required:**
```prisma
enum ValuationStatus {
  DRAFT
  COMPLETED
  SENT
  VIEWED
}

model Valuation {
  // ... existing fields
  status ValuationStatus @default(COMPLETED)
}
```

### "Select Existing Lead" Feature
When creating a new valuation, users can:
- Create a new client (new lead)
- OR select an existing lead from dropdown

**Implementation:**
- On Step 2, toggle between "Create New Client" and "Select Existing Lead"
- If "Select Existing Lead":
  - Show dropdown with all existing leads (searchable)
  - Pre-fill email/phone from selected lead
  - Associate new valuation with existing lead
- If "Create New Client":
  - Show empty form fields
  - Create new lead record on submission

---

## 🎨 Design Tokens Confirmed

### Additional Components Identified

**Progress Tabs:**
```css
.progress-tab {
  display: flex;
  gap: 2rem;
}

.progress-tab-item {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-400);
  position: relative;
}

.progress-tab-item.active {
  color: var(--primary-600);
  border-bottom: 2px solid var(--primary-600);
}

.progress-tab-item.completed {
  color: var(--gray-700);
}
```

**Property Type Buttons:**
```css
.property-type-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  background: var(--background);
  color: var(--gray-700);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.property-type-button:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.property-type-button.selected {
  border-color: var(--primary-600);
  background: var(--primary-50);
  color: var(--primary-600);
  font-weight: 600;
}
```

**Toggle Buttons:**
```css
.toggle-group {
  display: inline-flex;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  overflow: hidden;
}

.toggle-button {
  padding: 0.5rem 1rem;
  background: var(--background);
  color: var(--gray-600);
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-right: 1px solid var(--gray-200);
}

.toggle-button:last-child {
  border-right: none;
}

.toggle-button.active {
  background: var(--primary-600);
  color: white;
}
```

**Status Badges (from History table):**
```css
/* Viewed Badge - Green */
.badge-viewed {
  background: var(--success-100);
  color: var(--success-700);
}

/* Sent Badge - Blue */
.badge-sent {
  background: var(--info-100);
  color: var(--info-700);
}

/* Draft Badge - Gray */
.badge-draft {
  background: var(--gray-100);
  color: var(--gray-600);
}
```

---

## 📋 Summary of New Requirements

### Database Schema Updates
1. Add `propertyType` enum field to Valuations
2. Add `purpose` string field to Valuations
3. Add `status` enum field (DRAFT, COMPLETED, SENT, VIEWED)
4. Add view tracking for public share links

### New Features
1. **Draft functionality** - Save without consuming credits
2. **Property type selection** - 5 types (Single Family, Condo, etc.)
3. **Valuation purpose** - Dropdown with predefined options
4. **Select existing lead** - Associate valuation with existing lead
5. **Status tracking** - Track if sent/viewed
6. **View tracking** - Track when clients open public links
7. **Live map on form** - Show location in real-time as user types
8. **Comparable properties on detail page** - Map + list with correlation scores
9. **Price range visualization** - Slider showing low/estimate/high

### UI Components to Build
1. Multi-step form with progress tabs
2. Property type selection buttons
3. Toggle button group (Create New/Select Existing)
4. Price range slider visualization
5. Comparable properties map (with numbered pins)
6. Stats cards (Total Valuations, Portfolio Volume, Avg Value)
7. Valuation history table with filters
8. Status badges (Viewed, Sent, Draft)

---

## ✅ Design Clarity

All major UI screens are now documented:
- ✅ Dashboard (received earlier)
- ✅ New Valuation (3 steps)
- ✅ Property Valuation Detail
- ✅ History

**Still Needed:**
- Login/Signup pages
- Lead Manager page
- Lead Detail page
- Widgets page
- Profile/Settings page
- Billing & Plans page

---

**Document Version:** 1.0
**Date:** 2025-12-03
**Status:** Awaiting remaining UI designs
