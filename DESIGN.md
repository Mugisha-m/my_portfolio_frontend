---
name: Engineered Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002109'
  on-tertiary-container: '#009844'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: metropolis
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: metropolis
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: metropolis
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: metropolis
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: metropolis
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: metropolis
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
---

## Brand & Style
The brand personality is rooted in high-performance engineering, technical reliability, and architectural clarity. Inspired by the utility-first aesthetic of industry leaders like Vercel and Linear, the design system avoids decorative fluff in favor of intentionality and craftsmanship.

The target audience consists of technical recruiters, engineering managers, and potential collaborators who value clarity and detail. The visual style is **Corporate Modern with a Minimalist focus**, utilizing high-contrast typography, generous whitespace, and a structural layout to evoke a sense of professional competence and systematic thinking.

## Colors
The palette is built on a foundation of deep professional blues and stark whites. 

- **Primary Dark Blue (#0F172A):** Reserved for high-importance structural elements like navigation bars, footers, and code-block headers.
- **Secondary Blue (#1E3A8A):** Used for primary actions and focused highlights.
- **Accent Green (#22C55E):** Serves as a "system status" indicator for availability, project completion, and success states.
- **Backgrounds:** A clean split between pure white for main content surfaces and light gray (#F8FAFC) for sectional contrast.
- **Typography:** Deep charcoal (#111827) ensures maximum readability, while slate (#475569) provides hierarchy for metadata and captions.

## Typography
While the user requested Poppins, this design system utilizes **Metropolis** to better align with the precise, geometric look of high-end SaaS tools (Stripe/Linear). It offers a similar geometric structure but with more sophisticated terminal treatments.

**JetBrains Mono** is introduced for labels and technical metadata (tags, dates, tech stacks) to lean into the software engineer persona. 

- **Hierarchy:** Use bold weights for displays and semi-bold for headlines. 
- **Readability:** Body text uses a generous 1.6 line-height to ensure long-form project descriptions are comfortable to read.
- **Scale:** Large display text should shift to mobile-specific sizes to prevent awkward wrapping on small devices.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop screens, centering content within a 1200px container to maintain readability on wide monitors.

- **Grid:** Use a 12-column grid for desktop. Project cards should typically span 4 columns (3-up) or 6 columns (2-up).
- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm.
- **Sectioning:** Large vertical gaps (120px) are used between major sections (Work, About, Contact) to provide visual breathing room.
- **Mobile:** Transition to a single-column layout with 16px side margins.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Ambient Shadows**. This design system avoids heavy gradients, relying instead on high-quality shadow definition.

- **Levels:** 
  - **Level 0 (Base):** White or #F8FAFC.
  - **Level 1 (Cards):** White surface with a very subtle 1px border (#E2E8F0) and an ambient shadow: `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`.
  - **Level 2 (Hover/Modals):** Increased shadow depth to simulate physical lift: `0 10px 15px -3px rgb(0 0 0 / 0.1)`.
- **Interactions:** Use a subtle "lift" effect (moving element -2px on Y-axis) when hovering over interactive cards or buttons.

## Shapes
The shape language is refined and approachable. 

- **Primary Radius:** Set at 16px for cards and major containers to create a modern, "friendly software" feel.
- **Interactive Radius:** Buttons and input fields use a slightly tighter 12px radius to differentiate them from static containers.
- **Consistency:** All borders should be 1px wide. Use #E2E8F0 for light borders on white backgrounds.

## Components
- **Buttons:**
  - *Primary:* Solid #1E3A8A background, white text. 12px radius. Large horizontal padding (24px).
  - *Secondary:* White background with 1px #E2E8F0 border.
- **Cards:** White background, 16px radius, subtle border. Use for projects and blog posts. Headers inside cards should use `headline-sm`.
- **Chips/Tags:** Using `label-sm` typography. Light gray background (#F1F5F9) with Slate (#475569) text. No borders.
- **Inputs:** 12px radius, #F8FAFC background. On focus, transition border to #1E3A8A with a subtle blue outer glow.
- **Status Indicator:** A small 8px circle of #22C55E next to "Available for work" text. Use a pulse animation for high-visibility engagement.
- **Navigation:** Sticky top bar with a background blur (Glassmorphism effect: `backdrop-filter: blur(8px)`) and a subtle bottom border.