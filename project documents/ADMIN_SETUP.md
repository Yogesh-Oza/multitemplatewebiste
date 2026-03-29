# ग्रामपंचायत वेबसाइट - प्रशासन पैनल

## 🚀 स्थापना आणि सेटअप

### 1. डेटाबेस सेटअप

```bash
# MongoDB कनेक्शन स्ट्रिंग सेट करा
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/gram-panchayat?retryWrites=true&w=majority"
```

### 2. Prisma मायग्रेशन

```bash
# Prisma client generate करा
npx prisma generate

# Database push करा (development के लिए)
npx prisma db push
```

### 3. विकास सर्व्हर सुरू करा

```bash
npm run dev
```

## 🔐 प्रशासन पैनल

### लॉगिन URL
```
http://localhost:3000/admin/login
```

### डिफॉल्ट क्रेडेन्शियल्स
- **वापरकर्ता नाव:** admin
- **पासवर्ड:** admin123

## 📋 व्यवस्थापन विभाग

### 1. गाव माहिती (`/admin/village-info`)
- गावाची मुख्य माहिती
- आकडेवारी (कुटुंबे, लोकसंख्या, क्षेत्रफळ)
- मराठी आणि इंग्रजी वर्णन

### 2. इतिहास (`/admin/history`)
- इतिहास कार्ड व्यवस्थापन
- ग्राडिएंट रंग आणि आयकॉन
- क्रमानुसार व्यवस्थापन

### 3. सूचना (`/admin/announcements`)
- सूचना आणि जाहीराती
- प्राधान्य आणि स्थिती व्यवस्थापन
- प्रतिमा आणि वर्गीकरण

### 4. सांस्कृतिक वारसा (`/admin/cultural-heritage`)
- सांस्कृतिक माहिती
- प्रतिमा आणि वर्णन
- क्रमानुसार व्यवस्थापन

### 5. मुख्य प्रतिमा (`/admin/hero-images`)
- हीरो सेक्शन प्रतिमा
- स्लाइडर व्यवस्थापन
- क्रमानुसार व्यवस्थापन

## 🎨 वैशिष्ट्ये

### ✅ पूर्ण कार्यक्षमता
- **डायनॅमिक सामग्री:** सर्व विभाग डायनॅमिक
- **मराठी इंटरफेस:** पूर्ण मराठी भाषा समर्थन
- **प्रतिसादी डिझाइन:** मोबाइल, टॅब्लेट, डेस्कटॉप
- **SEO अनुकूलित:** शोध इंजिन अनुकूलन

### 🔧 तंत्रज्ञान स्टॅक
- **Frontend:** Next.js 14+, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** MongoDB with Prisma ORM
- **Animations:** Framer Motion
- **Icons:** Lucide React

### 📱 प्रतिसादी डिझाइन
- मोबाइल-प्रथम दृष्टिकोन
- टच-फ्रेंडली इंटरफेस
- सर्व डिव्हाइसेसवर उत्कृष्ट अनुभव

### ♿ प्रवेशक्षमता
- ARIA लेबल्स आणि रोल्स
- कीबोर्ड नेव्हिगेशन
- स्क्रीन रीडर समर्थन
- उच्च कॉन्ट्रास्ट मोड

## 🚀 तैनाती

### Vercel (अनुशंसित)
```bash
# Vercel CLI install करा
npm install -g vercel

# Deploy करा
vercel
```

### Environment Variables
```env
DATABASE_URL="your-mongodb-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

## 📞 समर्थन

- **वेबसाइट:** [grampanchayat.com](https://grampanchayat.com)
- **ईमेल:** admin@grampanchayat.com
- **फोन:** +91 12345 67890

---

**निर्मित:** ग्रामपंचायत टीम  
**तंत्रज्ञान:** Next.js 14+, TypeScript, Tailwind CSS, MongoDB, Prisma
