// fetch-fred-rates.js
// Fetches current rates + 12-month history from Federal Reserve (FRED) API
// Saves to data/rates.json
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
console.log('Format check:                    ' + (/^[a-z0-9]{32}$/.test(API_KEY) ? 'PASS ✓' : 'FAIL ✗'));
console.log('');

if (API_KEY.length !== 32 || !/^[a-z0-9]+$/.test(API_KEY)) {
  console.error('ERROR: API key invalid. Must be 32 lowercase alphanumeric characters.');
  console.error('Get a valid key at: https://fredaccount.stlouisfed.org/apikeys');
  process.exit(1);
}

console.log('✓ API key format valid. Fetching FRED data with 12-month history...');
console.log('');

const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

// FRED series + their canonical FRED.org URLs (for "View →" links)
const SERIES = {
  fedFundsRate: {
    id: 'FEDFUNDS',
    label: 'Fed Funds Rate',
    historyLimit: 12,
    fredUrl: 'https://fred.stlouisfed.org/series/FEDFUNDS'
  },
  mortgage30: {
    id: 'MORTGAGE30US',
    label: '30-Year Mortgage',
    historyLimit: 12,
    fredUrl: 'https://fred.stlouisfed.org/series/MORTGAGE30US'
  },
  personalSavings: {
    id: 'PSAVERT',
    label: 'Personal Savings Rate',
    historyLimit: 12,
    fredUrl: 'https://fred.stlouisfed.org/series/PSAVERT'
  }
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

// Fetch current value + history for a simple series
async function fetchSeriesWithHistory(info) {
  const result = await fetchFred(info.id, info.historyLimit);
  const obs = result.observations || [];
  const validObs = obs.filter(o => o.value !== '.' && !isNaN(parseFloat(o.value)));
  if (validObs.length === 0) {
    throw new Error(`No valid observations for ${info.id}`);
  }
  // validObs is descending (newest first). Reverse for chronological (oldest → newest) sparkline.
  const history = validObs
    .slice(0, info.historyLimit)
    .reverse()
    .map(o => parseFloat(parseFloat(o.value).toFixed(2)));
  return {
    value: parseFloat(validObs[0].value).toFixed(2),
    label: info.label,
    date: validObs[0].date,
    history: history,
    fredSeriesId: info.id,
    fredUrl: info.fredUrl
  };
}

// Calculate inflation YoY + 12-month history of inflation rates
async function calculateInflationWithHistory() {
  // Need 24 months of CPI data to calculate 12 months of YoY inflation
  const result = await fetchFred('CPIAUCSL', 24);
  const obs = result.observations || [];
  const validObs = obs.filter(o => o.value !== '.' && !isNaN(parseFloat(o.value)));
  if (validObs.length < 13) {
    throw new Error('Not enough valid CPI observations for inflation calculation');
  }
  // validObs is descending. Calculate inflation for each month back to where we have year-ago data.
  const inflationHistory = [];
  const maxMonths = Math.min(12, validObs.length - 12);
  for (let i = maxMonths - 1; i >= 0; i--) {
    const current = parseFloat(validObs[i].value);
    const yearAgo = parseFloat(validObs[i + 12].value);
    if (yearAgo && !isNaN(yearAgo)) {
      const inflation = ((current - yearAgo) / yearAgo) * 100;
      inflationHistory.push(parseFloat(inflation.toFixed(2)));
    }
  }
  const currentInflation = inflationHistory[inflationHistory.length - 1];
  return {
    value: currentInflation.toFixed(2),
    label: 'Inflation (CPI)',
    date: validObs[0].date,
    history: inflationHistory,
    fredSeriesId: 'CPIAUCSL',
    fredUrl: 'https://fred.stlouisfed.org/series/CPIAUCSL'
  };
}

async function main() {
  const rates = {};
  let successCount = 0;

  // Fetch each series with history
  for (const [key, info] of Object.entries(SERIES)) {
    try {
      const data = await fetchSeriesWithHistory(info);
      rates[key] = data;
      console.log(`✓ ${info.label}: ${data.value}% (${data.history.length} history points)`);
      successCount++;
    } catch (e) {
      console.error(`✗ ${info.label}: ${e.message}`);
    }
  }

  // Inflation with history
  try {
    const inflation = await calculateInflationWithHistory();
    rates.inflation = inflation;
    console.log(`✓ Inflation (CPI): ${inflation.value}% (${inflation.history.length} history points)`);
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

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const outputPath = path.join(dataDir, 'rates.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Saved ${successCount} rates with history to data/rates.json`);
}

main().catch(e => {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
