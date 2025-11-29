// Email service for subdomain notifications using Brevo SMTP
import nodemailer from 'nodemailer';

interface SubdomainEmailData {
  to: string;
  subdomain: string;
  villageName: string;
  adminUsername: string;
  adminPassword: string;
  contactPerson: string;
}

interface PasswordResetEmailData {
  to: string;
  username: string;
  resetToken: string;
  subdomain?: string;
}

// Validate email configuration
function validateEmailConfig(): { isValid: boolean; error?: string; configType?: string } {
  const hasBrevo = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const hasGmail = !!(process.env.GMAIL_USER && process.env.GMAIL_PASS);
  
  if (hasBrevo) {
    return { isValid: true, configType: 'Brevo' };
  }
  
  if (hasGmail) {
    return { isValid: true, configType: 'Gmail' };
  }
  
  return {
    isValid: false,
    error: 'No email service configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS (or GMAIL_USER and GMAIL_PASS) environment variables.',
    configType: 'None'
  };
}

// Create transporter using Brevo or Gmail SMTP
const createTransporter = () => {
  // Validate configuration first
  const configCheck = validateEmailConfig();
  if (!configCheck.isValid) {
    console.error('❌ Email configuration error:', configCheck.error);
    throw new Error(configCheck.error || 'Email service not configured');
  }
  
  // Use Brevo SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('📧 Using Brevo SMTP');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Fallback to Gmail SMTP
  console.log('📧 Using Gmail SMTP');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
};

export async function sendSubdomainEmail(data: SubdomainEmailData) {
  try {
    console.log('📧 Attempting to send subdomain email:', {
      to: data.to,
      subdomain: data.subdomain,
      villageName: data.villageName,
      timestamp: new Date().toISOString()
    });
    
    // Validate email configuration before proceeding
    const configCheck = validateEmailConfig();
    if (!configCheck.isValid) {
      const errorMsg = configCheck.error || 'Email service not configured';
      console.error('❌ Email configuration validation failed:', errorMsg);
      return { success: false, error: errorMsg };
    }
    console.log(`✅ Email configuration valid (${configCheck.configType})`);
    
    const transporter = createTransporter();
    
    // Verify connection configuration
    console.log('🔗 Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('❌ SMTP connection verification failed:', {
        error: verifyError?.message,
        code: verifyError?.code,
        command: verifyError?.command,
        response: verifyError?.response
      });
      return { 
        success: false, 
        error: `SMTP connection failed: ${verifyError?.message || 'Unknown error'}` 
      };
    }
    
    const emailContent = `
      प्रिय ${data.contactPerson},
      
      आपली गावाची वेबसाइट यशस्वीरित्या तयार झाली आहे!
      
      Website Information:
      - Subdomain: ${data.subdomain}.mahagp.in
      - Village: ${data.villageName}
      - Admin URL: https://${data.subdomain}.mahagp.in/admin-login
      
      Login Credentials:
      - Username: ${data.adminUsername}
      - Password: ${data.adminPassword}
      
      पुढील पायऱ्या:
      1. https://${data.subdomain}.mahagp.in/admin-login येथे आपले व्यवस्थापक पॅनेल भेट द्या
      2. वरील क्रेडेन्शियल्ससह लॉगिन करा
      3. आपली गावाची वेबसाइट सानुकूलित करण्यास सुरुवात करा
      4. आपल्या गावाची माहिती, घोषणा आणि चित्रे जोडा
      
      महत्वाच्या नोट्स:
      - कृपया पहिल्या लॉगिननंतर आपला पासवर्ड बदला
      - DNS कॉन्फिगर केल्यानंतर आपली वेबसाइट लाइव्ह होईल
      - आपल्याला कोणतीही मदत हवी असल्यास समर्थनाशी संपर्क साधा
      
      Best regards,
      MahaGP Team
    `;

    const htmlContent = generateEmailHTML(data);

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'admin@mahagp.in';
    
    const mailOptions = {
      from: fromEmail,
      to: data.to,
      subject: `आपली गावाची वेबसाइट तयार आहे - ${data.subdomain}.mahagp.in`,
      text: emailContent,
      html: htmlContent
    };

    console.log('📤 Sending subdomain email with options:', { 
      from: mailOptions.from, 
      to: mailOptions.to, 
      subject: mailOptions.subject 
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Subdomain email sent successfully:', {
      messageId: result.messageId,
      response: result.response,
      accepted: result.accepted,
      rejected: result.rejected,
      timestamp: new Date().toISOString()
    });
    
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Subdomain email sending failed:', {
      error: error?.message || 'Unknown error',
      code: error?.code,
      command: error?.command,
      response: error?.response,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    });
    
    // Provide more specific error messages
    let errorMessage = 'Email sending failed';
    if (error?.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your email credentials.';
    } else if (error?.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Please check your SMTP configuration.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    // Don't throw error, just log it so registration doesn't fail
    return { success: false, error: errorMessage };
  }
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  try {
    console.log('📧 Attempting to send password reset email:', {
      to: data.to,
      username: data.username,
      subdomain: data.subdomain || 'main',
      timestamp: new Date().toISOString()
    });
    
    // Validate email configuration before proceeding
    const configCheck = validateEmailConfig();
    if (!configCheck.isValid) {
      const errorMsg = configCheck.error || 'Email service not configured';
      console.error('❌ Email configuration validation failed:', errorMsg);
      return { success: false, error: errorMsg };
    }
    console.log(`✅ Email configuration valid (${configCheck.configType})`);
    
    const transporter = createTransporter();
    
    // Verify connection configuration
    console.log('🔗 Verifying SMTP connection...');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('❌ SMTP connection verification failed:', {
        error: verifyError?.message,
        code: verifyError?.code,
        command: verifyError?.command,
        response: verifyError?.response
      });
      return { 
        success: false, 
        error: `SMTP connection failed: ${verifyError?.message || 'Unknown error'}` 
      };
    }
    
    // Determine the base URL based on subdomain
    const baseUrl = data.subdomain 
      ? `https://${data.subdomain}.mahagp.in`
      : (process.env.NEXTAUTH_URL || 'https://mahagp.in');
    
    const resetLink = `${baseUrl}/admin-reset-password?token=${data.resetToken}`;
    
    const emailContent = `
      प्रिय ${data.username},
      
      आपण पासवर्ड रीसेट करण्याची विनंती केली आहे.
      
      आपला पासवर्ड रीसेट करण्यासाठी खालील लिंकवर क्लिक करा:
      ${resetLink}
      
      हा लिंक 1 तासासाठी वैध आहे.
      
      जर आपण ही विनंती केली नसेल, तर कृपया या ईमेलकडे दुर्लक्ष करा.
      
      Best regards,
      MahaGP Team
    `;

    const htmlContent = generatePasswordResetEmailHTML(data, resetLink);

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.GMAIL_USER || 'admin@mahagp.in';
    
    const mailOptions = {
      from: fromEmail,
      to: data.to,
      subject: 'पासवर्ड रीसेट - ग्रामपंचायत प्रशासन',
      text: emailContent,
      html: htmlContent
    };

    console.log('📤 Sending password reset email with options:', { 
      from: mailOptions.from, 
      to: mailOptions.to,
      subject: mailOptions.subject,
      resetLink: resetLink.substring(0, 50) + '...' // Log partial link for debugging
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', {
      messageId: result.messageId,
      response: result.response,
      accepted: result.accepted,
      rejected: result.rejected,
      timestamp: new Date().toISOString()
    });
    
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Password reset email sending failed:', {
      error: error?.message || 'Unknown error',
      code: error?.code,
      command: error?.command,
      response: error?.response,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    });
    
    // Provide more specific error messages
    let errorMessage = 'Email sending failed';
    if (error?.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your email credentials.';
    } else if (error?.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to email server. Please check your SMTP configuration.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
}

// Generate HTML email template for password reset
function generatePasswordResetEmailHTML(data: PasswordResetEmailData, resetLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 पासवर्ड रीसेट</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">ग्रामपंचायत प्रशासन</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">प्रिय ${data.username},</p>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          आपण आपला पासवर्ड रीसेट करण्याची विनंती केली आहे. आपला पासवर्ड रीसेट करण्यासाठी खालील बटणावर क्लिक करा:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            पासवर्ड रीसेट करा
          </a>
        </div>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            <strong>किंवा</strong> खालील लिंक कॉपी करा आणि आपल्या ब्राउझरमध्ये पेस्ट करा:
          </p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af; word-break: break-all;">
            ${resetLink}
          </p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">⚠️ महत्वाच्या नोट्स</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px;">
            <li style="margin-bottom: 6px;">हा लिंक 1 तासासाठी वैध आहे</li>
            <li style="margin-bottom: 6px;">लिंक वापरल्यानंतर तो अवैध होईल</li>
            <li style="margin-bottom: 6px;">जर आपण ही विनंती केली नसेल, तर कृपया या ईमेलकडे दुर्लक्ष करा</li>
            <li style="margin-bottom: 6px;">आपले खाते सुरक्षित राहील</li>
          </ul>
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

// Generate HTML email template
function generateEmailHTML(data: SubdomainEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🏛️ आपली गावाची वेबसाइट तयार आहे!</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">${data.villageName} - ग्रामपंचायत</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">प्रिय ${data.contactPerson},</p>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          अभिनंदन! आपली गावाची वेबसाइट यशस्वीरित्या तयार झाली आहे आणि सानुकूलनासाठी तयार आहे.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">🌐 Website Information</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;"><strong>Subdomain:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${data.subdomain}.mahagp.in</code></li>
            <li style="margin-bottom: 8px;"><strong>Village:</strong> ${data.villageName}</li>
            <li style="margin-bottom: 8px;"><strong>Admin URL:</strong> <a href="https://${data.subdomain}.mahagp.in/admin-login" style="color: #3b82f6; text-decoration: none;">https://${data.subdomain}.mahagp.in/admin-login</a></li>
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
          <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 18px;">🚀 पुढील पायऱ्या</h3>
          <ol style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;"><a href="https://${data.subdomain}.mahagp.in/admin-login" style="color: #10b981; text-decoration: none;">https://${data.subdomain}.mahagp.in/admin-login</a> येथे आपले व्यवस्थापक पॅनेल भेट द्या</li>
            <li style="margin-bottom: 8px;">वरील क्रेडेन्शियल्ससह लॉगिन करा</li>
            <li style="margin-bottom: 8px;">आपली गावाची वेबसाइट सानुकूलित करण्यास सुरुवात करा</li>
            <li style="margin-bottom: 8px;">आपल्या गावाची माहिती, घोषणा आणि चित्रे जोडा</li>
            <li style="margin-bottom: 8px;">आपल्या गावाची आकडेवारी आणि तपशील कॉन्फिगर करा</li>
          </ol>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">⚠️ महत्वाच्या नोट्स</h3>
          <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px;">
            <li style="margin-bottom: 6px;">सुरक्षेसाठी कृपया पहिल्या लॉगिननंतर आपला पासवर्ड बदला</li>
            <li style="margin-bottom: 6px;">DNS कॉन्फिगर केल्यानंतर आपली वेबसाइट लाइव्ह होईल</li>
            <li style="margin-bottom: 6px;">आपल्याला कोणतीही मदत हवी असल्यास समर्थनाशी संपर्क साधा</li>
            <li style="margin-bottom: 6px;">आपले लॉगिन क्रेडेन्शियल्स सुरक्षित ठेवा</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="https://${data.subdomain}.mahagp.in/admin-login" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access Your Admin Panel</a>
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