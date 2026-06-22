# AI portfolio design system

## 1. Design direction

**Design read:** personal portfolio for technical recruiters and engineering peers, expressed as a credible technical editorial workspace in native HTML/CSS/JavaScript.

- Direction: technical editorial meets an AI engineering workspace.
- Character: professional, precise and layered; evidence and project context lead the composition.
- Avoid the appearance of a fake dashboard, generic SaaS landing page or neon AI demo.
- Use editorial hierarchy, restrained technical metadata and asymmetric project storytelling.
- Design dials: `DESIGN_VARIANCE 6`, `MOTION_INTENSITY 3`, `VISUAL_DENSITY 4`.
- Preserve the current static stack and Bootstrap grid only where it remains useful; add no framework or effect-only dependency.

## 2. Fixed dark theme

- Use one fixed dark theme across every section; do not react to system theme and do not expose a toggle.
- Base is graphite with a cool navy tint, never absolute `#000000`.
- One accent family only: muted teal/cyan. Accent communicates link, focus, selection and primary action.
- Surfaces gain hierarchy through small luminance changes, borders and spacing, not heavy glow.
- Purple-pink gradients, rainbow accents and luminous outer glows are prohibited.
- Normal text and controls must meet WCAG AA: 4.5:1 for normal text and 3:1 for large text/UI boundaries.

## 3. CSS tokens

Reference token contract for the implementation phase:

```css
:root {
  color-scheme: dark;
  --color-bg: #0b1117;
  --color-surface-1: #111a22;
  --color-surface-2: #17232d;
  --color-surface-3: #1d2b35;
  --color-text: #e8f0f2;
  --color-text-muted: #a9b7bd;
  --color-text-subtle: #82939a;
  --color-accent: #63bdb8;
  --color-accent-strong: #79d0ca;
  --color-on-accent: #071315;
  --color-border: #2b3a44;
  --color-border-strong: #40545f;
  --color-error: #ff9b95;
  --color-success: #79c9a5;
  --font-sans: "Outfit", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: clamp(1.75rem, 3vw, 2.5rem);
  --text-display: clamp(2.75rem, 7vw, 6.5rem);
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;
  --content-readable: 65ch;
  --content-main: 76rem;
  --content-wide: 90rem;
  --border-thin: 1px;
  --radius-control: 0.5rem;
  --radius-card: 0.875rem;
  --shadow-raised: 0 18px 48px rgb(2 12 18 / 0.28);
  --z-base: 0;
  --z-sticky: 20;
  --z-nav: 40;
  --z-overlay: 60;
  --z-dialog: 80;
  --duration-fast: 120ms;
  --duration-base: 220ms;
  --duration-slow: 420ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}
```

- Use semantic tokens in components; do not introduce isolated hex values.
- Radius rule: controls use `--radius-control`, content cards use `--radius-card`; tags are not automatically pill-shaped.
- Shadows are reserved for sticky navigation, dialogs or genuinely raised content.

## 4. Typography

- Use Outfit for heading and body to preserve the verified existing font and avoid an unnecessary dependency.
- Space Grotesk is an approved alternative only if a later typography test justifies replacing Outfit globally.
- Use IBM Plex Mono, then the defined monospace fallback, for metadata, labels, repository facts and verified metrics.
- Display: 600-700 weight, tight tracking around `-0.03em`, line-height `0.95-1.05`, maximum two lines in the hero.
- Section heading: 600 weight, line-height `1.1`; body: 400-500 weight, line-height `1.6-1.75`.
- Metadata: 500 weight, 12-14px, modest `0.04em` tracking; do not uppercase every label.
- Body paragraphs stop at `65ch`; compact supporting copy should stay near `45-55ch`.
- Use sentence case. Hierarchy comes from size, weight, spacing and placement rather than decorative labels.

## 5. Layout

- Mobile-first base is a strict single column with 16-20px inline gutters.
- Containers: readable copy `65ch`, main composition `76rem`, wide project canvas `90rem`.
- Desktop uses a 12-column grid with deliberate empty columns and offset alignment.
- Project layout is editorial and asymmetric: featured work may span 7/5 or 8/4; supporting work can alternate index, evidence and visual position.
- Do not repeat one three-column card grid. Use one featured composition, grouped project rows and an archive/list treatment.
- `390px`: compact phones; preserve one column and 44px targets, reduce display scale rather than clipping.
- `768px`: introduce two-column relationships and horizontal filter overflow where necessary.
- `1024px`: enable 12-column editorial composition, full navigation and offset project layouts.
- `1440px`: stop container growth at `--content-wide`; add negative space, not wider paragraphs.

## 6. Component specifications

### Navigation

- Single-line desktop bar, 64-72px tall; name/role at start, concise anchors and contact action at end.
- Sticky state uses opaque `surface-1`, a bottom border and no broad blur/glow.
- Active section uses accent text plus a structural cue such as a short underline; mobile menu must retain focus order.

### Hero

- Left-aligned, asymmetric 7/5 composition; one identity statement, concise role description and at most two actions.
- Keep headline to two lines, supporting copy to 20 words where feasible and actions visible in the initial viewport.
- The secondary column shows verified profile/project context, not fake terminal output, fabricated activity or weather.

### Project card

- Treat as an editorial case-study preview, not a generic icon card.
- Required order: category/status, title, verified summary, stack/evidence and repository action.
- Featured cards may span multiple columns; supporting cards use sparse dividers and variable proportions.
- Show only verified metrics with source context. Prototype/mock status must remain explicit.

### Project filter

- Use text tabs or compact segmented controls for `Featured AI/ML`, `Applied software`, `DevOps/Labs` and archive.
- Default selection and result count must be truthful; active state cannot rely on color alone.
- On mobile, wrap intentionally or use labelled horizontal scroll with visible focus states.

### Expertise block

- Group capabilities by practice and evidence: ML/NLP, applied engineering and delivery/tooling.
- Replace arbitrary skill percentages with technologies, methods and linked project proof.
- Prefer an editorial matrix or grouped definition list over repeated equal cards.

### About

- Pair a concise narrative with factual education/location/contact metadata.
- Use an offset two-column composition at desktop and one column below 768px.
- Avoid invented availability, years of experience, client counts or personal claims.

### Contact form

- Labels stay above inputs; placeholders never replace labels. Helper/error text sits below the field.
- Controls are at least 44px high with surface, border, hover, focus, invalid, submitting, success and network-error states.
- Explain EmailJS/network limitations plainly; do not imply guaranteed delivery.

### Footer

- Compact closing region with identity, primary contact, verified social/repository links and navigation back to top.
- Use one separator and restrained mono metadata; no multi-column link farm, status fiction or version decoration.

## 7. Interaction and accessibility

- Every interactive element needs `:focus-visible` with a 3px accent outline and at least 2px offset.
- Hover may change border, text or surface and translate by at most 2px; pressed uses `translateY(1px)` or `scale(0.98)`.
- Animate only `transform` and `opacity`; use the token durations/easing and justify motion by feedback or hierarchy.
- Under `prefers-reduced-motion: reduce`, remove automatic/reveal motion and make scrolling immediate.
- Minimum touch target is 44 by 44 CSS pixels with sufficient separation.
- Do not communicate active, error or success state by color alone; pair color with text, icon or shape.
- Preserve skip link, semantic landmarks, keyboard navigation and logical focus flow.

## 8. Anti-patterns

- No pervasive glassmorphism, blur panels, neon glow or decorative noise that reduces readability.
- No repeated rows of three equal cards and no dashboard-like metric tiles without real data.
- No arbitrary skill percentages, invented metrics or unsupported project states.
- No pill treatment on every label, tag, button and filter.
- No animation of `top`, `left`, `width` or `height`; no perpetual motion without a functional reason.
- No light/dark toggle, system-theme branch or isolated light section.
- No purple-pink gradient, fake terminal, generic AI mesh, emoji-led icon system or fabricated screenshots.

## 9. Definition of visual consistency

The interface is visually consistent when every section uses the same semantic color tokens, one teal accent, one type pairing, the documented radius roles, spacing scale and z-index layers. Repeated component roles must share typography, alignment and interaction states; variation comes from editorial composition, not new styling rules. All normal text and controls pass WCAG AA, paragraphs respect line-length limits, mobile layouts collapse deliberately at the defined breakpoints, and no unverified content is introduced to create visual balance.

