# Kratos'26 — Next.js Frontend.
Next.js 14 (App Router) version of the Kratos'26 ACE National Symposium site.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Structure
- `app/` — routes: `/`, `/technical`, `/spark`, `/online`, `/sports`, `/feedback`; `globals.css` (original style.css)
- `components/` — Header, Footer, BackgroundCanvas, IntroOverlay, EventsGrid, EventModal, Countdown, RegistrationsPanel, FeedbackForm
- `context/ModalContext.js` — shared event-modal state
- `data/events.js` — event list (swap for a backend fetch later)
- `public/assets/` — images and intro video

## Backend hooks (for the backend team)
- Events: replace `data/events.js` with an API fetch
- Sign-in / roster: `components/RegistrationsPanel.js`
- Payment: `payBtn` handler in `components/EventModal.js` (Razorpay placeholder)
- Feedback submit: `handleSubmit` in `components/FeedbackForm.js`
