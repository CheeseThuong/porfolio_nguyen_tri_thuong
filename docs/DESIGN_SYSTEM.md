# AI portfolio design system

## 1. Design direction

**Design read**: personal portfolio for technical recruiters and engineering peers, expressed as a clean technical editorial workspace in native HTML/CSS/JavaScript with a light theme.

- Direction: modern AI/technology portfolio meets a clean technical editorial workspace.
- Character: light, professional, precise and layered; evidence and project context lead the composition.
- Avoid the appearance of an admin dashboard, generic SaaS landing page, or neon gaming landing page.
- Use editorial hierarchy, restrained technical metadata, and asymmetric project storytelling.
- Design dials: `DESIGN_VARIANCE 6`, `MOTION_INTENSITY 2`, `VISUAL_DENSITY 4`.

## 2. Fixed light theme

- Use one fixed light theme across every section; do not react to system theme and do not expose a toggle.
- Background uses a clean, light tone (#F7F9FC or similar cool off-white/light gray).
- Accent family: one muted but distinct technical blue, cyan, or teal family. Accent communicates link, focus, selection, and primary action.
- Surfaces gain hierarchy through small luminance changes, thin borders, and subtle shadows, not heavy glows or dark blocks.
- Purple-pink gradients, dark mode section branches, and glowing elements are prohibited.
- Normal text and controls must meet WCAG AA: 4.5:1 contrast ratio.

## 3. CSS tokens

Reference token contract for the implementation phase:

```css
:root {
  color-scheme: light;
  
  /* Background and surfaces */
  --color-bg: #f7f9fc;
  --color-surface-1: #ffffff;
  --color-surface-2: #f1f5f9;
  --color-surface-3: #e2e8f0;
  
  /* Text */
  --color-text: #0f172a;            /* Dark navy/graphite */
  --color-text-muted: #475569;      /* Slate */
  --color-text-subtle: #64748b;
  
  /* Accent */
  --color-accent: #0891b2;          /* Technical blue/cyan/teal */
  --color-accent-strong: #0e7490;
  --color-on-accent: #ffffff;
  
  /* Borders */
  --color-border: #e2e8f0;          /* Light neutral border */
  --color-border-strong: #cbd5e1;
  
  /* Statuses */
  --color-error: #dc2626;
  --color-success: #16a34a;
  
  /* Typography */
  --font-sans: "Outfit", system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", Consolas, monospace;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.15rem;
  --text-xl: clamp(1.5rem, 3vw, 2.25rem);
  --text-display: clamp(2.5rem, 6vw, 4.5rem);
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  
  /* Constraints */
  --content-readable: 65ch;
  --content-main: 76rem;
  --content-wide: 90rem;
  
  --border-thin: 1px;
  --radius-control: 4px;
  --radius-card: 6px;
  
  /* Shadow - very light and subtle */
  --shadow-raised: 0 4px 20px rgba(15, 23, 42, 0.05);
  
  --z-base: 0;
  --z-sticky: 20;
  --z-nav: 40;
  --z-overlay: 60;
  --z-dialog: 80;
  
  --duration-fast: 120ms;
  --duration-base: 220ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

- Components must use these semantic tokens; do not introduce arbitrary values.
- Shadows are reserved for navigation headers, dialogs, or elevated cards.

## 4. Decorative background

- Implement a single absolute or fixed background layer positioned behind the page content.
- Pointer events must be disabled (`pointer-events: none`) and it must be hidden from screen readers (`aria-hidden="true"`).
- Decorative icons must remain subtle, with a low opacity of approximately 0.035–0.09. A slight blur effect can be applied to background shapes to create depth.
- Decorative elements must be line-art or monochrome SVGs. Approved tech/AI/gaming motifs:
  - Code brackets (`</>`)
  - Terminal windows
  - CPU/microchip lines
  - Neural network nodes
  - Database cylinder shapes
  - Cloud server outlines
  - Game controller contours
  - Keyboard keys
  - Pixel/dot grids
- Keep density restrained: maximum of 6–10 visual motifs on desktop, and significantly reduced or entirely hidden on mobile viewports.
- No continuous looping animations that degrade CPU or scroll performance.
- The background layer must not impact LCP (Largest Contentful Paint) or frame rates.

## 5. Surface & Card rules

- Cards must be white or light gray (#FFFFFF or #F1F5F9).
- Use thin, crisp borders and very soft shadows. Avoid heavy borders, thick border-radius values, and excessive glows.
- Do not place dark cards on a light background. 
- Avoid pill styling on every tag or button; restrict usage to primary buttons and active indicators.
- Organise card content cleanly; project cards should not span excessive vertical heights. Organize the details matrix concisely.

## 6. Typography

- Use Outfit for clean display headings and readable body text.
- Use IBM Plex Mono for technical metadata, stats, tags, labels, and metrics.
- Keep body paragraph line lengths between 60–72 characters for readability.

## 7. Responsive behavior

- Breakpoints: `320px`, `390px`, `768px`, `1024px`, and `1440px`.
- Decorative background motifs must not cause horizontal layout overflow or slow down rendering on mobile.
- Clean single-column stack on mobile viewports (< 768px).

## 8. Visual acceptance criteria

- **AI/Tech Read**: The page must look like a high-end AI/engineering portfolio immediately upon loading.
- **Light & Crisp**: Bright and clean background with high-contrast text meeting WCAG AA requirements.
- **Subtle Background**: The decorative background layer must be felt rather than actively seen, staying secondary to text and content.
- **No Dark Mode Elements**: Revert all dark mode panels, headers, forms, or navigation bars.
