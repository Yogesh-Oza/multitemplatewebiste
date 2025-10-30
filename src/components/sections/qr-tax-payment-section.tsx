'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { QrCode, CreditCard, Smartphone, ShieldCheck, IndianRupee } from 'lucide-react';

export function QRTaxPaymentSection() {
  // Demo UPI QR (replace data param with real UPI handle later)
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Property%20Tax';

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* QR Card */}
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
                <h3 className="text-lg font-semibold text-gray-900">UPI QR (डेमो)</h3>
                <p className="text-sm text-gray-600">UPI स्कॅन करून कर भरा</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-xl border bg-white p-4">
                {/* Use Image for better optimization; external host is allowed */}
                <Image src={qrUrl} alt="UPI QR" width={220} height={220} className="h-[220px] w-[220px] object-contain" />
              </div>
              <p className="mt-4 text-sm text-gray-600">डेमो UPI: gp-pay@upi (रक्कम टाका आणि पे करा)</p>
            </div>
          </motion.div>

          {/* Steps & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900">स्टेप १</h4>
                </div>
                <p className="text-sm text-gray-600">आपल्या UPI अॅप (PhonePe/Google Pay/Paytm) मधून स्कॅन करा</p>
              </div>
              {/* Step 2 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900">स्टेप २</h4>
                </div>
                <p className="text-sm text-gray-600">कर प्रकार निवडा आणि रक्कम भरा</p>
              </div>
              {/* Step 3 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900">स्टेप ३</h4>
                </div>
                <p className="text-sm text-gray-600">सुरक्षितपणे पेमेंट कंफर्म करा</p>
              </div>
              {/* Step 4 */}
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900">स्टेप ४</h4>
                </div>
                <p className="text-sm text-gray-600">पावती मिळवा व संदर्भ क्रमांक जतन करा</p>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              सूचना: हा विभाग डेमो आहे. प्रत्यक्ष पेमेंटसाठी ग्रामपंचायतकडून अधिकृत UPI हँडल वापरा.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default QRTaxPaymentSection;


