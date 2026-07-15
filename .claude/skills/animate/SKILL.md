---
name: animate
description: Implements micro-transitions with a fixed easing and duration system — cubic-bezier presets, 150/250/400ms duration scale, enter/exit patterns, and reduced-motion support. Use when adding any CSS/JS transition or animation to UI elements: hovers, dropdowns, modals, toasts, list changes.
---

# Animate

Every transition uses a token from the duration and easing systems below. No ad-hoc `0.3s ease` — pick from the system.

## Duration scale

```css
:root {
  --duration-fast: 150ms;  /* hovers, color/opacity shifts, small controls */
  --duration-base: 250ms;  /* dropdowns, tooltips, toggles, accordions */
  --duration-slow: 400ms;  /* modals, drawers, page-level, large surfaces */
}
```

Rules:
- Bigger distance / bigger surface = longer duration. A button hover is fast; a full-screen drawer is slow.
- Exits run at ~70–80% of enter duration (dismissals should feel immediate): modal in 400ms, out 300ms.
- Nothing UI-blocking over 500ms. If it's longer, it's choreography, not a transition — see design-motion.

## Easing presets

```css
:root {
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);    /* enters, user-initiated changes */
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);    /* exits only */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* moves within view */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* playful overshoot — small elements only */
}
```

- Default to `--ease-out`. Elements should arrive fast and settle — it makes UI feel responsive.
- `--ease-in` only for things leaving the screen. Never for enters (feels sluggish).
- `--ease-spring` overshoots: fine for checkmarks, toggles, badges; never for large panels or text blocks.
- Linear only for opacity-only fades and continuous spinners.

## What to animate

Animate cheap properties: `transform` and `opacity` (compositor-only, 60fps). Avoid animating `width`, `height`, `top/left`, `margin`, `box-shadow` (paint/layout cost). For shadow transitions, crossfade a pseudo-element's opacity. For height, prefer `grid-template-rows: 0fr → 1fr` or measure and animate `max-height` as a last resort.

## Enter/exit patterns

```css
/* Dropdown / popover: scale from trigger */
.popover {
  transform-origin: top left;
  transition: transform var(--duration-base) var(--ease-out),
              opacity var(--duration-fast) linear;
}
.popover[data-closed] { transform: scale(0.96) translateY(-4px); opacity: 0; }

/* Modal: fade + subtle rise; backdrop fades separately */
.modal { transition: transform var(--duration-slow) var(--ease-out),
                     opacity 300ms linear; }
.modal[data-closed] { transform: translateY(12px) scale(0.98); opacity: 0; }
.backdrop { transition: opacity 300ms linear; }

/* Toast: slide from edge */
.toast { transition: transform var(--duration-base) var(--ease-out),
                     opacity var(--duration-fast) linear; }
.toast[data-closed] { transform: translateX(16px); opacity: 0; }
```

Pattern rules:
- Pair a transform with an opacity fade; opacity alone is lifeless, transform alone pops in harshly.
- Keep transform distances small: 4–16px slide, scale 0.95–0.98 → 1. Big slides feel cartoonish.
- Popovers scale from their trigger (`transform-origin` at the anchor side), not from center.

## Exit before removal (JS)

DOM nodes removed instantly can't animate out. Wait for the transition:

```js
function dismiss(el) {
  el.dataset.closed = "";
  el.addEventListener("transitionend", () => el.remove(), { once: true });
  setTimeout(() => el.remove(), 500); // safety net if transition never fires
}
```

With React, use presence helpers (Framer Motion `AnimatePresence`, or `@starting-style` + `transition-behavior: allow-discrete` for pure CSS in modern browsers).

## Reduced motion (required)

Every animated interface must respect `prefers-reduced-motion`. Reduce means remove movement, not remove feedback — keep opacity fades.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Optionally keep gentle fades: */
  .modal, .toast, .popover { transition: opacity 150ms linear !important; }
}
```

## Checklist

- Every duration and easing is a token, not a literal.
- Enters use ease-out; exits use ease-in and are shorter.
- Only transform/opacity animated (or a justified exception).
- Removal waits for exit transitions.
- Reduced-motion media query present and tested.
- Nothing loops forever except loading indicators.
