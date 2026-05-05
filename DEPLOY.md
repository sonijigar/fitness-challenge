# May Challenge — Deploy Guide

## Step 1 — Supabase (3 min)

1. Go to https://supabase.com → "Start for free" → sign up
2. Click "New project" → give it any name (e.g. `may-challenge`) → set a DB password → Create
3. Wait ~1 min for it to spin up
4. Go to **SQL Editor** (left sidebar) → paste the contents of `supabase-setup.sql` → click Run
5. Go to **Settings → API** → copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

---

## Step 2 — GitHub (2 min)

```bash
cd may-challenge
git init
git add .
git commit -m "initial commit"
# Create a new repo at https://github.com/new (name: may-challenge, private is fine)
git remote add origin https://github.com/YOUR_USERNAME/may-challenge.git
git push -u origin main
```

---

## Step 3 — Vercel (3 min)

1. Go to https://vercel.com → sign in with GitHub
2. Click "Add New Project" → import your `may-challenge` repo
3. Before deploying, click **Environment Variables** and add:
   - `SUPABASE_URL` → your Project URL from Step 1
   - `SUPABASE_ANON_KEY` → your anon key from Step 1
4. Click **Deploy**
5. Your app is live at `https://may-challenge.vercel.app` (or similar)

---

## Step 4 — Update member names

Open `public/index.html` and find the `<select id="name-select">` block.
Replace the placeholder names (Alex, Jordan, Sam...) with your actual friend group names.
Commit and push — Vercel auto-redeploys.

```bash
git add .
git commit -m "update member names"
git push
```

---

## Step 5 — Siri Shortcut (share with friends)

### Build the shortcut (do this once, then share the link):

1. Open **Shortcuts** app on iPhone
2. Tap **+** to create new shortcut
3. Add these actions in order:

**Action 1: Choose from Menu**
- Prompt: "Which activity?"
- Options: Running, Hiking, Lifting, Cycling, Walking, HIIT, Swimming, Yoga, Other

**Action 2: Get Contents of URL**
- URL: `https://YOUR-APP.vercel.app/api/log`
- Method: POST
- Headers: `Content-Type` = `application/json`
- Request Body: JSON
  ```json
  {
    "name": "YOUR NAME HERE",
    "activity": [Chosen Menu Item],
    "mins": [Ask for Input: "How many minutes?"],
    "date": [Current Date formatted as YYYY-MM-DD]
  }
  ```
  *Tap the fields to insert variables from previous actions*

**Action 3: Show Notification**
- Body: "Logged! [Chosen Menu Item] · [Input: mins] min"

4. Name the shortcut **"Log Workout"**
5. Tap the shortcut info (i) → enable **"Add to Siri"** → record phrase: *"log workout"*

### Share with friends:
- In Shortcuts app → tap the shortcut → Share → **Copy iCloud Link**
- Send link in group chat
- Each friend: tap link → Add Shortcut → tap the "YOUR NAME HERE" field → type their name → done

### What it feels like:
> "Hey Siri, log workout"
> Siri: shows menu → tap Running
> Siri: "How many minutes?" → say or type "45"
> Notification: "Logged! Running · 45 min" ✓

---

## Quick test

```bash
curl -X POST https://YOUR-APP.vercel.app/api/log \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","activity":"Running","mins":30,"date":"2025-05-01"}'
```

Expected response: `{"success":true,"message":"Logged 30 min of Running for Alex"}`
