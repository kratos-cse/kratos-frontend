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

### Ran successfully
- `npm install` (motion, qrcode.react)
- `npm run lint` — pass
- `npm run build` — pass

### Not yet verified (backend unreachable in this environment)
- No `.env.local` present; `GET http://localhost:8000/health` timed out
- Google auth, live events, registration, team, payment, QR, receipt, WhatsApp, cancel — **do not claim working until exercised against a running API**

To verify locally:
1. Start backend with CORS + Google/Razorpay configured
2. Copy `.env.local.example` → `.env.local` with `API_BASE_URL` and `GOOGLE_CLIENT_ID`
3. `npm run dev` and walk the acceptance checklist in the product brief
