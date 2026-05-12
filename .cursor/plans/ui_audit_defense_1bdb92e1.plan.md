---
name: UI Audit Defense
overview: Audit the TopGlance UI against HCI usability goals, WCAG accessibility principles, and Shneiderman's 8 golden rules, then prepare clear justifications for viva questions like “why did you do this?”.
todos:
  - id: audit-elements
    content: Create an element-by-element checklist for all visible UI areas.
    status: completed
  - id: map-rules
    content: Map each element to usability goals, accessibility principles, and Golden Rule of 8.
    status: completed
  - id: prioritize-fixes
    content: "Rank the issues by marking risk: must-fix, should-fix, and explain-only."
    status: completed
  - id: implement-if-approved
    content: After approval, apply focused UI/accessibility fixes in the HTML, CSS, and JS.
    status: completed
isProject: false
---

# UI Audit Defense Plan

## Standards To Use

- Usability goals: effectiveness, efficiency, safety, utility, learnability, memorability, plus satisfaction.
- Accessibility: WCAG POUR principles: perceivable, operable, understandable, robust.
- Golden Rule of 8: Shneiderman's rules: consistency, universal usability, shortcuts, feedback, closure, error prevention, reversal, user control, and reduced memory load.

## Current UI Evidence

- Main UI is in [index.html](index.html), with styling in [style.css](style.css) and interactions in [script.js](script.js).
- Strong existing evidence to defend:
  - Skip link, page language, semantic `main`, sections, buttons, labels, ARIA dialogs, accordions, live toast, keyboard focus styles.
  - Cart and checkout support safety: empty-cart prevention, demo payment warning, validation before next step, review step before placing order, Back/Esc/Close, and success confirmation.
  - Checkout also supports memorability and reduced memory load through a visible 3-step flow: Shipping, Payment, Review.

## Audit Pass

- Review each UI area: header/nav, theme switch, cart panel, profile panel, hero/about/service cards, shop products, menu, FAQ accordion, blog cards, partner logos, footer, checkout modal, toast.
- For each area, mark:
  - Applied: what rule/goal it satisfies.
  - Partially applied: what is good but needs one small improvement.
  - Not applied/risk: what could cost marks, especially safety/accessibility.
- Prioritize risks likely to be questioned:
  - Low color contrast such as teal text on white and some dark-theme section text in [style.css](style.css).
  - Empty or placeholder links such as `href=""` and `href="#"` in [index.html](index.html).
  - Some decorative images have empty `alt`, but not all also include `role="presentation"`.
  - Cart/profile panels use dialog roles but do not have full dialog focus management like checkout.
  - Checkout validation messages are visual, but not connected with `aria-describedby` or announced with `aria-live`.
  - Quantity button labels should include product names for stronger accessibility.

## Defense Notes To Prepare

- Safety: explain that checkout is mock/demo, payment is not processed, users can review before placing order, errors are prevented before moving forward, and actions can be reversed with Back/Esc/cart quantity controls.
- Accessibility: explain semantic HTML, labels, alt text, focus-visible styles, keyboard-accessible buttons, reduced motion support, and ARIA state updates.
- Golden rules: map consistency to repeated card/button patterns, feedback to toast/progress/errors, closure to success state, error prevention to validation, reversal to Back/Esc/remove controls, and memory-load reduction to step-based checkout.

## If Implementation Is Approved

- Fix high-impact accessibility issues first: contrast, links, validation announcement, dialog focus behavior, and clearer ARIA labels.
- Keep the visual design mostly unchanged so the HCI rationale remains easy to explain.
