// Gmail SMTP Connection Test Script
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testGmailSMTP() {
  console.log('🔍 Gmail SMTP Connection Diagnostic Test\n');
  console.log('='.repeat(60));
  
  // Check environment variables
  console.log('\n📋 Environment Variables Check:');
  console.log('─'.repeat(60));
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;
  
  if (!gmailUser) {
    console.log('❌ GMAIL_USER: NOT SET');
  } else {
    console.log(`✅ GMAIL_USER: ${gmailUser.substring(0, 3)}***${gmailUser.substring(gmailUser.length - 10)}`);
  }
  
  if (!gmailPass) {
    console.log('❌ GMAIL_PASS: NOT SET');
  } else {
    console.log(`✅ GMAIL_PASS: ${'*'.repeat(Math.min(gmailPass.length, 16))} (${gmailPass.length} characters)`);
  }
  
  if (!gmailUser || !gmailPass) {
    console.log('\n❌ Missing environment variables. Please set GMAIL_USER and GMAIL_PASS.');
    return;
  }
  
  console.log('\n🔗 Testing SMTP Connection...');
  console.log('─'.repeat(60));
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });
    
    console.log('📧 Transporter created successfully');
    console.log('🔐 Attempting to verify SMTP connection...\n');
    
    // Verify connection
    await transporter.verify();
    
    console.log('✅ SUCCESS! SMTP connection verified successfully!');
    console.log('✅ Your Gmail credentials are working correctly.\n');
    
    // Test sending an email
    console.log('📤 Testing email sending...');
    console.log('─'.repeat(60));
    
    const testEmail = {
      from: gmailUser,
      to: gmailUser, // Send to self for testing
      subject: '🧪 Gmail SMTP Test - ' + new Date().toLocaleString(),
      text: 'This is a test email to verify Gmail SMTP is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #10b981;">✅ Gmail SMTP Test Successful!</h2>
          <p>If you received this email, your Gmail SMTP configuration is working correctly.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📧 Response: ${result.response}`);
    console.log('\n✅ All tests passed! Your Gmail SMTP is configured correctly.\n');
    
  } catch (error) {
    console.log('\n❌ SMTP Connection Failed!\n');
    console.log('Error Details:');
    console.log('─'.repeat(60));
    console.log(`Error Code: ${error.code || 'N/A'}`);
    console.log(`Error Message: ${error.message || 'Unknown error'}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔴 AUTHENTICATION ERROR DETECTED\n');
      console.log('This error means Gmail rejected your username/password.\n');
      console.log('Common Solutions:');
      console.log('─'.repeat(60));
      console.log('1. ✅ USE APP PASSWORD (Required if 2-Step Verification is enabled)');
      console.log('   - Go to: https://myaccount.google.com/apppasswords');
      console.log('   - Generate an App Password for "Mail"');
      console.log('   - Use that 16-character password (not your regular password)');
      console.log('   - Update GMAIL_PASS environment variable\n');
      
      console.log('2. ✅ ENABLE 2-STEP VERIFICATION (Recommended)');
      console.log('   - Go to: https://myaccount.google.com/security');
      console.log('   - Enable 2-Step Verification');
      console.log('   - Then create an App Password\n');
      
      console.log('3. ✅ CHECK ACCOUNT SECURITY');
      console.log('   - Make sure "Less secure app access" is NOT needed');
      console.log('   - Google deprecated this, use App Passwords instead\n');
      
      console.log('4. ✅ VERIFY CREDENTIALS');
      console.log('   - Double-check GMAIL_USER is correct (full email address)');
      console.log('   - Verify GMAIL_PASS is the App Password (16 characters, no spaces)\n');
      
      console.log('📖 Full Guide: https://support.google.com/mail/answer/185833\n');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔴 CONNECTION ERROR DETECTED\n');
      console.log('Could not connect to Gmail SMTP server.\n');
      console.log('Possible causes:');
      console.log('- Network/firewall blocking SMTP connection');
      console.log('- Gmail service temporarily unavailable');
      console.log('- Check your internet connection\n');
    } else {
      console.log('\n⚠️  Unexpected error occurred.');
      console.log('Please check the error details above.\n');
    }
    
    if (error.response) {
      console.log('Server Response:');
      console.log('─'.repeat(60));
      console.log(error.response);
      console.log('');
    }
  }
}

// Run the test
testGmailSMTP().catch(console.error);

