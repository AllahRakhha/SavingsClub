// fetch-fred-rates.js
// Fetches current rates from Federal Reserve (FRED) API and saves to data/rates.json
// Runs daily via GitHub Actions

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY_RAW = process.env.FRED_API_KEY;
if (!API_KEY_RAW) {
  console.error('ERROR: FRED_API_KEY environment variable not set');
  console.error('Make sure the secret is named exactly "FRED_API_KEY" in GitHub Settings > Secrets and variables > Actions');
  process.exit(1);
}

// Auto-clean common copy/paste mistakes (whitespace, quotes, line breaks)
const API_KEY = API_KEY_RAW.trim().replace(/^["'`]+|["'`]+$/g, '').replace(/\s/g, '');

console.log('=== API KEY DIAGNOSTIC ===');
console.log('Raw length (before cleaning):    ' + API_KEY_RAW.length);
console.log('Cleaned length:                  ' + API_KEY.length + '  (must be exactly 32)');
console.log('Has uppercase letters:           ' + (/[A-Z]/.test(API_KEY) ? 'YES (BAD - should be all lowercase)' : 'NO (good)'));
console.log('Has special characters:          ' + (/[^a-z0-9]/.test(API_KEY) ? 'YES (BAD - only a-z and 0-9 allowed)' : 'NO (good)'));
console.log('First character is letter/digit: ' + (/[a-z0-9]/.test(API_KEY[0]) ? 'YES' : 'NO'));
console.log('Format check:                    ' + (/^[a-z0-9]{32}$/.test(API_KEY) ? 'PASS ✓' : 'FAIL ✗'));
console.log('');

if (API_KEY.length !== 32) {
  console.error('ERROR: API key must be exactly 32 characters. You have ' + API_KEY.length + '.');
  console.error('');
  console.error('FIX:');
  console.error('1. Go to https://fredaccount.stlouisfed.org/apikeys');
  console.error('2. Copy the 32-character key (NOT your email, NOT your account name)');
  console.error('3. Go to https://github.com/AllahRakhha/SavingsClub/settings/secrets/actions');
  console.error('4. Update FRED_API_KEY with the correct key');
  console.error('5. Re-run this workflow');
  process.exit(1);
}

if (!/^[a-z0-9]+$/.test(API_KEY)) {
  console.error('ERROR: API key contains invalid characters.');
  console.error('Valid FRED API keys contain ONLY lowercase letters (a-z) and numbers (0-9).');
  console.error('No uppercase, no spaces, no dashes, no special characters.');
  process.exit(1);
}

console.log('✓ API key format is valid. Proceeding to fetch data...');
console.log('');

const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

// FRED series we want to display
const SERIES = {
  fedFundsRate: { id: 'FEDFUNDS', label: 'Fed Funds Rate' },
  mortgage30: { id: 'MORTGAGE30US', label: '30-Year Mortgage' },
  personalSavings: { id: 'PSAVERT', label: 'Personal Savings Rate' }
};

function fetchFred(seriesId, limit = 1) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error_code || json.error_message) {
            reject(new Error(json.error_message || 'FRED API error'));
            return;
          }
          resolve(json);
        } catch (e) {
          reject(new Error('Failed to parse FRED response: ' + e.message));
        }
      });
    }).on('error', reject);
  });
}

// Calculate inflation rate as year-over-year change in CPI
async function calculateInflation() {
  const result = await fetchFred('CPIAUCSL', 13);
  const obs = result.observations;
  if (!obs || obs.length < 13) {
    throw new Error('Not enough CPI observations to calculate YoY inflation');
  }
  // Filter out non-numeric values (FRED sometimes returns ".")
  const validObs = obs.filter(o => o.value !== '.' && !isNaN(parseFloat(o.value)));
  if (validObs.length < 13) {
    throw new Error('Not enough valid CPI observations');
  }
  const current = parseFloat(validObs[0].value);
  const yearAgo = parseFloat(validObs[12].value);
  const inflation = ((current - yearAgo) / yearAgo) * 100;
  return {
    value: inflation.toFixed(2),
    date: validObs[0].date
  };
}

async function main() {
  console.log('Fetching FRED rates...\n');
  const rates = {};
  let successCount = 0;

  // Fetch each simple series
  for (const [key, info] of Object.entries(SERIES)) {
    try {
      const result = await fetchFred(info.id, 1);
      const obs = result.observations && result.observations[0];
      if (obs && obs.value !== '.' && !isNaN(parseFloat(obs.value))) {
        rates[key] = {
          value: parseFloat(obs.value).toFixed(2),
          label: info.label,
          date: obs.date
        };
        console.log(`✓ ${info.label}: ${rates[key].value}% (${obs.date})`);
        successCount++;
      } else {
        console.warn(`⚠ ${info.label}: no valid data`);
      }
    } catch (e) {
      console.error(`✗ ${info.label}: ${e.message}`);
    }
  }

  // Calculate inflation separately
  try {
    const inflation = await calculateInflation();
    rates.inflation = {
      value: inflation.value,
      label: 'Inflation (CPI)',
      date: inflation.date
    };
    console.log(`✓ Inflation (CPI): ${inflation.value}% (${inflation.date})`);
    successCount++;
  } catch (e) {
    console.error(`✗ Inflation (CPI): ${e.message}`);
  }

  if (successCount === 0) {
    console.error('\nFAILED: No rates fetched. Not writing rates.json.');
    process.exit(1);
  }

  const output = {
    updated: new Date().toISOString(),
    source: 'Federal Reserve Bank of St. Louis (FRED)',
    sourceUrl: 'https://fred.stlouisfed.org',
    rates: rates
  };

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, 'rates.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Saved ${successCount} rates to data/rates.json`);
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
