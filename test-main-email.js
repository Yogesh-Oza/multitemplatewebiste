// Test email to main Gmail address
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  console.log('📧 Sending test email to: yogeshoza33333@gmail.com');
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    
    console.log('🔗 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!');
    
    const mailOptions = {
      from: process.env.GMAIL_USER || 'admin@mahagp.in',
      to: 'yogeshoza33333@gmail.com',
      subject: '🧪 Test Email - Gram Panchayat System (Main Address)',
      text: `
Hello!

This is a test email to your main Gmail address to verify email delivery.

Test Details:
- Time: ${new Date().toLocaleString()}
- From: Gram Panchayat System
- To: yogeshoza33333@gmail.com (main address)
- Purpose: Testing email delivery without + symbols

If you receive this email, the email system is working correctly!

Best regards,
MahaGP Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧪 Test Email</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Gram Panchayat System</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #374151; margin-bottom: 20px;">Hello!</h2>
            
            <p style="color: #374151; margin-bottom: 20px;">
              This is a test email to your main Gmail address to verify email delivery.
            </p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">📧 Test Details</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li style="margin-bottom: 8px;"><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                <li style="margin-bottom: 8px;"><strong>From:</strong> Gram Panchayat System</li>
                <li style="margin-bottom: 8px;"><strong>To:</strong> yogeshoza33333@gmail.com (main address)</li>
                <li style="margin-bottom: 8px;"><strong>Purpose:</strong> Testing email delivery without + symbols</li>
              </ul>
            </div>
            
            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #065f46; font-weight: bold;">
                ✅ If you receive this email, the email system is working correctly!
              </p>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px;">📁 Where to Check</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px;">
                <li style="margin-bottom: 6px;">Check your main Gmail inbox</li>
                <li style="margin-bottom: 6px;">Look in the Spam/Junk folder</li>
                <li style="margin-bottom: 6px;">Check the "All Mail" section</li>
                <li style="margin-bottom: 6px;">Look in the "Promotions" tab if you have Gmail tabs</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
              Best regards,<br>
              <strong>MahaGP Team</strong>
            </p>
          </div>
        </div>
      `
    };
    
    console.log('📤 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    console.log('\n⏰ Please check your email in 2-5 minutes');
    console.log('📁 Also check your spam/junk folder');
    console.log('📧 Look in "All Mail" section if not in inbox');
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('Error details:', error);
  }
}

sendTestEmail();
