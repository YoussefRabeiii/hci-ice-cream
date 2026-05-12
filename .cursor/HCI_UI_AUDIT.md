# TopGlance — UI audit (usability, accessibility, Shneiderman’s 8 rules)

This document maps visible UI areas to **HCI usability goals**, **WCAG-style accessibility (POUR)**, and **Shneiderman’s eight golden rules**. Use it to answer “why did you do X?” in demos or vivas.

**References (course-level):** Nielsen-style usability dimensions; ISO 9241-11 (effectiveness, efficiency, satisfaction); WCAG 2.x principles (Perceivable, Operable, Understandable, Robust); Ben Shneiderman’s eight golden rules of interface design.

---

## 0. Implementation status (this repo)

These items are **implemented** in [`index.html`](index.html), [`style.css`](style.css), and [`script.js`](script.js):

- Skip link, landmarks (`header role="banner"`, `footer role="contentinfo"`), FAQ section + accordion `aria-labelledby`, accordion `role="region"`.
- Cart/profile: `aria-modal`, focus trap, initial focus, restore focus on dismiss (where appropriate), quantity/remove labels, visible Remove control.
- Checkout: step flow, validation, `aria-invalid` / `aria-describedby`, live `#checkoutAnnounce`, focus trap, Esc/backdrop.
- Contrast tokens (`--heading-teal`, `--link-text`), dark-theme container copy, shop card text, `.container .detail h2` styling.
- Decorative images: `alt=""` + `role="presentation"`; informative images: meaningful `alt`.
- Blog: per-post anchors `#blog-post-1` … `3`, `tabindex="-1"` for programmatic focus, descriptive `aria-label` on “read more”.
- Theme switch, reduced motion, toast `aria-live`.

---

## 1. Element-by-element checklist

| UI area | Element / pattern | Status | Notes |
|--------|-------------------|--------|--------|
| **Global** | `lang="en"`, charset, viewport | Applied | Understandable + robust document defaults. |
| **Global** | Skip link → `#main-content` | Applied | Operable: keyboard users skip repeated chrome. |
| **Header** | `role="banner"` | Applied | Landmark for assistive tech. |
| **Header** | Logo link + alt text | Applied | Perceivable; learnability (brand anchor). |
| **Header** | Primary nav (`#siteNav`) | Applied | Operable landmarks; in-page anchors. |
| **Header** | Theme switch (`role="switch"`, `aria-checked`) | Applied | Universal usability / user control; updates label in JS. |
| **Header** | Cart toggle + `aria-expanded` / `aria-controls` | Applied | Operable state; feedback via badge + toast. |
| **Header** | Cart panel `role="dialog"`, `aria-modal`, focus trap | Applied | Dialog pattern + keyboard containment. |
| **Header** | Profile panel | Applied | Same dialog pattern as cart. |
| **Header** | Mobile menu toggle + `aria-expanded` | Applied | Consistency with desktop nav patterns. |
| **Header** | Decorative icons (`aria-hidden`) | Applied | Screen readers ignore pure decoration. |
| **Home** | Hero `h1`, CTA to `#shop` | Applied | Effectiveness + clear task entry. |
| **About** | Copy + imagery with meaningful `alt` | Applied | Perceivable. |
| **About** | Service cards + decorative thumbnails | Applied | `role="presentation"` on decorative thumbnails. |
| **About / container** | CTAs (`href` targets) | Applied | Real in-page targets (no empty `href`). |
| **Container promo** | `h2` contrast / width | Applied | `var(--heading-teal)` + max-width for readability on photo. |
| **Shop** | Product cards + `button.add-to-cart` | Applied | Operable; safety via demo-only checkout messaging. |
| **Shop** | Product `alt` text | Applied | Perceivable. |
| **Menu** | Recipe row thumbnails | Applied | Decorative → `role="presentation"`. |
| **Features** | Featured items + add to cart | Applied | Consistency with shop. |
| **FAQ** | Section `aria-labelledby` + accordion `region` | Applied | Programmatic grouping + heading association. |
| **FAQ** | Accordion buttons + `aria-expanded` / panel `region` | Applied | Operable + understandable structure. |
| **FAQ** | Help block + `tel:` links | Applied | Utility + effectiveness. |
| **Blog** | “Read more” targets + labels | Applied | `#blog-post-n` + `aria-label` (understandable link purpose). |
| **Client strip** | Logos | Applied | Presentation role + empty alt. |
| **Footer** | `role="contentinfo"` + demo safety copy | Applied | **Safety**: “no real charges”. |
| **Footer** | Social links + `aria-label`, `rel` | Applied | Operable + safe external navigation. |
| **Checkout** | Multi-step UI (ship → pay → review) | Applied | **Memory load** reduction + closure at each step. |
| **Checkout** | `required`, `autocomplete`, labels | Applied | Understandable forms + browser assist. |
| **Checkout** | Validation + inline errors + live region | Applied | `aria-invalid`, `aria-describedby`, `#checkoutAnnounce`. |
| **Checkout** | Focus trap, Esc, backdrop, return focus | Applied | Operable + reversal / user control. |
| **Checkout** | Success pane + order id | Applied | Closure + feedback. |
| **Toast** | `role="status"`, `aria-live="polite"` | Applied | Feedback without blocking workflow. |
| **Motion** | `prefers-reduced-motion` in CSS | Applied | Universal usability. |

---

## 2. Mapping: goals ↔ accessibility ↔ golden rules (short)

### Usability goals (why it matters)

- **Effectiveness:** User can complete browse → cart → guided checkout → confirmation without dead ends (empty cart blocks checkout; FAQ explains flow).
- **Efficiency:** Repeated patterns (cards, add-to-cart, nav), autocomplete on checkout, keyboard shortcuts (Esc).
- **Safety:** Explicit demo disclaimer; review step before “place order”; validation before advancing; no real payment; quantity/remove controls.
- **Utility:** Shop, menu, FAQ, contact, account/cart affordances match a storefront prototype.
- **Learnability:** Clear labels, section headings, accordion copy, step labels on checkout.
- **Memorability:** Persistent cart (`localStorage`), theme preference, stable nav anchors.
- **Satisfaction:** Visual hierarchy, theme toggle, motion preferences respected.

### WCAG POUR (how the UI supports it)

- **Perceivable:** Text alternatives on informative images; decorative images marked; focus outlines; improved text contrast (CSS tokens + section-specific rules).
- **Operable:** Keyboard reachability, focus order, focus trap in dialogs, Esc to dismiss, skip link, minimum touch targets on key controls.
- **Understandable:** Language set, consistent labels, error text tied to fields (`aria-describedby`), meaningful control names (`aria-label` on icon-only controls).
- **Robust:** Valid semantic HTML, ARIA used to reinforce—not replace—native controls.

### Shneiderman’s eight golden rules (talk track)

1. **Consistency:** Same card/button language across Shop and Featured.
2. **Universal usability:** Dark/light theme, reduced motion, larger tap targets on small screens.
3. **Shortcuts:** `Esc` closes overlays; theme persists.
4. **Informative feedback:** Toast, cart badge, checkout progress, inline errors, success screen.
5. **Closure:** Checkout steps end with clear “Thank you” + order id.
6. **Error prevention:** Cannot open checkout with empty cart; radio toggles saved vs new card; HTML `required` + JS validation.
7. **Reversal:** Back in checkout, Esc, quantity down/remove, close controls.
8. **Reduced memory load:** Visible steps + review pane summarizing ship/pay/lines.

---

## 3. Risk ranking (what graders might probe)

### Must-fix (implemented)

- Broken or ambiguous links (`href=""`, meaningless `#`) → **operable / predictable**.
- Decorative images with empty `alt` but no presentation role → **perceivable clarity**.
- Checkout errors tied to fields + live announcement → **understandable for AT users**.
- Cart line +/- labels with product context → **operable detail**.
- Cart/profile dialogs: focus trap + initial focus → **operable / WCAG dialog pattern**.
- `getFocusableElements` visibility check (fixed-position panels) → traps work on narrow viewports.

### Should-fix (implemented)

- Teal-on-white and dark-theme body text contrast → **perceivable (contrast)**.
- Cart “Remove” visible text + class → **perceivable + operable clarity**.

### Explain-only (design tradeoffs you can defend)

- Lorem placeholder copy: acceptable for HCI layout demo; argue real content would support **learnability** further.
- Single-page marketing template: argue **consistency** and **efficiency** of one scroll narrative.
- “Demo” saved card: argue **safety** vs realism for coursework.

---

## 4. One-line “because” answers (examples)

- **Why skip link?** → Operable: bypass fixed header/nav for keyboard and screen-reader users.
- **Why three checkout steps?** → Reduces memory load and supports closure after each subtask.
- **Why review screen?** → Safety: confirm ship/pay/cart before irreversible-ish “order” in the demo narrative.
- **Why toast + badge?** → Informative feedback for frequent actions without modal overload.
- **Why `aria-live` on checkout announcements?** → Errors are visible *and* announced when validation fails.
- **Why `role="region"` on FAQ accordion?** → Understandable: groups related controls under the section heading.

---

*Document aligned with the current `index.html`, `style.css`, and `script.js` in this repository.*
