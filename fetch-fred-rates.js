// fetch-fred-rates.js
// Fetches current rates from Federal Reserve (FRED) API and saves to data/rates.json
// Runs daily via GitHub Actions

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.FRED_API_KEY;
if (!API_KEY) {
  console.error('ERROR: FRED_API_KEY environment variable not set');
  console.error('Add it to GitHub Secrets: Settings > Secrets and variables > Actions');
  process.exit(1);
}

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
