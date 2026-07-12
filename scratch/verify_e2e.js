/**
 * Automated E2E API Verification Script
 * Validates endpoint availability, response payloads, schemas, 
 * and integration connectivity.
 */

const http = require('http');

const SERVER_URL = 'http://localhost:8002';
const CLIENT_URL = 'http://localhost:8001';

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', err => reject(err));

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('----------------------------------------------------');
  console.log('STARTING AUTOMATED END-TO-END VERIFICATION RUN...');
  console.log('----------------------------------------------------');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Error details: ${err.message}`);
      failed++;
    }
  };

  // Test 1: Vite Development Server Connection
  await test('Vite Client Server Connection (3000)', async () => {
    const res = await fetch(CLIENT_URL);
    if (res.statusCode !== 200) throw new Error(`Vite returned status ${res.statusCode}`);
    if (!res.data.includes('id="root"')) throw new Error('Root div template missing in index.html');
  });

  // Test 2: API Express Server Connection
  await test('Express API Server Connection (5001)', async () => {
    const res = await fetch(SERVER_URL + '/api/announcements');
    if (res.statusCode !== 200) throw new Error(`Server returned status ${res.statusCode}`);
  });

  // Test 3: Members API Query
  await test('Members Fetch Payload Schema Vetting', async () => {
    const res = await fetch(SERVER_URL + '/api/members');
    if (res.statusCode !== 200) throw new Error(`Members API failed: ${res.statusCode}`);
    const members = JSON.parse(res.data);
    if (!Array.isArray(members)) throw new Error('Members payload is not an array');
    if (members.length < 75) throw new Error(`Expected at least 75 seeded members, got ${members.length}`);
    
    // Check first member structure
    const m = members[0];
    if (!m.id || !m.name || !m.role || !m.status || !m.tagline || !m.emoji) {
      throw new Error('Member schema missing required keys');
    }
  });

  // Test 4: Members API Search Queries
  await test('Members Fetch Search Filtering', async () => {
    const res = await fetch(SERVER_URL + '/api/members?search=Jai');
    if (res.statusCode !== 200) throw new Error(`API failed: ${res.statusCode}`);
    const searchRes = JSON.parse(res.data);
    if (searchRes.length === 0) throw new Error('Search did not match Jai');
    if (searchRes[0].name !== 'Jai') throw new Error(`Expected search return to be Jai, got ${searchRes[0].name}`);
  });

  // Test 5: Announcements Endpoint Pinned
  await test('Announcements Payload Schema Vetting', async () => {
    const res = await fetch(SERVER_URL + '/api/announcements');
    const list = JSON.parse(res.data);
    if (!Array.isArray(list)) throw new Error('Announcements is not an array');
    if (list.length === 0) throw new Error('Announcements list is empty');
  });

  // Test 6: Contact invite request validations
  await test('Contact Request Validation Traps (Empty fields)', async () => {
    const res = await fetch(SERVER_URL + '/api/contact/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { name: '', phone: '' } // missing elements
    });
    if (res.statusCode !== 400) throw new Error(`Expected status 400 for bad validations, got ${res.statusCode}`);
  });

  // Test 7: Contact request submission success
  await test('Contact Request Onboarding Log (Successful payload)', async () => {
    const res = await fetch(SERVER_URL + '/api/contact/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Test Candidate',
        phone: '1234567890',
        referer: 'Jai',
        reason: 'Testing client submission request flow.'
      }
    });
    if (res.statusCode !== 201) throw new Error(`Expected status 201 on success, got ${res.statusCode}`);
    const body = JSON.parse(res.data);
    if (body.message !== 'Request submitted successfully') throw new Error('Unexpected response message');
  });

  console.log('----------------------------------------------------');
  console.log(`RUN COMPLETE. Passed: ${passed} | Failed: ${failed}`);
  console.log('----------------------------------------------------');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
