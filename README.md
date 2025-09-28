# ग्रामपंचायत वेबसाइट

एक आधुनिक, प्रतिसादी आणि SEO-अनुकूलित ग्रामपंचायत वेबसाइट Next.js 14+, TypeScript, Tailwind CSS आणि shadcn/ui वापरून तयार केली आहे.

## ✨ वैशिष्ट्ये

- 🚀 **Next.js 14+** - App Router सह आधुनिक React फ्रेमवर्क
- 🎨 **Tailwind CSS** - उत्कृष्ट डिझाइन सिस्टम
- 🧩 **shadcn/ui** - पुनर्वापरक्षम UI घटक
- 📱 **प्रतिसादी डिझाइन** - सर्व डिव्हाइसेसवर उत्कृष्ट अनुभव
- 🌐 **बहुभाषिक समर्थन** - मराठी आणि इंग्रजी
- 🔍 **SEO अनुकूलित** - शोध इंजिनांसाठी अनुकूलित
- ♿ **प्रवेशक्षमता** - सर्व वापरकर्त्यांसाठी समावेशक
- 🎭 **Framer Motion** - गुळगुळीत अॅनिमेशन
- 🎯 **TypeScript** - प्रकार सुरक्षा

## 🛠️ तंत्रज्ञान स्टॅक

- **Frontend**: Next.js 14+, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter, Noto Sans Devanagari
- **Deployment**: Vercel (अनुशंसित)

## 🚀 स्थापना

### आवश्यकता
- Node.js 18+ 
- npm किंवा yarn

### चरण 1: रिपॉजिटरी क्लोन करा
```bash
git clone <repository-url>
cd gram-panchayat-website
```

### चरण 2: अवलंबित्वे स्थापित करा
```bash
npm install
# किंवा
yarn install
```

### चरण 3: विकास सर्व्हर सुरू करा
```bash
npm run dev
# किंवा
yarn dev
```

वेबसाइट `http://localhost:3000` वर उपलब्ध असेल.

## 📁 प्रकल्प संरचना

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # मुख्य लेआउट
│   ├── page.tsx           # मुख्य पृष्ठ
│   └── globals.css        # ग्लोबल स्टाइल्स
├── components/            # React घटक
│   ├── layout/            # लेआउट घटक
│   │   ├── header.tsx     # हेडर
│   │   └── footer.tsx     # फुटर
│   ├── sections/          # पृष्ठ विभाग
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   └── history-section.tsx
│   └── ui/                # shadcn/ui घटक
├── lib/                   # उपयुक्तता फंक्शन्स
│   ├── constants.ts       # स्थिरांक
│   └── utils.ts          # सामान्य उपयुक्तता
└── public/               # स्थिर फाइल्स
    └── images/           # प्रतिमा
```

## 🎨 घटक

### मुख्य घटक
- **Header**: नेव्हिगेशन आणि मोबाइल मेनू
- **Hero Section**: मुख्य बॅनर आणि इमेज स्लायडर
- **About Section**: गावाची माहिती आणि आकडेवारी
- **History Section**: गावाचा इतिहास आणि टाइमलाइन
- **Footer**: संपर्क माहिती आणि लिंक्स

### UI घटक (shadcn/ui)
- Button
- Card
- Navigation Menu
- Sheet (Mobile Menu)
- Badge

## 🌐 बहुभाषिक समर्थन

वेबसाइट मराठी आणि इंग्रजी भाषांना समर्थन देते:
- Google Translate API एकीकरण
- देवनागरी फॉन्ट समर्थन
- भाषा स्विचर

## 🔍 SEO अनुकूलन

- मेटाडेटा API वापरून SEO
- Open Graph आणि Twitter Cards
- स्ट्रक्चर्ड डेटा
- सिमेंटिक HTML
- प्रतिमा अनुकूलन

## 📱 प्रतिसादी डिझाइन

- मोबाइल-प्रथम दृष्टिकोन
- टॅब्लेट आणि डेस्कटॉप समर्थन
- टच-फ्रेंडली इंटरफेस
- ऑप्टिमाइज्ड प्रतिमा

## ♿ प्रवेशक्षमता

- ARIA लेबल्स
- कीबोर्ड नेव्हिगेशन
- स्क्रीन रीडर समर्थन
- उच्च कॉन्ट्रास्ट मोड
- कमी गतीची प्राधान्यता

## 🚀 तैनाती

### Vercel (अनुशंसित)
```bash
npm install -g vercel
vercel
```

### इतर प्लॅटफॉर्म्स
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🧪 चाचणी

```bash
# प्रकार चाचणी
npm run type-check

# Linting
npm run lint

# बिल्ड चाचणी
npm run build
```

## 📈 कार्यक्षमता

- Next.js Image अनुकूलन
- कोड स्प्लिटिंग
- लेझी लोडिंग
- स्टॅटिक जनरेशन
- CDN समर्थन

## 🔧 कॉन्फिगरेशन

### Environment Variables
```env
NEXT_PUBLIC_SITE_URL=https://grampanchayat.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Tailwind कॉन्फिगरेशन
- कस्टम रंग
- अॅनिमेशन
- फॉन्ट फॅमिली
- स्पेसिंग

## 🤝 योगदान

1. फोर्क करा
2. फीचर ब्रँच तयार करा (`git checkout -b feature/amazing-feature`)
3. बदल कमिट करा (`git commit -m 'Add amazing feature'`)
4. ब्रँच पुश करा (`git push origin feature/amazing-feature`)
5. Pull Request तयार करा

## 📄 परवाना

हा प्रकल्प MIT परवान्याखाली आहे.

## 📞 संपर्क

- वेबसाइट: [grampanchayat.com](https://grampanchayat.com)
- ईमेल: info@grampanchayat.com
- फोन: +91 12345 67890

---

**निर्मित**: ग्रामपंचायत टीम  
**तंत्रज्ञान**: Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui