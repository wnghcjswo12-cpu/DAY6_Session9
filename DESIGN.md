---
name: Cybernetic Industrial Intelligence
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#b9ccb2'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#84967e'
  outline-variant: '#3b4b37'
  surface-tint: '#00e639'
  primary: '#ebffe2'
  on-primary: '#003907'
  primary-container: '#00ff41'
  on-primary-container: '#007117'
  inverse-primary: '#006e16'
  secondary: '#ffdb9d'
  on-secondary: '#412d00'
  secondary-container: '#feb700'
  on-secondary-container: '#6b4b00'
  tertiary: '#fff7f6'
  on-tertiary: '#690003'
  tertiary-container: '#ffd2cc'
  on-tertiary-container: '#c4010b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#72ff70'
  primary-fixed-dim: '#00e639'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#00530e'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#ffba20'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930005'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
  surface-deep: '#0A0E14'
  surface-panel: '#141B24'
  surface-elevated: '#1C2530'
  border-subtle: '#2D3846'
  text-primary: '#E2E6EE'
  text-muted: '#8A94A6'
  neon-green: '#00FF41'
  amber-warning: '#FFB800'
  vibrant-red: '#FF3B30'
  data-cyan: '#00F0FF'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  widget-gap: 12px
---

## Brand & Style

This design system is engineered for high-stakes industrial monitoring, where split-second recognition and data integrity are paramount. The brand personality is **authoritative, surgical, and futuristic**, evoking the feel of a mission control center. 

The visual style is a hybrid of **Corporate Modern** and **High-Tech Minimalism**. It utilizes a deep-layered dark theme to reduce eye strain during long shifts while employing high-chroma accent colors to pierce through the background. The aesthetic is strictly "functional-first," removing all decorative clutter to prioritize technical telemetry and equipment health.

**Core Principles:**
- **Clarity under Pressure:** Use high contrast for critical status indicators.
- **Precision:** Every pixel must serve a purpose, utilizing monospaced fonts for numerical accuracy.
- **Density:** High information density is expected, but balanced with rigid grid alignment to prevent cognitive overload.

## Colors

The palette is optimized for a low-light "Control Room" environment. The background utilizes a **Deep Navy and Charcoal** stack to create depth without pure black fatigue.

- **Primary (Neon Green):** Reserved exclusively for 'Normal' or 'Active' statuses. It represents safety and flow.
- **Secondary (Amber):** Used for 'Warning' or 'Caution' states that require attention but not immediate intervention.
- **Tertiary (Vibrant Red):** Used sparingly for 'Critical Alarms' and 'System Failures'.
- **Data Cyan:** An auxiliary color for non-status telemetry (e.g., flow rates, pressure levels) to distinguish metrics from status signals.

Backgrounds follow a tiered hierarchy: `surface-deep` for the global canvas and `surface-panel` for individual widget containers.

## Typography

Typography is split between two distinct roles: **Human Readability** and **Data Precision**.

1.  **Hanken Grotesk** is the primary typeface for headers, labels, and descriptive text. Its sharp, contemporary geometry fits the professional industrial aesthetic.
2.  **JetBrains Mono** is utilized for all numerical data, timestamps, equipment IDs, and telemetry readings. The fixed-width characters ensure that changing values don't cause "layout jitter" and allow for easy vertical scanning of tabular data.

All labels should be uppercase with slight letter spacing to enhance legibility at small sizes. Data displays should prioritize size and weight to be readable from a distance.

## Layout & Spacing

The layout utilizes a **12-column Fluid Grid** designed to maximize screen real estate on ultra-wide monitors common in operations centers.

- **Desktop:** 12 columns, 16px gutter, 24px margins. Content is organized into functional "Zones" (Sidebar, Global Header, Main Dashboard).
- **Tablet:** 6 columns, 12px gutter. Sidebars collapse into a drawer.
- **Mobile:** 2 columns, 8px gutter. Widgets reflow into a single vertical stack.

Spacing follows a strict 4px baseline. Dashboard widgets should use a consistent 12px gap to maintain a dense but organized appearance. Equipment cards and data tables should prioritize vertical compactness to reduce scrolling.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Layering and Low-Contrast Outlines**. 

- **Level 0 (Base):** `#0A0E14` - The deepest background.
- **Level 1 (Panels):** `#141B24` with a `1px` solid border of `#2D3846`.
- **Level 2 (Active/Elevated):** `#1C2530` - Used for hovered cards or active modal surfaces.

To indicate status without color-flooding, use **Indicator Borders**. For example, an 'Alarm' equipment card should have a `2px` solid `vibrant-red` left-hand border. This "Industrial Flat" approach ensures that depth is conveyed through structure and color logic rather than physical lighting metaphors.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding provides a professional, modern feel while maintaining the rigid, structural look required for industrial applications.

- **Buttons & Inputs:** `4px` (Standard)
- **Dashboard Widgets:** `8px` (Large)
- **Status Pills:** `12px` (Pill-shaped)

Avoid large radiuses (Pill or Rounded) for structural containers to keep the UI feeling "built" rather than "drawn."

## Components

### Dashboard Widgets & Cards
Widgets are encapsulated in `#141B24` panels with a subtle top border that matches the current status (Green, Amber, or Red). 
- **Header:** Title in `label-mono`, status indicator (dot), and expand icon.
- **Content:** Centered `data-display` for primary metric.

### Gauges & Status Indicators
Gauges should be stylized as linear or semi-circular progress bars. The "filled" portion of the gauge should change color dynamically based on the value threshold (0-70% Green, 71-90% Amber, 91%+ Red).

### Equipment Cards
Compact cards used in grid views. They must feature:
- A prominent status badge in the top right.
- Equipment ID in `label-mono`.
- High-level health stats in `body-sm`.

### Data Tables
Tables are optimized for density.
- **Headers:** `label-mono`, uppercase, `#8A94A6`.
- **Rows:** Alternating "Zebra" stripes are not used; instead, use `1px` bottom borders in `#2D3846`.
- **Values:** Numbers must be right-aligned and set in `JetBrains Mono`.

### Buttons & Inputs
- **Primary Action:** Solid `#2456c4` (Brand) with white text.
- **Status Actions:** Ghost buttons with colored borders (`neon-green`, etc.) for status-specific overrides.
- **Inputs:** Dark fill (`#0A0E14`) with a focus border that glows slightly in the brand color.