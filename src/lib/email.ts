// Email service for subdomain notifications using Hostinger SMTP
import nodemailer from 'nodemailer';

interface SubdomainEmailData {
  to: string;
  subdomain: string;
  villageName: string;
  adminUsername: string;
  adminPassword: string;
  contactPerson: string;
}

// Create transporter for Hostinger SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.HOSTINGER_USER || 'admin@mahagp.in',
      pass: process.env.HOSTINGER_PASS || 'nL8*!!*Hp>H$'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export async function sendSubdomainEmail(data: SubdomainEmailData) {
  try {
    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    const emailContent = `
      Dear ${data.contactPerson},
      
      Your village website has been successfully created!
      
      Website Details:
      - Subdomain: ${data.subdomain}.mahagp.in
      - Village: ${data.villageName}
      - Admin URL: https://${data.subdomain}.mahagp.in/admin
      
      Login Credentials:
      - Username: ${data.adminUsername}
      - Password: ${data.adminPassword}
      
      Next Steps:
      1. Visit your admin panel at https://${data.subdomain}.mahagp.in/admin
      2. Login with the credentials above
      3. Start customizing your village website
      4. Add your village information, announcements, and images
      
      Important Notes:
      - Please change your password after first login
      - Your website will be live once DNS is configured
      - Contact support if you need any assistance
      
      Best regards,
      MahaGP Team
    `;

    const htmlContent = generateEmailHTML(data);

    const mailOptions = {
      from: process.env.HOSTINGER_USER || 'admin@mahagp.in',
      to: data.to,
      subject: `Your Village Website is Ready - ${data.subdomain}.mahagp.in`,
      text: emailContent,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

// Generate HTML email template
function generateEmailHTML(data: SubdomainEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🏛️ Your Village Website is Ready!</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">${data.villageName} - Gram Panchayat</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear ${data.contactPerson},</p>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          Congratulations! Your village website has been successfully created and is ready for customization.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">🌐 Website Details</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;"><strong>Subdomain:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${data.subdomain}.mahagp.in</code></li>
            <li style="margin-bottom: 8px;"><strong>Village:</strong> ${data.villageName}</li>
            <li style="margin-bottom: 8px;"><strong>Admin URL:</strong> <a href="https://${data.subdomain}.mahagp.in/admin" style="color: #3b82f6; text-decoration: none;">https://${data.subdomain}.mahagp.in/admin</a></li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px;">🔐 Login Credentials</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;"><strong>Username:</strong> <code style="background: #fbbf24; padding: 2px 6px; border-radius: 4px;">${data.adminUsername}</code></li>
            <li style="margin-bottom: 8px;"><strong>Password:</strong> <code style="background: #fbbf24; padding: 2px 6px; border-radius: 4px;">${data.adminPassword}</code></li>
          </ul>
        </div>
        
        <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 18px;">🚀 Next Steps</h3>
          <ol style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;">Visit your admin panel at <a href="https://${data.subdomain}.mahagp.in/admin" style="color: #10b981; text-decoration: none;">https://${data.subdomain}.mahagp.in/admin</a></li>
            <li style="margin-bottom: 8px;">Login with the credentials above</li>
            <li style="margin-bottom: 8px;">Start customizing your village website</li>
            <li style="margin-bottom: 8px;">Add your village information, announcements, and images</li>
            <li style="margin-bottom: 8px;">Configure your village statistics and details</li>
          </ol>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">⚠️ Important Notes</h3>
          <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px;">
            <li style="margin-bottom: 6px;">Please change your password after first login for security</li>
            <li style="margin-bottom: 6px;">Your website will be live once DNS is configured</li>
            <li style="margin-bottom: 6px;">Contact support if you need any assistance</li>
            <li style="margin-bottom: 6px;">Keep your login credentials safe and secure</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="https://${data.subdomain}.mahagp.in/admin" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access Your Admin Panel</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
          Best regards,<br>
          <strong>MahaGP Team</strong><br>
          <em>Empowering Digital Gram Panchayats</em>
        </p>
      </div>
    </div>
  `;
}