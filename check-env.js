const fs = require('fs');
const path = require('path');

// Try to load .env
try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = require('dotenv').config({ path: envPath });
        if (envConfig.error) {
            throw envConfig.error;
        }
    }
} catch (e) {
    console.log('Could not load .env directly (might rely on Next.js loading):', e.message);
}

const required = [
    'DATABASE_URL',
    'AUTH_GOOGLE_ID',
    'AUTH_GOOGLE_SECRET',
    'AUTH_GITHUB_ID',
    'AUTH_GITHUB_SECRET',
    'AUTH_SECRET'
];

console.log('--- Environment Variable Check ---');
required.forEach(key => {
    if (process.env[key]) {
        console.log(`${key}: FAIL (Found but not identifying for security)`);
        // Wait, I want to know if it's there. 
        // Correct logic:
        console.log(`${key}: PRESENT`);
    } else {
        console.log(`${key}: MISSING`);
    }
});
console.log('----------------------------------');
