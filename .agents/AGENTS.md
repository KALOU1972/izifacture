<!-- markdownlint-disable -->
<RULE>
<!-- BEGIN:izifacture-design-system -->

# IziFacture Design System & UI Rules

When creating new pages or components for the IziFacture application, you MUST strictly adhere to the following design system established in the dashboard. This ensures a highly professional, consistent, and responsive user experience.

## 1. Colors & Variables

- **Backgrounds**: Use `bg-[var(--color-background)]` for page backgrounds, and `bg-[var(--color-surface)]` for cards/panels.
- **Text**: Use `text-[var(--color-text-main)]` for primary text and headings. Use `text-[var(--color-text-muted)]` for secondary text, labels, and placeholders.
- **Borders**: Use `border-[var(--color-border)]` for all standard borders and dividers.
- **Brand/Primary**: Use `var(--color-primary)` for main accents, primary buttons, and active states. Use `var(--color-sidebar-hover)` for hover states on rows and sidebar items.
- **Status/Alerts**: Use `text-[var(--color-status-overdue)]` for negative trends/alerts (red).

## 2. Micro-interactions & Animations (CRITICAL)

Every interactive element must feel premium and tactile. You MUST implement these exact hover/active states:

### Buttons (Primary & Secondary)

- **Base structure**: `group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`
- **Primary Button Colors**: `bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]`
- **Secondary Button Colors**: `bg-[var(--color-primary)]/10 text-[var(--color-primary)]`
- **Animations (Apply to ALL buttons)**:
  - Hover: `hover:shadow-md hover:-translate-y-0.5`
  - Active (Touch/Click): `active:translate-y-0 active:scale-95 active:bg-black active:text-white`
  - *Note*: The `active:bg-black active:text-white` is crucial for mobile touch responsiveness.
- **Icons within buttons**:
  - Wrap buttons in `group`.
  - Icon animations: e.g., `group-hover:rotate-90 group-active:rotate-90 transition-transform duration-300` or `group-hover:translate-x-1 group-active:translate-x-1`. Must include both `group-hover` and `group-active`.

### Data Rows (Lists & Tables)

- **Row wrapper**: `group flex items-center p-3 rounded-lg border border-transparent transition-all duration-200 hover:bg-[var(--color-sidebar-hover)] hover:scale-[1.01] hover:shadow-sm hover:border-[var(--color-border)]`

### Cards (Stats / Containers)

- **Stat Cards**: `group hover:-translate-y-1 hover:shadow-md transition-all duration-300`
- **Icon containers in cards**: `group-hover:bg-[var(--color-primary)]/10 transition-colors duration-300` with the icon itself having `group-hover:scale-110 transition-transform duration-300`.

### Navigation Links (Sidebar)

- **Base**: `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]`
- **Icons within links**: `group-hover:scale-110 transition-transform duration-200` or specific rotations (`group-hover:rotate-12`).

## 3. Typography & Formatting

- **Headings**: Use `text-2xl font-bold tracking-tight text-[var(--color-text-main)]`.
- **Large Numbers**: Use `font-bold tracking-tighter`.
- **Currency**: Format using the custom `formatFCFA` utility.
- **Dates**: Format using the custom `formatDate` utility.

## 4. Layout & Responsiveness

- **Mobile First**: Design for small screens first, using `sm:`, `md:`, `lg:` for larger breakpoints.
- **Mobile Lists**: Use `flex items-center justify-between` for single-row mobile lists to avoid text stacking. Put primary info on the left (`flex-1 min-w-0 truncate block`) and actions/amounts on the right (`shrink-0 flex items-center gap-2`).
- **Desktop Lists**: Use CSS Grid (e.g., `sm:grid sm:grid-cols-12 sm:contents`) to align columns perfectly.
- **Heights**: Always use `h-[100dvh]` instead of `h-screen` for full-height fixed elements (like mobile sidebars) to prevent mobile browser chrome overlap. Use `overflow-y-auto` to enable scrolling.
- **Spacing**: Use `gap-4`, `space-y-6`, and `p-4 sm:p-6 lg:p-8`.
- **Bottom padding**: Always ensure main scrollable areas have adequate bottom padding (e.g., `pb-24`) so fixed development indicators or floating buttons do not overlap bottom content.

<!-- END:izifacture-design-system -->
</RULE>
