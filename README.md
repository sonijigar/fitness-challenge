# 🏋️ May Challenge

A group fitness tracker for 10 friends — log workouts, track collective progress toward 250 hours in May 2026.

**Live app:** [may-challenge.vercel.app](https://may-challenge.vercel.app)

---

## What it does

- **Log workouts** — pick your name, activity, and duration. Done in 10 seconds.
- **Squad dashboard** — live progress toward 250 hrs, leaderboard, weekly chart, activity breakdown.
- **Personal history** — tap anyone on the leaderboard to see their full workout history.
- **Siri Shortcut** — "Hey Siri, log workout" → pick activity → say minutes → auto-logs.
- **iOS Automation** — workouts from Strava, Apple Fitness, or Whoop auto-log when a workout ends.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla HTML/CSS/JS |
| API | Vercel Serverless Functions |
| Database | Supabase (Postgres) |
| Hosting | Vercel (auto-deploys from `main`) |

---

## Project structure

```
├── api/
│   └── log.js              # POST /api/log — saves a workout to Supabase
├── public/
│   ├── index.html          # Logging screen
│   ├── dashboard.html      # Squad analytics dashboard
│   └── history.html        # Personal workout history (?name=Jigar)
├── supabase-setup.sql      # Run once to create the workouts table
├── vercel.json             # Vercel routing config
└── package.json
```

---

## Local setup

**Prerequisites:** Node.js, Vercel CLI (`npm i -g vercel`)

```bash
git clone https://github.com/sonijigar/fitness-challenge.git
cd fitness-challenge
vercel dev
```

Add a `.env.local` file with:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## Contributing

1. Branch off `main` — use `feat/`, `fix/`, or `docs/` prefixes
2. Keep PRs small and focused — one change per PR
3. Test on mobile (iOS Safari) before opening a PR
4. Tag @sonijigar for review

**Never push directly to `main`.**

---

## Members

Aashka · Heli · Himani · Jigar · Karan · Kashyap · Khushboo · Malhar · Raghav · Vishrut

To add or remove a member, update the `MEMBERS` array in `api/log.js` and the `<select>` in `public/index.html`.

---

## Supported activities

Running · Hiking · Lifting · Cycling · Walking · HIIT · Swimming · Yoga · Volleyball · Climbing · Other

---

## Environment variables

| Variable | Where to get it |
|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |

Set these in Vercel → Project → Settings → Environment Variables.
