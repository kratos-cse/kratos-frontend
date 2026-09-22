# KRATOS'26 Frontend Revamp — Working Plan

## Visual system (emerged from brand study)

Studied `lion-mark.png`, `kratos26.png`, institutional logos, React Bits SpotlightCard/GlareHover/FadeContent patterns, and content hierarchy.

- Near-black grounds (asset backgrounds)
- Molten crimson primary (wordmark / lion)
- Gold accent from wordmark “T” — sparse highlight
- Cyan from lion eyes — info/status only
- Body: IBM Plex Sans (readability for forms/discovery)
- Display: Sora (modern technical headings; brand lockup uses wordmark image)
- No WebGL; Motion for short purposeful transitions

## Corrections (locked)

1. **Palette is not predetermined.** Establish visual system only after studying brand assets (`public/`), React Bits patterns, Motion usage, and content hierarchy. Target feel: premium, bold, modern, technical, energetic — colors emerge from that work.
2. **Typography is not forced “expressive.”** Choose fonts for branding + readability + discovery + forms + mobile. Distinctive display OK where appropriate; body prioritizes readability.
3. **Categories (exact):** TECHNICAL · PLAYGROUND · SPARK · ONLINE · CULTURAL
4. **Routes:** Keep proposed IA unless backend proves a route unnecessary.
5. **React Bits:** Inspect cloned implementation before adapting; selective patterns only; never install/copy entire library.
6. **Motion:** Purposeful; short timings; `prefers-reduced-motion`; mobile performance constraints.
7. **Registration/team/payment:** Inspect backend before coding; do not assume state transitions; verify leader/member/payment/invite authorization.
8. **New API clients:** Verify endpoint, method, params, body, response schema, auth against backend before implementing.
9. **Preserve:** API architecture, AuthProvider, auth mechanism, Next proxy/rewrite, API modules, brand assets.
10. **No hardcoded business rules.**
11. **No mock event/registration/team data** in production.
12. **Before done:** `npm install` · `npm run lint` · `npm run build`
13. **Integration verification** against backend for all listed flows; do not claim a flow works unless verified.

## Preserve

- `lib/api/*`, `context/AuthProvider.js`, `app/api/config`, Next rewrite, brand assets in `public/`

## Routes

`/` · `/events` · `/events/[eventId]` · `/login` · `/register/[eventId]` · `/registrations` · `/registrations/[id]` · `/registrations/[id]/qr` · `/join/[inviteCode]` · `/profile` · branded 404

## Verification status

### Ran successfully (participant frontend)
- `npm run lint` — pass
- `npm run build` — pass
- `npm run test:matrix` — 12/12 registration UI state cases

### Backend roster (kratos-backend)
- Alembic `0008_team_roster_model` — `required_member_count`, `substitute_count`, `SUBSTITUTE` role, leader-entered members
- `POST /teams/{id}/roster`, roster-aware join/team detail, admin roster on create/rules patch
- `tests/test_roster.py` — 12 unit tests for 5+2 validation rules

### Admin CMS (Admin-Frontend)
- Event create/edit with mandatory + substitute fields, preview page, typed API client
- `GET /admin/events/{id}` for editor detail (WhatsApp link, nested rules)

### Participant roster UI
- Event cards/detail/register copy uses `required_member_count` + `substitute_count`
- `TeamPanel` — mandatory vs substitute sections, leader-entered add via `POST /teams/{id}/roster`
- Join page shows roster summary from invitation payload

### Not yet verified live (E2E)
- No `.env.local` / running API in agent environment — **do not claim full 5+2 E2E until exercised locally**

E2E checklist (admin → participant):
1. Admin creates 5+2 team event, opens registration
2. Leader registers, adds mandatory members + substitutes (leader-managed or invite)
3. Payment → confirmation; roster limits enforced by API (`TEAM_MANDATORY_FULL`, `TEAM_SUBSTITUTE_LIMIT`)

To verify locally:
1. Run backend migrations (`alembic upgrade head`), start API with CORS + Google/Razorpay
2. Admin-Frontend on :3001, participant on :3000 — both proxy to API
3. Walk the checklist above end-to-end
