const MEMBERS = ['Ashka','Heli','Himani','Jigar','Karan','Kashyap','Khushboo','Malhar','Raghav','Vishrut'];
const ACTIVITIES = ['Running','Hiking','Lifting','Cycling','Walking','HIIT','Swimming','Yoga','Volleyball','Climbing','Other'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, activity, mins, date } = req.body;
  if (!name || !activity || !mins || !date) return res.status(400).json({ error: 'Missing fields', received: { name, activity, mins, date } });
  if (!MEMBERS.includes(name)) return res.status(400).json({ error: `Unknown member: ${name}` });
  if (!ACTIVITIES.includes(activity)) return res.status(400).json({ error: 'Unknown activity', received: activity });
  const minutes = parseInt(String(mins).replace(/[^0-9]/g, ''));
  if (isNaN(minutes) || minutes < 1 || minutes > 600) return res.status(400).json({ error: 'Invalid mins', received: mins });
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Missing env vars' });
  const response = await fetch(`${supabaseUrl}/rest/v1/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ name, activity, mins: minutes, date })
  });
  if (!response.ok) { const err = await response.text(); console.error('Supabase error:', err); return res.status(500).json({ error: 'Failed to save', detail: err }); }
  return res.status(200).json({ success: true, message: `Logged ${minutes} min of ${activity} for ${name}` });
};
