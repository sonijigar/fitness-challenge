#!/usr/bin/env node
// E2E tests for May Challenge API
// Usage: BASE_URL=https://may-challenge.vercel.app node tests/e2e.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_NAME = 'Jigar'; // must be a valid member
const TEST_DATE = new Date().toISOString().split('T')[0];

let passed = 0;
let failed = 0;
let loggedWorkoutId = null;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function del(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  return { status: res.status };
}

// ─── STATIC PAGES ───────────────────────────────────────────────────────────

async function runStaticTests() {
  console.log('\n📄 Static pages');

  await test('GET / returns 200', async () => {
    const { status } = await get('/');
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('GET /dashboard.html returns 200', async () => {
    const { status } = await get('/dashboard.html');
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('GET /history.html returns 200', async () => {
    const { status } = await get('/history.html');
    assert(status === 200, `Expected 200, got ${status}`);
  });
}

// ─── POST /api/log ───────────────────────────────────────────────────────────

async function runLogTests() {
  console.log('\n📝 POST /api/log');

  await test('valid workout logs successfully', async () => {
    const { status, data } = await post('/api/log', {
      name: TEST_NAME,
      activity: 'Running',
      mins: 30,
      date: TEST_DATE
    });
    assert(status === 200, `Expected 200, got ${status} — ${JSON.stringify(data)}`);
    assert(data.success === true, `Expected success:true, got ${JSON.stringify(data)}`);
    assert(data.message.includes(TEST_NAME), `Response missing name: ${data.message}`);
  });

  await test('missing name returns 400', async () => {
    const { status, data } = await post('/api/log', {
      activity: 'Running', mins: 30, date: TEST_DATE
    });
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error, `Expected error message`);
  });

  await test('missing activity returns 400', async () => {
    const { status, data } = await post('/api/log', {
      name: TEST_NAME, mins: 30, date: TEST_DATE
    });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test('missing mins returns 400', async () => {
    const { status, data } = await post('/api/log', {
      name: TEST_NAME, activity: 'Running', date: TEST_DATE
    });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test('missing date returns 400', async () => {
    const { status, data } = await post('/api/log', {
      name: TEST_NAME, activity: 'Running', mins: 30
    });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test('unknown member returns 400', async () => {
    const { status, data } = await post('/api/log', {
      name: 'Alex', activity: 'Running', mins: 30, date: TEST_DATE
    });
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error.includes('Unknown member'), `Expected unknown member error, got: ${data.error}`);
  });

  await test('unknown activity returns 400', async () => {
    const { status, data } = await post('/api/log', {
      name: TEST_NAME, activity: 'Knitting', mins: 30, date: TEST_DATE
    });
    assert(status === 400, `Expected 400, got ${status}`);
    assert(data.error.includes('Unknown activity'), `Expected unknown activity error, got: ${data.error}`);
  });

  await test('invalid mins (0) returns 400', async () => {
    const { status } = await post('/api/log', {
      name: TEST_NAME, activity: 'Running', mins: 0, date: TEST_DATE
    });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test('invalid mins (700) returns 400', async () => {
    const { status } = await post('/api/log', {
      name: TEST_NAME, activity: 'Running', mins: 700, date: TEST_DATE
    });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test('all 11 activities are accepted', async () => {
    const activities = ['Running','Hiking','Lifting','Cycling','Walking','HIIT','Swimming','Yoga','Volleyball','Climbing','Other'];
    for (const activity of activities) {
      const { status, data } = await post('/api/log', {
        name: TEST_NAME, activity, mins: 1, date: TEST_DATE
      });
      assert(status === 200, `Activity "${activity}" failed: ${status} — ${JSON.stringify(data)}`);
    }
  });

  // Log one more workout to use in delete test — save its id via Supabase
  await test('log a test workout for delete test', async () => {
    const { status, data } = await post('/api/log', {
      name: TEST_NAME,
      activity: 'Other',
      mins: 1,
      date: TEST_DATE
    });
    assert(status === 200, `Expected 200, got ${status}`);
  });
}

// ─── DELETE /api/delete ──────────────────────────────────────────────────────

async function runDeleteTests() {
  console.log('\n🗑️  DELETE /api/delete');

  // Fetch the most recently logged workout ID for TEST_NAME from Supabase directly
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('  ⚠️  Skipping delete tests — SUPABASE_URL/SUPABASE_ANON_KEY not set in env');
    return;
  }

  // Get latest workout for test user
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/workouts?name=eq.${TEST_NAME}&order=created_at.desc&limit=1`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const rows = await res.json();

  if (!rows.length) {
    console.log('  ⚠️  No workouts found for test user — skipping delete tests');
    return;
  }

  const workoutId = rows[0].id;

  await test('wrong name cannot delete workout', async () => {
    const { status, data } = await del('/api/delete', {
      id: workoutId,
      name: 'Alex' // not a valid member
    });
    assert(status === 400, `Expected 400, got ${status}`);
  });

  await test('valid delete removes workout', async () => {
    const { status, data } = await del('/api/delete', {
      id: workoutId,
      name: TEST_NAME
    });
    assert(status === 200, `Expected 200, got ${status} — ${JSON.stringify(data)}`);
    assert(data.success === true, `Expected success:true`);
  });

  await test('deleting already-deleted workout returns 200 (idempotent)', async () => {
    const { status } = await del('/api/delete', {
      id: workoutId,
      name: TEST_NAME
    });
    assert(status === 200, `Expected 200, got ${status}`);
  });
}

// ─── RUN ALL ─────────────────────────────────────────────────────────────────

async function run() {
  console.log(`\n🧪 May Challenge E2E Tests`);
  console.log(`   BASE_URL: ${BASE_URL}`);
  console.log(`   Date:     ${TEST_DATE}`);

  await runStaticTests();
  await runLogTests();
  await runDeleteTests();

  console.log(`\n${'─'.repeat(40)}`);
  console.log(`  ${passed} passed, ${failed} failed`);
  console.log(`${'─'.repeat(40)}\n`);

  if (failed > 0) process.exit(1);
}

run().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
