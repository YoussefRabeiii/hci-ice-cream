# TopGlance — UI rules, goals, and how we implemented them

This page documents the **HCI and accessibility rules** we agreed to follow for the TopGlance storefront demo, **what we wanted the site to achieve**, and **where those choices appear** in [`index.html`](index.html), [`style.css`](style.css), and [`script.js`](script.js). For a compact checklist mapped to UI regions, see [`HCI_UI_AUDIT.md`](HCI_UI_AUDIT.md).

---

## 1. Rules and frameworks (what “good UI” meant for this project)

### 1.1 Usability goals (Nielsen-style / ISO 9241-11)

We treated the page as something a real user should be able to use with **low friction** and **clear outcomes**:

| Goal | Rule in plain language |
|------|-------------------------|
| **Effectiveness** | Users can browse, add to cart, open checkout, fix errors, and reach a clear “order placed” outcome without dead ends. |
| **Efficiency** | Repeated patterns (cards, CTAs, nav anchors), autocomplete on checkout fields, keyboard shortcuts where safe (e.g. Esc). |
| **Safety** | Demo-only messaging, review before confirm, validation before advancing, no implication of real payment. |
| **Utility** | Sections match a real ice-cream shop narrative: hero, about, promo, shop, menu, features, FAQ, blog, footer, account/cart. |
| **Learnability** | Obvious labels, section headings, checkout steps, FAQ accordion structure. |
| **Memorability** | Cart and theme preferences persisted (`localStorage`), stable in-page anchors. |
| **Satisfaction** | Coherent visual hierarchy, light/dark theme, motion preferences respected. |

### 1.2 Accessibility — WCAG 2.x **POUR**

| Principle | What we aimed for on this site |
|-----------|--------------------------------|
| **Perceivable** | Sufficient text/background contrast (light and dark), meaningful text alternatives where images carry meaning, decorative images not announced as content, visible focus. |
| **Operable** | Everything important reachable by keyboard; skip link; dialogs trap focus; Esc and backdrop dismiss where appropriate; touch targets sized reasonably on small screens. |
| **Understandable** | `lang="en"`, consistent naming, form labels, errors tied to fields (`aria-describedby`, `aria-invalid`), live announcements for checkout feedback. |
| **Robust** | Valid semantic HTML; ARIA used to **reinforce** native controls (e.g. `role="switch"` on theme toggle), not to replace buttons/links. |

### 1.3 Shneiderman’s eight golden rules (design rules we explicitly checked)

1. **Strive for consistency** — Same card and “add to cart” language in Shop and Features; shared button and panel patterns in the header.
2. **Enable frequent users to use shortcuts** — Esc closes overlays; theme choice persists; in-page anchors for deep links.
3. **Offer informative feedback** — Cart badge and toast; checkout progress; inline validation; `#checkoutAnnounce` live region.
4. **Design dialogs to yield closure** — Multi-step checkout ends with a thank-you / order id pane.
5. **Prevent errors** — Cannot start checkout with an empty cart; HTML `required` plus script validation; review step before place order.
6. **Permit easy reversal of actions** — Back within checkout; quantity down / remove line; close controls; focus return after dismiss where implemented.
7. **Support internal locus of control** — User chooses theme; user controls cart; no surprise navigation; demo disclaimers in footer and copy where relevant.
8. **Reduce short-term memory load** — Visible checkout steps; review summary of shipping, payment choice, and lines.

### 1.4 Interaction and visual quality rules (project-specific)

- **Contrast in both themes** — No “white on mint” hero badge; no white body copy on pastel feature cards; teal-on-white UI chrome uses darker teal tokens.
- **Predictable motion** — Shared easing (`--ease-ui`) and duration tokens; avoid `transition: all` on everything; respect `prefers-reduced-motion` (rules placed so they are not overridden by global transitions).
- **Layout stability** — Blog cards use a flex column layout with consistent card height behavior and a pinned “read more” at the bottom of the card content area.
- **Promo / photo sections** — Copy that sits on a **light** shape (e.g. container promo asset) keeps **dark-on-light** tokens in **both** themes so dark mode does not flip to illegible light-on-white.

---

## 2. Site goals for TopGlance (what this webpage should do)

1. **Tell the brand story** in one scroll: hero → about → promo → shop → menu → features → FAQ → blog → clients → footer.
2. **Support a credible demo purchase flow**: browse → cart → checkout (ship → pay → review → success) without implying real charges.
3. **Work for keyboard and assistive technology** as far as a static marketing + JS demo reasonably can: landmarks, dialogs, accordion, forms.
4. **Stay readable** in **light** and **dark** theme, including hero, glass-style shop cards, FAQ overlay, footer, and panels.
5. **Feel polished** without flashy or buggy hover states (no focus/hover border “flicker” from transitioning layout-affecting properties blindly).

---

## 3. How we implemented those rules (by area)

### 3.1 Global document and navigation

| Goal / rule | Implementation |
|-------------|----------------|
| Operable: skip repeated chrome | Skip link to `#main-content` (`.skip-link` in HTML/CSS). |
| Landmarks | `header role="banner"`, `footer role="contentinfo"`, `nav` with `aria-label="Primary"`. |
| Theme (universal usability) | `html[data-theme="dark"]` set from JS; inline boot script avoids flash of wrong theme; toggle is `role="switch"` with `aria-checked` and label updates in `script.js`. |
| Focus visible | `:focus-visible` styles on links, buttons, inputs, accordion headers. |

### 3.2 Header: cart, profile, mobile menu

| Goal / rule | Implementation |
|-------------|----------------|
| Informative feedback | Cart badge, toast (`role="status"`, `aria-live="polite"`). |
| Operable dialogs | Cart and profile: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, close buttons with `aria-label`. |
| Focus management | `getFocusableElements` filters hidden/disabled nodes; focus moves into panel on open; Tab trap; Esc and backdrop close; restore focus via `closeNavPanels` / checkout patterns in `script.js`. |
| Understandable controls | Icon-only triggers have `aria-label`; `aria-expanded` / `aria-controls` on cart, profile, and mobile menu button. |
| Perceivable | Decorative Boxicons use `aria-hidden="true"`; contrast tweaks for cart empty text, meta lines, qty buttons, saved-card label, nav icon **hover** (dark icon on light mint hover). |

### 3.3 Hero (home)

| Goal / rule | Implementation |
|-------------|----------------|
| Perceivable contrast | `:root` tokens `--hero-bg`, `--hero-badge-bg`, `--hero-badge-text`; hero uses a **dark enough** background for white headings; badge uses **dark text on light fill** (fixes the old white-on-mint badge). |
| Learnability | Single clear `h1`, supporting paragraph, CTA toward `#shop`. |
| Dark theme | `html[data-theme="dark"] .home` block adjusts hero background, badge, headings, paragraph, and button colors while keeping hierarchy. |

### 3.4 About, container promo, shop, menu

| Goal / rule | Implementation |
|-------------|----------------|
| Perceivable | About body copy and service cards use stronger slate grays; section titles use `--heading-teal` instead of mid-teal on light surfaces. |
| Container promo on photo | `--text-on-light`, `--title-on-light` for copy on the white shape; dark theme keeps **dark-on-light** for that block; optional image filter under `html[data-theme="dark"] .container > img` so the asset still reads. |
| Shop cards | Light text on blurred/glass cards tuned for the busy background; dark theme overrides in CSS blocks for `.shop`. |
| Menu recipes | Recipe body text uses `#475569` on `#f9f9f9`; dark theme recipe panels use slate surfaces and adjusted heading/body colors. |

### 3.5 Features (three colored cards)

| Goal / rule | Implementation |
|-------------|----------------|
| Perceivable | **Pastel** cards (`.two`, `.three`) no longer force **white** text on light fills; they use `--text-on-light` and `--title-on-light`. The pink card (`.one`) keeps light-on-dark for contrast. |
| Dark theme | `html[data-theme="dark"] .features .box-container .one h3` only forces a light heading on the pink card so we do not undo the pastel-card fix. |

### 3.6 FAQ and accordion

| Goal / rule | Implementation |
|-------------|----------------|
| Understandable structure | Section `aria-labelledby="faqSectionHeading"`; accordion wrapper `role="region"` tied to that heading. |
| Operable | Each question is a **button** with `aria-expanded`, `aria-controls`; answer panels are `role="region"` with `aria-labelledby` matching the trigger id; `aria-hidden` toggled with open state in JS. |
| Perceivable | FAQ overlay icon and span/heading colors adjusted for contrast on the image; dark theme adds matching overrides for span and icon on the darker scrim. |
| Accordion body (light) | Panel copy color moved from `gray` to `#475569` on `#f9f9f9`; dark theme answer text brightened to `#cbd5e1` on `#1e293b`. |

### 3.7 Blog and client strip

| Goal / rule | Implementation |
|-------------|----------------|
| Operable deep links | Post anchors `#blog-post-1` … `3`, `tabindex="-1"` for programmatic focus, descriptive `aria-label` on “read more” links. |
| Efficiency / layout | Equal-height card grid, flex column in cards, `margin-top: auto` on read more, sensible gaps (CSS). |
| Decorative logos | `alt=""` and `role="presentation"` where appropriate. |

### 3.8 Footer

| Goal / rule | Implementation |
|-------------|----------------|
| Safety | Demo disclaimer copy (no real charges). |
| Operable | Social links with `aria-label` and sensible `rel` on external links. |
| Perceivable | Footer grid text color strengthened (`#475569` in light theme); dark theme rules adjust headings, links, and paragraphs for readable contrast. |

### 3.9 Checkout modal

| Goal / rule | Implementation |
|-------------|----------------|
| Reduced memory load | Three visible steps + review + success pane. |
| Error prevention / informative feedback | `required`, `autocomplete`, validation before step advance; `aria-invalid`, `aria-describedby` on fields; messages mirrored to `#checkoutAnnounce` for screen readers. |
| Operable | Focus trap on the dialog surface, Esc and backdrop close, return focus after close; stronger heading/close/progress text colors in light theme (`--heading-teal`, `#64748b`). |
| Reversal | Back button between steps; user can close without completing. |

### 3.10 Motion, transitions, and reduced motion

| Goal / rule | Implementation |
|-------------|----------------|
| Consistency | `--ease-ui`, `--t-fast`, `--t-normal`, `--t-slow`, `--t-reveal` used across components. |
| No hover “flicker” | Global transitions list explicit properties (not `all`); default **transparent** borders on elements that gain a border on hover/focus (e.g. footer social icons, header icon buttons) so layout does not jump. |
| Universal usability | `@media (prefers-reduced-motion: reduce)` at the **end** of `style.css` so reduced-motion timings win over the global `*` transition rules. |

---

## 4. Quick file map

| File | Main contributions |
|------|---------------------|
| [`index.html`](index.html) | Landmarks, skip link, FAQ/blog/checkout markup, ARIA on header panels and theme switch, live region ids, semantic sections. |
| [`style.css`](style.css) | Contrast tokens, hero and theme blocks, features/blog/footer/accordion/shop/menu/checkout/header tweaks, motion tokens, reduced-motion ordering. |
| [`script.js`](script.js) | Theme persistence, cart persistence, accordion state, focus traps, checkout validation and announcements, toast behavior. |

---

## 5. How to talk about this in a demo or viva (one sentence)

We aligned TopGlance with **usability goals**, **WCAG POUR**, and **Shneiderman’s eight rules**, then implemented them through **semantic HTML**, **ARIA where it helps**, **keyboard-safe dialogs**, **checkout feedback and validation**, and **CSS tokens plus section rules** so contrast and motion stay acceptable in **both light and dark theme**.

---

*This document is meant to sit beside [`HCI_UI_AUDIT.md`](HCI_UI_AUDIT.md): that file is the audit checklist; this file is the “rules + goals + implementation story” for the same site.*
