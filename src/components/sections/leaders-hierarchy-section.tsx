'use client';

import Image from 'next/image';
import { Building2, ExternalLink, Crown, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

type Leader = {
  id: string;
  role: string;
  roleEn: string;
  name: string;
  imageUrl: string;
};

const leadersData: Leader[] = [
  {
    id: 'cm',
    role: 'मा. मुख्यमंत्री',
    roleEn: 'Hon’ble Chief Minister',
    name: 'Shri. Devendra Fadnavis',
    imageUrl:
      'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/20241226554268834.png',
  },
  {
    id: 'dcm-eknath',
    role: 'मा. उपमुख्यमंत्री',
    roleEn: 'Hon’ble Deputy Chief Minister',
    name: 'Shri. Eknath Shinde',
    imageUrl:
      'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/20241210519881483.jpeg',
  },
  {
    id: 'dcm-ajit',
    role: 'मा. उपमुख्यमंत्री',
    roleEn: 'Hon’ble Deputy Chief Minister',
    name: 'Shri. Ajit Pawar',
    imageUrl:
      'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/09/202409281433179732.jpeg',
  },
  {
    id: 'minister-rd',
    role: 'मा. मंत्री, ग्रामविकास व पंचायतराज',
    roleEn: 'Hon’ble Minister, Rural Development & PR',
    name: 'Shri. Jayakumar Gore',
    imageUrl:
      'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/20241226862517803.png',
  },
  {
    id: 'mos-rd',
    role: 'मा. राज्यमंत्री, ग्रामविकास व पंचायतराज',
    roleEn: 'Hon’ble MoS, Rural Development & PR',
    name: 'Shri. Yogesh Kadam',
    imageUrl:
      'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/202412271839437941.png',
  },
  {
    id: 'ps-rd',
    role: 'प्रमुख सचिव, ग्रामविकास व पंचायतराज',
    roleEn: 'Principal Secretary, Rural Development & PR',
    name: 'Shri. Eknath Dawale',
    imageUrl:
      'https://cdnbbsr.s3waas.gov.in/s3e6c2dc3dee4a51dcec3a876aa2339a78/uploads/2024/12/202412261951170016.png',
  },
];

export function LeadersHierarchySection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Thin pillars (decorative) */}
      <div className="pointer-events-none absolute inset-0 flex justify-center gap-24 opacity-30">
        <div className="w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent"></div>
        <div className="w-px bg-gradient-to-b from-transparent via-emerald-300 to-transparent"></div>
        <div className="w-px bg-gradient-to-b from-transparent via-indigo-300 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* External notice box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900 shadow-sm"
          role="note"
          aria-label="External notice"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-blue-600/10 p-2 text-blue-700">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-sm md:text-base">
              Click here to download →{' '}
              <a
                href="https://drive.google.com/file/d/1RXIpQEH07J7MyI-ZYKkrq2wuoEoctHzz/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  // eslint-disable-next-line no-alert
                  if (!confirm('You are being redirected to an external website. Please note that Rural Development and Panchayat Raj Department cannot be held responsible for external websites content & privacy policies.')) {
                    e.preventDefault();
                  }
                }}
                className="inline-flex items-center gap-1 font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
                aria-label="Awaas Mitra Application - External site that opens in a new window"
              >
                Awaas Mitra Application <ExternalLink className="h-4 w-4" />
              </a>
            </p>
          </div>
        </motion.div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow">
            <Crown className="h-6 w-6 text-blue-700" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">आपले नेते व पदसोपान रचना</h2>
          </div>
          <p className="mt-3 text-gray-600">मा. मुख्यमंत्री, मा. उपमुख्यमंत्री, मंत्रीमंडळ आणि संबंधित विभागीय अधिकारी</p>
        </motion.div>

        {/* All Leaders in Single Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leadersData.map((leader, idx) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group w-full rounded-2xl bg-white p-6 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full ring-4 ring-blue-100">
                  <Image src={leader.imageUrl} alt={leader.name} fill className="object-cover" />
                </div>
                <span className="text-sm text-blue-700 font-semibold">{leader.role}</span>
                <h3 className="mt-1 text-lg font-bold text-gray-900">{leader.name}</h3>
                <span className="text-xs text-gray-500">{leader.roleEn}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <Users className="h-4 w-4" />
          <span>संस्थेची पदसोपान रचना अद्ययावत प्रदर्शित</span>
          <Shield className="h-4 w-4" />
        </div>
      </div>
    </section>
  );
}

export default LeadersHierarchySection;


