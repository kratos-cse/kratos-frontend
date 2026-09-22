# KRATOS'26 Frontend


Participant frontend scaffold. UI removed for redesign; backend connection kept.

## Kept

- `lib/api/*` — auth, events, payments, profile, registrations, teams + shared client
- `context/AuthProvider.js` — JWT session via `/auth/google` + `/auth/me`
- `app/api/config` — server-only `GOOGLE_CLIENT_ID`
- `next.config.js` — rewrites `/api/v1/*` → `API_BASE_URL`

## Env

Copy `.env.local.example` → `.env.local`:

```
API_BASE_URL=http://localhost:8000
GOOGLE_CLIENT_ID=
```

Do not use `NEXT_PUBLIC_` for these.

## Run

```bash
npm install
npm run dev
```
