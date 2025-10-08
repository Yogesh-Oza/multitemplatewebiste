# Subdomain Website Builder Setup Guide

This guide explains how to set up the subdomain-based website builder system for your gram panchayat website.

## 🏗️ Architecture Overview

The system allows users to:
1. Register for a subdomain (e.g., `village1.mahagp.in`)
2. Receive email with admin credentials
3. Access their custom admin panel
4. Build their village website using the template

## 📋 Prerequisites

- Next.js 15+ project
- MongoDB database
- Vercel account
- Domain (mahagp.in) with DNS access
- Email service (SendGrid, Resend, or SMTP)

## 🚀 Setup Steps

### 1. Database Setup

Update your Prisma schema and run migrations:

```bash
npx prisma db push
```

### 2. Environment Variables

Create `.env.local` with:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/gram-panchayat"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

# Email Service (choose one)
# Option 1: SendGrid
SENDGRID_API_KEY="your_sendgrid_api_key"

# Option 2: Resend
RESEND_API_KEY="your_resend_api_key"

# Option 3: SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"

# Domain
MAIN_DOMAIN="mahagp.in"
```

### 3. Email Service Integration

Choose one of these options:

#### Option A: SendGrid
```bash
npm install @sendgrid/mail
```

Update `src/lib/email.ts`:
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendSubdomainEmail(data: SubdomainEmailData) {
  const msg = {
    to: data.to,
    from: 'noreply@mahagp.in',
    subject: `Your Village Website is Ready - ${data.subdomain}.mahagp.in`,
    html: generateEmailHTML(data)
  };
  
  await sgMail.send(msg);
}
```

#### Option B: Resend
```bash
npm install resend
```

Update `src/lib/email.ts`:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSubdomainEmail(data: SubdomainEmailData) {
  await resend.emails.send({
    from: 'noreply@mahagp.in',
    to: data.to,
    subject: `Your Village Website is Ready - ${data.subdomain}.mahagp.in`,
    html: generateEmailHTML(data)
  });
}
```

### 4. DNS Configuration

Configure your domain DNS to support wildcard subdomains:

#### For Vercel:
1. Go to your Vercel project settings
2. Add domain: `mahagp.in`
3. Add wildcard domain: `*.mahagp.in`
4. Update DNS records at your domain registrar:

```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME  
Name: *
Value: cname.vercel-dns.com
```

### 5. Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy the project

### 6. Testing the System

1. Visit `https://mahagp.in/subdomain-register`
2. Fill out the registration form
3. Check email for admin credentials
4. Visit `https://your-subdomain.mahagp.in/admin`
5. Login and start building your website

## 🔧 Customization Options

### Adding New Templates

1. Create new template components in `src/components/templates/`
2. Update the template selection in the registration form
3. Modify the subdomain page to use different templates

### Email Templates

Customize email templates in `src/lib/email.ts`:
- Welcome email
- Password reset
- Account activation
- Website updates

### Admin Features

Add new admin features by:
1. Creating new pages in `src/app/subdomain/[subdomain]/admin/`
2. Adding navigation items in `src/components/admin/admin-sidebar.tsx`
3. Creating corresponding API routes

## 🛡️ Security Considerations

1. **Password Hashing**: Implement proper password hashing for admin users
2. **Rate Limiting**: Add rate limiting to registration endpoint
3. **Input Validation**: Validate all user inputs
4. **CORS**: Configure CORS for API endpoints
5. **SSL**: Ensure all subdomains use HTTPS

## 📊 Monitoring & Analytics

1. Set up Vercel Analytics
2. Monitor subdomain usage
3. Track user engagement
4. Set up error monitoring with Sentry

## 🚨 Troubleshooting

### Common Issues:

1. **Subdomain not working**: Check DNS configuration
2. **Email not sending**: Verify email service credentials
3. **Database errors**: Check MongoDB connection
4. **Build failures**: Check environment variables

### Debug Commands:

```bash
# Check database connection
npx prisma db pull

# Test email service
npm run test:email

# Check build locally
npm run build
```

## 📈 Scaling Considerations

1. **Database**: Consider sharding for large numbers of subdomains
2. **CDN**: Use Vercel's global CDN for fast loading
3. **Caching**: Implement Redis for session management
4. **Monitoring**: Set up comprehensive monitoring

## 🎯 Next Steps

1. Set up automated backups
2. Implement user analytics
3. Add multi-language support
4. Create template marketplace
5. Add payment integration for premium features

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review Vercel documentation
- Contact support team

---

**Note**: This system is designed to be scalable and can handle thousands of subdomains. Make sure to monitor resource usage and implement proper caching strategies.
