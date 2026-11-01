# Storage4666 — redesign concept (unofficial)

Bilingual (FR default / EN) redesign demo for [Storage4666](https://storage4666.ca/), prepared by Amir, [SitePilot](https://sitepilotdesign.ca/).
**Unofficial concept: not approved by or affiliated with Storage4666. Nothing is sent, stored or tracked.**

> Key finding: Storage4666 is a **seasonal tire-storage** service (Montréal / Laval / Terrebonne), not a self-storage-unit business. The concept is built around that reality: plans, a rule-based "help me choose" guide, and a four-step inquiry.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ at http://localhost:4173
npm test           # vitest (26 tests)
npm run typecheck
```

The build uses a relative base (`./`), so `dist/` works from a GitHub Pages subdirectory. There is no router.

## Design direction (proposal)

- **Concept:** a warehouse ledger — warm paper, ink, tire-tag orange. Fine rules instead of card grids; one dark section for the decision aid.
- **Colour:** brand orange `#E8792F` (from the current site) is the single action colour with ink text (6:1); `#9A3F07` for orange text on paper. Tokens in `src/styles/tokens.css`.
- **Type:** Bricolage Grotesque Variable (display, self-hosted) + system UI stack for body.
- **Imagery:** the site's photos were not reused; the hero is a hand-drawn rack illustration, captioned as an illustration.
- **Motion:** spring easing via CSS `linear()` (critically damped; a small bounce only for the sheet); 90 ms press feedback; opacity/transform only; staged hero entrance and 60 ms-staggered reveals; dialog is a bottom sheet on phones with the same path in and out. Off under `prefers-reduced-motion`; content stays visible if JS fails.
- **Materials:** glass header and mobile menu (`backdrop-filter`, bright top edge, hairline that appears on scroll); blurred scrim behind the dialog. Solid fallbacks for no blur support, `prefers-reduced-transparency` and `prefers-contrast: more`.
- **Dark mode:** follows the system setting (`prefers-color-scheme`), with matching `theme-color` meta.
- **Mobile-native:** hover styles gated to hover-capable pointers, no tap-highlight flash, `touch-action: manipulation`, `viewport-fit=cover` with safe-area padding, 16 px inputs.

## Structure

```
src/config/      business.ts (typed facts: verified / illustrative / pending), demo.ts
src/i18n/        fr.ts (source of keys), en.ts (typed to match), provider
src/inquiry/     reducer, validation, local dates, dialog + steps (in-memory only)
src/guide/       rule-based recommendation on published limits
src/sections/    page sections; src/components/ shared UI; src/styles/ tokens + CSS
tests/           reducer/validation/dates, guide rules, i18n parity, end-to-end flow (RTL)
docs/            sources-and-confirmations.md, verification.md, screenshots/
```

Real submission is deliberately **not implemented** — there is no fetch/XHR/beacon code path. Draft answers live in React state only; only the language preference is stored (`localStorage`).

See [docs/sources-and-confirmations.md](docs/sources-and-confirmations.md) and [docs/verification.md](docs/verification.md).
