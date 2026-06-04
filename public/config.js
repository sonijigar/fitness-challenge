// ─────────────────────────────────────────────
// CHALLENGE CONFIG — change this file each month
// ─────────────────────────────────────────────
const CHALLENGE = {
  id: 'june-2026',           // stored in DB, used to filter
  name: 'June Challenge',    // display name
  month: 'June 2026',        // subtitle
  header: 'JUNE',            // big header text
  goalHours: 250,            // team goal in hours
  startDate: '2026-06-01',   // first day
  days: 30,                  // days in the month
  timezone: 'America/Los_Angeles',
};

// ─── Derived values (don't edit) ──────────────
CHALLENGE.goalMins = CHALLENGE.goalHours * 60;
CHALLENGE.start = new Date(CHALLENGE.startDate + 'T00:00:00');

// Members and activities
const MEMBERS = ['Ashka','Heli','Himani','Jigar','Karan','Kashyap','Khushboo','Malhar','Raghav','Vishrut'];
const ACTIVITIES = ['Running','Hiking','Lifting','Cycling','Weighted Walking','Incline Walking','HIIT','Swimming','Yoga','Volleyball','Climbing','Other'];

// Supabase (public anon key — safe for frontend)
const SUPABASE_URL = 'https://teyafvhzoznsjknhinrd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BwZtfeVzUS_hoY-3L75T1w_CfFntJYM';
