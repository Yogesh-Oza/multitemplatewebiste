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
      प्रिय ${data.contactPerson},
      
      आपली गावाची वेबसाइट यशस्वीरित्या तयार झाली आहे!
      
      वेबसाइट माहिती:
      - सबडोमेन: ${data.subdomain}.mahagp.in
      - गाव: ${data.villageName}
      - व्यवस्थापक URL: https://${data.subdomain}.mahagp.in/admin
      
      लॉगिन क्रेडेन्शियल्स:
      - वापरकर्ता नाव: ${data.adminUsername}
      - पासवर्ड: ${data.adminPassword}
      
      पुढील पायऱ्या:
      1. https://${data.subdomain}.mahagp.in/admin येथे आपले व्यवस्थापक पॅनेल भेट द्या
      2. वरील क्रेडेन्शियल्ससह लॉगिन करा
      3. आपली गावाची वेबसाइट सानुकूलित करण्यास सुरुवात करा
      4. आपल्या गावाची माहिती, घोषणा आणि चित्रे जोडा
      
      महत्वाच्या नोट्स:
      - कृपया पहिल्या लॉगिननंतर आपला पासवर्ड बदला
      - DNS कॉन्फिगर केल्यानंतर आपली वेबसाइट लाइव्ह होईल
      - आपल्याला कोणतीही मदत हवी असल्यास समर्थनाशी संपर्क साधा
      
      शुभेच्छा,
      महागप टीम
    `;

    const htmlContent = generateEmailHTML(data);

    const mailOptions = {
      from: process.env.HOSTINGER_USER || 'admin@mahagp.in',
      to: data.to,
      subject: `आपली गावाची वेबसाइट तयार आहे - ${data.subdomain}.mahagp.in`,
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
        <h1 style="color: white; margin: 0; font-size: 28px;">🏛️ आपली गावाची वेबसाइट तयार आहे!</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">${data.villageName} - ग्रामपंचायत</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">प्रिय ${data.contactPerson},</p>
        
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          अभिनंदन! आपली गावाची वेबसाइट यशस्वीरित्या तयार झाली आहे आणि सानुकूलनासाठी तयार आहे.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">🌐 वेबसाइट माहिती</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;"><strong>सबडोमेन:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${data.subdomain}.mahagp.in</code></li>
            <li style="margin-bottom: 8px;"><strong>गाव:</strong> ${data.villageName}</li>
            <li style="margin-bottom: 8px;"><strong>व्यवस्थापक URL:</strong> <a href="https://${data.subdomain}.mahagp.in/admin" style="color: #3b82f6; text-decoration: none;">https://${data.subdomain}.mahagp.in/admin</a></li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px;">🔐 लॉगिन क्रेडेन्शियल्स</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;"><strong>वापरकर्ता नाव:</strong> <code style="background: #fbbf24; padding: 2px 6px; border-radius: 4px;">${data.adminUsername}</code></li>
            <li style="margin-bottom: 8px;"><strong>पासवर्ड:</strong> <code style="background: #fbbf24; padding: 2px 6px; border-radius: 4px;">${data.adminPassword}</code></li>
          </ul>
        </div>
        
        <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 18px;">🚀 पुढील पायऱ्या</h3>
          <ol style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;"><a href="https://${data.subdomain}.mahagp.in/admin" style="color: #10b981; text-decoration: none;">https://${data.subdomain}.mahagp.in/admin</a> येथे आपले व्यवस्थापक पॅनेल भेट द्या</li>
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
          <a href="https://${data.subdomain}.mahagp.in/admin" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">आपले व्यवस्थापक पॅनेल एक्सेस करा</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
          शुभेच्छा,<br>
          <strong>महागप टीम</strong><br>
          <em>डिजिटल ग्रामपंचायतांना सक्षम करणे</em>
        </p>
      </div>
    </div>
  `;
}