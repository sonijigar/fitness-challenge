const MEMBERS = ['Aashka','Heli','Himani','Jigar','Karan','Kashyap','Khushboo','Malhar','Raghav','Vishrut'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const { id, name } = req.body;

  if (!id || !name) return res.status(400).json({ error: 'Missing id or name' });
  if (!MEMBERS.includes(name)) return res.status(400).json({ error: 'Unknown member' });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Missing env vars' });

  // Only delete if the workout belongs to this person
  const response = await fetch(`${supabaseUrl}/rest/v1/workouts?id=eq.${id}&name=eq.${encodeURIComponent(name)}`, {
    method: 'DELETE',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=minimal'
    }
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Supabase error:', err);
    return res.status(500).json({ error: 'Failed to delete', detail: err });
  }

  return res.status(200).json({ success: true, message: `Workout deleted for ${name}` });
};
