// Test Resend email sending directly
import { Resend } from 'resend';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local explicitly
const envPath = resolve(__dirname, '..', '.env.local');
console.log('Loading env from:', envPath);
config({ path: envPath });

// Load environment variables
const resendApiKey = process.env.AUTH_RESEND_KEY;
const emailFrom = process.env.AUTH_EMAIL_FROM ?? "Trip Finance <onboarding@resend.dev>";

console.log('=================================');
console.log('Testing Resend Email Configuration');
console.log('=================================');
console.log('AUTH_RESEND_KEY:', resendApiKey ? `✓ Set (${resendApiKey.substring(0, 10)}...)` : '✗ Missing');
console.log('AUTH_EMAIL_FROM:', emailFrom);
console.log('=================================\n');

if (!resendApiKey) {
  console.error('❌ AUTH_RESEND_KEY is not set!');
  console.error('Please set it in .env.local');
  process.exit(1);
}

const resend = new Resend(resendApiKey);

async function testEmail() {
  try {
    console.log('📧 Attempting to send test email...\n');
    
    const result = await resend.emails.send({
      from: emailFrom,
      to: 'doreliraz@gmail.com', // Your email for testing
      subject: 'בדיקת Resend - Travel Finance',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">✅ Resend עובד!</h2>
          <p>זהו אימייל בדיקה מאפליקציית Travel Finance.</p>
          <p>אם אתה רואה את האימייל הזה, המערכת עובדת כמו שצריך! 🎉</p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            נשלח ב-${new Date().toLocaleString('he-IL')}
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Response:', result);
    console.log('\n=================================');
    console.log('Check your inbox at doreliraz@gmail.com');
    console.log('=================================\n');
    
  } catch (error) {
    console.error('❌ Failed to send email!\n');
    console.error('Error details:');
    console.error(error);
    console.log('\n=================================');
    console.log('Possible issues:');
    console.log('1. AUTH_RESEND_KEY is invalid or expired');
    console.log('2. Resend account needs verification');
    console.log('3. Email domain not verified (use resend.dev for testing)');
    console.log('4. API key permissions issue');
    console.log('=================================\n');
    process.exit(1);
  }
}

testEmail();

