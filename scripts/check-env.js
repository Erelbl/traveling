/**
 * Quick environment check script
 * Run: node scripts/check-env.js
 */

// Load .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('⚠️  dotenv not installed, install with: npm install dotenv');
  console.log('   For now, relying on system environment\n');
}

const requiredVars = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'AUTH_RESEND_KEY',
];

const optionalVars = [
  'AUTH_EMAIL_FROM',
  'AUTH_URL',
  'AUTH_TRUST_HOST',
  'DIRECT_URL',
];

console.log('═══════════════════════════════════════');
console.log('  Environment Variables Check');
console.log('═══════════════════════════════════════\n');

let hasErrors = false;

// Check required variables
console.log('Required Variables:');
console.log('─'.repeat(40));
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✓' : '✗';
  const color = value ? '\x1b[32m' : '\x1b[31m'; // Green or Red
  const reset = '\x1b[0m';
  
  console.log(`${color}${status}${reset} ${varName}: ${value ? 'Set' : 'MISSING!'}`);
  
  if (!value) {
    hasErrors = true;
  }
});

console.log('\nOptional Variables:');
console.log('─'.repeat(40));
optionalVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✓' : '○';
  const color = value ? '\x1b[32m' : '\x1b[33m'; // Green or Yellow
  const reset = '\x1b[0m';
  
  console.log(`${color}${status}${reset} ${varName}: ${value || '(using default)'}`);
});

// Check DATABASE_URL format
if (process.env.DATABASE_URL) {
  console.log('\nDATABASE_URL Format Check:');
  console.log('─'.repeat(40));
  
  const url = process.env.DATABASE_URL;
  const startsCorrect = url.startsWith('postgresql://') || url.startsWith('postgres://');
  const hasHost = url.includes('@');
  const hasDb = url.split('/').length > 3;
  
  if (startsCorrect && hasHost && hasDb) {
    console.log('\x1b[32m✓\x1b[0m Format looks valid');
    console.log(`  Preview: ${url.substring(0, 50)}...`);
  } else {
    console.log('\x1b[31m✗\x1b[0m Format might be invalid');
    console.log(`  Current: ${url.substring(0, 50)}...`);
    hasErrors = true;
  }
}

console.log('\n═══════════════════════════════════════');
if (hasErrors) {
  console.log('\x1b[31m✗ Some required variables are missing!\x1b[0m');
  console.log('\nAction needed:');
  console.log('1. Create .env.local in project root');
  console.log('2. Add missing variables');
  console.log('3. See: SETUP_ENV_INSTRUCTIONS.md\n');
  process.exit(1);
} else {
  console.log('\x1b[32m✓ All required variables are set!\x1b[0m\n');
  process.exit(0);
}

