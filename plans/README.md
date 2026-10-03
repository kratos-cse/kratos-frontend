# Animation improvement plans (product-first)

Stamped at repo commit **170e77b** when plans were written.

| # | Slug | Severity | Status |
|---|------|----------|--------|
| 001 | events-grid-inview-stagger | HIGH | DONE (implemented) |
| 002 | register-step-transition | HIGH | DONE (implemented) |
| 003 | event-card-touch-press | MEDIUM | DONE (implemented) |
| 004 | event-detail-back-press | MEDIUM | DONE (implemented) |
| 005 | motion-tokens-consolidation | LOW | DONE (implemented) |

## Execution order

1. **005** (tokens) — optional first; merged into Reveal implementation.
2. **001** — `/events` grid.
3. **002** — `/register/[eventId]` steps.
4. **003** + **004** — touch press feedback (independent).

## Dependencies

- 001 and 002 import shared motion tokens from `lib/motion/tokens.js` (005).
