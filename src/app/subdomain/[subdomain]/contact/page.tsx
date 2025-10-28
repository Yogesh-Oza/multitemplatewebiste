import { ContactSection } from '@/components/sections/contact-section';

export default function SubdomainContactPage() {
  return (
    <div className="min-h-screen">
      <ContactSection />

      {/* Citizen Services Quick Links */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">नागरिक सेवा (Citizen Services)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'जन्म प्रमाणपत्र', url: '#', desc: 'ऑनलाइन अर्ज करा' },
            { title: 'मृत्यू प्रमाणपत्र', url: '#', desc: 'ऑनलाइन अर्ज करा' },
            { title: 'RTS सेवा', url: '#', desc: 'राइट टू सर्व्हिस अर्ज' }
          ].map((item, idx) => (
            <a key={idx} href={item.url} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-lg font-semibold text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-600">{item.desc}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Tax Payment QR (optional) */}
      <section className="container pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">ऑनलाइन कर भरणा (Optional)</h2>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">
          <div>
            <div className="text-lg font-semibold text-gray-900">ग्रामपंचायत कर भरणा</div>
            <div className="text-sm text-gray-600">QR कोड स्कॅन करून पेमेंट करा</div>
          </div>
          <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            QR
          </div>
        </div>
      </section>
    </div>
  );
}
