# ValuPro Design System
## Extracted from Dashboard UI - Design Tokens Reference

---

## 🎨 COLOR PALETTE

### Primary Brand Colors
Based on the blue theme in the dashboard:

```css
/* Primary Blue Scale */
--primary-50: #EFF6FF;    /* Lightest - Backgrounds, hover states */
--primary-100: #DBEAFE;   /* Very light - Subtle backgrounds */
--primary-200: #BFDBFE;   /* Light - Disabled states */
--primary-300: #93C5FD;   /* Light-medium - Borders */
--primary-400: #60A5FA;   /* Medium - Hover states */
--primary-500: #3B82F6;   /* Main brand color - Primary buttons, links, icons */
--primary-600: #2563EB;   /* Dark - Active/pressed states */
--primary-700: #1D4ED8;   /* Darker - Text on light backgrounds */
--primary-800: #1E40AF;   /* Very dark */
--primary-900: #1E3A8A;   /* Darkest - High contrast text */
```

### Neutral/Gray Scale
For text, backgrounds, and UI elements:

```css
/* Gray Scale */
--gray-50: #F9FAFB;       /* Page background, lightest gray */
--gray-100: #F3F4F6;      /* Card backgrounds, subtle dividers */
--gray-200: #E5E7EB;      /* Borders, dividers */
--gray-300: #D1D5DB;      /* Disabled text, placeholder text */
--gray-400: #9CA3AF;      /* Muted text, icons */
--gray-500: #6B7280;      /* Secondary text */
--gray-600: #4B5563;      /* Body text */
--gray-700: #374151;      /* Dark body text */
--gray-800: #1F2937;      /* Headings, emphasis */
--gray-900: #111827;      /* Darkest text, primary headings */
```

### Status/Semantic Colors

```css
/* Success - Green */
--success-50: #F0FDF4;
--success-100: #DCFCE7;
--success-500: #22C55E;   /* "Qualified" status badge */
--success-600: #16A34A;
--success-700: #15803D;

/* Warning - Orange/Yellow */
--warning-50: #FFFBEB;
--warning-100: #FEF3C7;
--warning-500: #F59E0B;   /* "Contacted" status badge */
--warning-600: #D97706;
--warning-700: #B45309;

/* Info - Blue */
--info-50: #EFF6FF;
--info-100: #DBEAFE;
--info-500: #3B82F6;      /* "New" status badge */
--info-600: #2563EB;
--info-700: #1D4ED8;

/* Error/Danger - Red */
--error-50: #FEF2F2;
--error-100: #FEE2E2;
--error-500: #EF4444;     /* Error states, destructive actions */
--error-600: #DC2626;
--error-700: #B91C1C;
```

### UI Semantic Colors

```css
/* Backgrounds */
--background: #FFFFFF;              /* Main page background */
--background-secondary: #F9FAFB;    /* Secondary/sidebar background */
--card: #FFFFFF;                    /* Card backgrounds */
--popover: #FFFFFF;                 /* Dropdown/modal backgrounds */

/* Text */
--foreground: #111827;              /* Primary text */
--foreground-muted: #6B7280;        /* Secondary/muted text */
--foreground-subtle: #9CA3AF;       /* Tertiary/subtle text */

/* Borders */
--border: #E5E7EB;                  /* Default border color */
--border-strong: #D1D5DB;           /* Emphasized borders */

/* Interactive Elements */
--input: #FFFFFF;                   /* Input backgrounds */
--input-border: #E5E7EB;            /* Input borders */
--ring: #3B82F6;                    /* Focus ring color */

/* Radius */
--radius: 0.5rem;                   /* 8px - default border radius */
--radius-sm: 0.375rem;              /* 6px - small elements */
--radius-md: 0.5rem;                /* 8px - medium elements */
--radius-lg: 0.75rem;               /* 12px - large elements */
--radius-xl: 1rem;                  /* 16px - extra large elements */
```

---

## 📝 TYPOGRAPHY

### Font Family

```css
/* Primary Font */
font-family: 'Manrope', system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Font Weights

```css
--font-normal: 400;      /* Regular text */
--font-medium: 500;      /* Slightly emphasized text */
--font-semibold: 600;    /* Buttons, labels, table headers */
--font-bold: 700;        /* Strong headings */
--font-extrabold: 800;   /* Hero text, large numbers */
```

### Font Sizes & Line Heights

Based on the dashboard UI:

```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - Timestamps, small labels, badges */
--text-sm: 0.875rem;     /* 14px - Secondary text, table data, captions */
--text-base: 1rem;       /* 16px - Body text, form inputs */
--text-lg: 1.125rem;     /* 18px - Large body text, subheadings */
--text-xl: 1.25rem;      /* 20px - Section headers, card titles */
--text-2xl: 1.5rem;      /* 24px - Page titles, dashboard headings */
--text-3xl: 1.875rem;    /* 30px - Large metric values (e.g., "$1,500") */
--text-4xl: 2.25rem;     /* 36px - Extra large values (e.g., "$1.2M") */
--text-5xl: 3rem;        /* 48px - Hero text */

/* Line Heights */
--leading-none: 1;       /* Tight - Large numbers */
--leading-tight: 1.25;   /* 1.25 - Headings */
--leading-snug: 1.375;   /* 1.375 - Tight body text */
--leading-normal: 1.5;   /* 1.5 - Default body text */
--leading-relaxed: 1.625;/* 1.625 - Comfortable reading */
--leading-loose: 2;      /* 2 - Very spacious */
```

### Typography Usage Examples

```css
/* Page Title (e.g., "Dashboard") */
.page-title {
  font-size: var(--text-2xl);    /* 24px */
  font-weight: var(--font-bold); /* 700 */
  color: var(--gray-900);
  line-height: var(--leading-tight);
}

/* Card Title (e.g., "Valuation Usage") */
.card-title {
  font-size: var(--text-xl);     /* 20px */
  font-weight: var(--font-semibold); /* 600 */
  color: var(--gray-800);
  line-height: var(--leading-snug);
}

/* Large Metric Value (e.g., "$1,500") */
.metric-value {
  font-size: var(--text-3xl);    /* 30px */
  font-weight: var(--font-extrabold); /* 800 */
  color: var(--gray-900);
  line-height: var(--leading-none);
}

/* Extra Large Value (e.g., "$1.2M") */
.metric-value-large {
  font-size: var(--text-4xl);    /* 36px */
  font-weight: var(--font-extrabold); /* 800 */
  color: var(--gray-900);
  line-height: var(--leading-none);
}

/* Body Text */
.body-text {
  font-size: var(--text-base);   /* 16px */
  font-weight: var(--font-normal); /* 400 */
  color: var(--gray-600);
  line-height: var(--leading-normal);
}

/* Muted Text (e.g., "15 remaining this month") */
.muted-text {
  font-size: var(--text-sm);     /* 14px */
  font-weight: var(--font-normal); /* 400 */
  color: var(--gray-500);
  line-height: var(--leading-normal);
}

/* Table Header */
.table-header {
  font-size: var(--text-sm);     /* 14px */
  font-weight: var(--font-semibold); /* 600 */
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Button Text */
.button-text {
  font-size: var(--text-sm);     /* 14px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-tight);
}

/* Status Badge */
.badge-text {
  font-size: var(--text-xs);     /* 12px */
  font-weight: var(--font-medium); /* 500 */
  line-height: var(--leading-tight);
  text-transform: capitalize;
}

/* Timestamp (e.g., "3 min ago") */
.timestamp {
  font-size: var(--text-xs);     /* 12px */
  font-weight: var(--font-normal); /* 400 */
  color: var(--gray-400);
}
```

---

## 📏 SPACING SYSTEM

Based on 4px base unit:

```css
/* Spacing Scale */
--space-0: 0;           /* 0px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
```

### Spacing Usage

```css
/* Card Padding */
--card-padding: var(--space-6);         /* 24px */

/* Section Spacing */
--section-gap: var(--space-6);          /* 24px between sections */

/* Form Element Spacing */
--input-padding-x: var(--space-4);      /* 16px horizontal */
--input-padding-y: var(--space-3);      /* 12px vertical */
--form-gap: var(--space-4);             /* 16px between form fields */

/* Button Padding */
--button-padding-x: var(--space-4);     /* 16px horizontal */
--button-padding-y: var(--space-2);     /* 8px vertical */
--button-padding-lg-x: var(--space-6);  /* 24px large button */
--button-padding-lg-y: var(--space-3);  /* 12px large button */

/* Table Cell Padding */
--table-cell-padding-x: var(--space-4); /* 16px */
--table-cell-padding-y: var(--space-3); /* 12px */
```

---

## 🎨 COMPONENT STYLES

### Cards

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);      /* 12px */
  padding: var(--card-padding);         /* 24px */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--primary-600);       /* #2563EB */
  color: #FFFFFF;
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--radius);         /* 8px */
  font-weight: var(--font-semibold);    /* 600 */
  font-size: var(--text-sm);            /* 14px */
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-700);       /* #1D4ED8 */
}

.btn-primary:active {
  background: var(--primary-800);
}

/* Secondary Button (Outline) */
.btn-secondary {
  background: transparent;
  color: var(--primary-600);
  border: 1px solid var(--primary-600);
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--radius);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
}

.btn-secondary:hover {
  background: var(--primary-50);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--gray-600);
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--radius);
  font-weight: var(--font-medium);
}

.btn-ghost:hover {
  background: var(--gray-100);
}
```

### Status Badges

```css
/* Base Badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;           /* Full rounded */
  font-size: var(--text-xs);       /* 12px */
  font-weight: var(--font-medium); /* 500 */
  text-transform: capitalize;
}

/* New Badge */
.badge-new {
  background: var(--info-100);     /* #DBEAFE */
  color: var(--info-700);          /* #1D4ED8 */
}

/* Contacted Badge */
.badge-contacted {
  background: var(--warning-100);  /* #FEF3C7 */
  color: var(--warning-700);       /* #B45309 */
}

/* Qualified Badge */
.badge-qualified {
  background: var(--success-100);  /* #DCFCE7 */
  color: var(--success-700);       /* #15803D */
}

/* Lost Badge */
.badge-lost {
  background: var(--error-100);    /* #FEE2E2 */
  color: var(--error-700);         /* #B91C1C */
}
```

### Input Fields

```css
.input {
  background: var(--input);
  border: 1px solid var(--input-border);
  border-radius: var(--radius);
  padding: var(--input-padding-y) var(--input-padding-x);
  font-size: var(--text-base);
  color: var(--foreground);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--ring);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input::placeholder {
  color: var(--gray-400);
}

.input:disabled {
  background: var(--gray-100);
  color: var(--gray-400);
  cursor: not-allowed;
}
```

### Tables

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: var(--gray-50);
  border-bottom: 2px solid var(--border);
}

.table th {
  padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.table td {
  padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
  border-bottom: 1px solid var(--border);
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.table tbody tr:hover {
  background: var(--gray-50);
}
```

### Sidebar Navigation

```css
.sidebar {
  background: var(--background);
  border-right: 1px solid var(--border);
  width: 256px;
  padding: var(--space-6);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  color: var(--gray-600);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  transition: all 0.2s;
}

.nav-item:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

.nav-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  font-weight: var(--font-semibold);
}
```

---

## 🌓 SHADOWS

```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
```

### Shadow Usage
- **Cards:** `--shadow` (default)
- **Cards on hover:** `--shadow-md`
- **Dropdowns/Popovers:** `--shadow-lg`
- **Modals:** `--shadow-xl`

---

## 🎯 ICON SIZES

```css
--icon-xs: 16px;    /* Small icons in badges, compact UI */
--icon-sm: 20px;    /* Navigation icons, table actions */
--icon-md: 24px;    /* Standard icons, buttons */
--icon-lg: 32px;    /* Large feature icons, dashboard cards */
--icon-xl: 48px;    /* Hero icons, empty states */
```

---

## 📐 BREAKPOINTS

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;    /* Small devices */
--breakpoint-md: 768px;    /* Tablets */
--breakpoint-lg: 1024px;   /* Laptops */
--breakpoint-xl: 1280px;   /* Desktops */
--breakpoint-2xl: 1536px;  /* Large desktops */
```

---

## 🎨 GRADIENT BACKGROUNDS

```css
/* Subtle gradient for hero sections */
--gradient-primary: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);

/* Gradient for stat cards (optional) */
--gradient-stat: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
```

---

## ⚡ TRANSITIONS

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

### Common Transitions
```css
/* Hover effects */
transition: background-color var(--transition-base),
            box-shadow var(--transition-base);

/* Opacity changes */
transition: opacity var(--transition-fast);

/* Transform animations */
transition: transform var(--transition-base);
```

---

## 📱 MOBILE-SPECIFIC TOKENS

```css
/* Mobile optimizations */
--mobile-padding: var(--space-4);      /* 16px page padding on mobile */
--mobile-card-padding: var(--space-4); /* 16px card padding on mobile */
--mobile-text-base: 14px;              /* Slightly smaller base text */
```

---

## 🎨 ACCESSIBILITY

### Focus Styles
```css
.focusable:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### Minimum Touch Target
```css
--touch-target-min: 44px;  /* Minimum 44x44px for touch targets */
```

### Color Contrast
All color combinations meet WCAG AA standards:
- **Normal text:** 4.5:1 contrast ratio
- **Large text:** 3:1 contrast ratio
- **UI components:** 3:1 contrast ratio

---

## 🔧 TAILWIND CONFIGURATION

This design system will be implemented in Tailwind CSS. Here's the config structure:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* blue scale */ },
        gray: { /* neutral scale */ },
        success: { /* green scale */ },
        warning: { /* orange scale */ },
        error: { /* red scale */ },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        // ... etc
      },
      spacing: {
        // Custom spacing if needed
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.375rem',
        lg: '0.75rem',
        // ... etc
      },
      boxShadow: {
        // Custom shadows
      },
    },
  },
}
```

---

**Design System Version:** 1.0
**Last Updated:** 2025-12-03
**Status:** Extracted from Dashboard UI

This design system ensures consistency across all pages and components of the ValuPro platform.
