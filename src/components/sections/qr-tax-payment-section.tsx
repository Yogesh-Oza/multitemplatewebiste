'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, IndianRupee, CheckCircle, FileText, Send, Receipt } from 'lucide-react';

interface QRCodeSettings {
  propertyTaxQrData: string;
  waterTaxQrData: string;
  propertyTaxInstruction: string;
  waterTaxInstruction: string;
}

export function QRTaxPaymentSection() {
  const [settings, setSettings] = useState<QRCodeSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/qr-code-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          // Fallback to default settings
          setSettings({
            propertyTaxQrData: 'upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Property Tax',
            waterTaxQrData: 'upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Water Tax',
            propertyTaxInstruction: '(घरपट्टि QR code वरुन रक्कम भरलेनंतर त्याचा screen shot व UTR number, दिनांक ग्रामपंचायतीकडे पाठवावा.)',
            waterTaxInstruction: '(पाणीपट्टि QR code वरुन रक्कम भरलेनंतर त्याचा screen shot, UTR number, दिनांक ग्रामपंचायतीकडे पाठवावा.)',
          });
        }
      } catch (error) {
        console.error('Error fetching QR code settings:', error);
        // Fallback to default settings
        setSettings({
          propertyTaxQrData: 'upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Property Tax',
          waterTaxQrData: 'upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Water Tax',
          propertyTaxInstruction: '(घरपट्टि QR code वरुन रक्कम भरलेनंतर त्याचा screen shot व UTR number, दिनांक ग्रामपंचायतीकडे पाठवावा.)',
          waterTaxInstruction: '(पाणीपट्टि QR code वरुन रक्कम भरलेनंतर त्याचा screen shot, UTR number, दिनांक ग्रामपंचायतीकडे पाठवावा.)',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading || !settings) {
    return (
      <section className="relative py-16 bg-gradient-to-br from-emerald-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-2 text-gray-600">लोड होत आहे...</span>
          </div>
        </div>
      </section>
    );
  }

  // Property Tax QR Code (left side)
  const propertyTaxQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(settings.propertyTaxQrData)}`;

  // Water Tax QR Code (right side)
  const waterTaxQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(settings.waterTaxQrData)}`;

  return (
    <section className="relative py-16 bg-gradient-to-br from-emerald-50 to-blue-50 overflow-hidden">
      {/* Thin pillars */}
      <div className="pointer-events-none absolute inset-0 flex justify-center gap-24 opacity-30">
        <div className="w-px bg-gradient-to-b from-transparent via-emerald-300 to-transparent" />
        <div className="w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent" />
        <div className="w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow">
            <QrCode className="h-6 w-6 text-emerald-700" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">QR कोडद्वारे कर भरा (डेमो)</h2>
          </div>
          <p className="mt-3 text-gray-600">मालमत्ता कर / पाणी कर सहज, सुरक्षित आणि जलद पद्धतीने</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Property Tax QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">मालमत्ता कर, देणगी इं. भरणेसाठी QR Code</h3>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-xl border bg-white p-4">
                <img 
                  src={propertyTaxQrUrl} 
                  alt="Property Tax QR Code" 
                  width={220} 
                  height={220} 
                  className="h-[220px] w-[220px] object-contain" 
                />
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
                {settings.propertyTaxInstruction}
              </p>
            </div>
          </motion.div>

          {/* Middle - Steps Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700 flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">स्टेप १</h4>
                    <p className="text-sm text-gray-600">तुम्हाला घरपट्टि भरणा करावयाची आहे का पाणीपट्टि हे ठरवा.</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 flex-shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">स्टेप २</h4>
                    <p className="text-sm text-gray-600">घरपट्टि किंवा पाणीपट्टि करीता भरावयाच्या रक्कमेचा तपशील Website किंवा ग्रामपंचायतीकडुन प्राप्त करा.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">स्टेप ३</h4>
                    <p className="text-sm text-gray-600">घरपट्टि करीता डावी बाजुचा (Left side) QR Code आपल्या UPI अॅप मधून स्कॅन करा व रक्कम भरा. पाणीपट्टि करीता उजव्या बाजुचा (Right Side) QR Code आपल्या UPI अॅप मधून स्कॅन करा व रक्कम भरा.</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-700 flex-shrink-0">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">स्टेप ४</h4>
                    <p className="text-sm text-gray-600">घरपट्टि धारक नाव, भरणारेचे नाव, दिनांक, UTR क्रमांक, दिनांक या बाबी नमुद करुन ग्राम पंचायतीस कळवा.</p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 flex-shrink-0">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">स्टेप ५</h4>
                    <p className="text-sm text-gray-600">ग्राम पंचायतीकडुन घरपट्टि किंवा पाणीपट्टि पावती मिळवा.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Water Tax QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">पाणीपट्टि फि, पाणी अनामत इं. भरणेसाठी QR Code</h3>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-xl border bg-white p-4">
                <img 
                  src={waterTaxQrUrl} 
                  alt="Water Tax QR Code" 
                  width={220} 
                  height={220} 
                  className="h-[220px] w-[220px] object-contain" 
                />
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
                {settings.waterTaxInstruction}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default QRTaxPaymentSection;


