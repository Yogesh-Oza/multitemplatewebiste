'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Building2, ExternalLink, Crown, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

type Leader = {
  id: string;
  role: string;
  roleEn: string;
  name: string;
  imageUrl: string;
  isActive?: boolean;
  order?: number;
};

export function LeadersHierarchySection() {
  const [leadersData, setLeadersData] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch('/api/leaders');
        if (response.ok) {
          const data = await response.json();
          // Filter only active leaders and sort by order
          const activeLeaders = data
            .filter((leader: Leader) => leader.isActive !== false)
            .sort((a: Leader, b: Leader) => (a.order || 0) - (b.order || 0));
          setLeadersData(activeLeaders);
        }
      } catch (error) {
        console.error('Error fetching leaders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaders();
  }, []);
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">लोड होत आहे...</span>
          </div>
        ) : leadersData.length === 0 ? (
          <div className="text-center py-12">
            <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">अजून कोणतेही नेते जोडलेले नाहीत</p>
          </div>
        ) : (
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
        )}

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


