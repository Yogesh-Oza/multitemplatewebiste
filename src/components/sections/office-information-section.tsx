'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone, Mail, Building, Users, Calendar, Shield } from 'lucide-react';

interface OfficeDetails {
  address: string;
  addressEn: string;
  phone: string;
  email: string;
  workingHours: string;
  workingHoursEn: string;
  importantNotice?: string;
  importantNoticeEn?: string;
}

interface OfficeInformationSectionProps {
  officeDetails?: OfficeDetails | null;
}

export function OfficeInformationSection({ officeDetails: propOfficeDetails }: OfficeInformationSectionProps) {
  // Demo/fallback office data
  const demoOfficeDetails: OfficeDetails = {
    address: 'ग्रामपंचायत कार्यालय, गाव, तालुका, जिल्हा, महाराष्ट्र, भारत - ४११००१',
    addressEn: 'Gram Panchayat Office, Village, Taluka, District, Maharashtra, India - 411001',
    phone: '+91 12345 67890',
    email: 'info@grampanchayat.com',
    workingHours: 'सोमवार ते शनिवार: सकाळी ९:०० ते संध्याकाळी ६:००',
    workingHoursEn: 'Monday to Saturday: 9:00 AM to 6:00 PM',
    importantNotice: 'ग्रामपंचायत कार्यालयात येण्यापूर्वी कृपया संपर्क करा. आपत्कालीन प्रसंगी २४ तास संपर्क सुविधा उपलब्ध आहे. सर्व कागदपत्रे आणि आवश्यक दस्तऐवज घेऊन येण्याची कृपा करा.',
    importantNoticeEn: 'Please contact before visiting the Gram Panchayat office. 24-hour contact facility is available for emergencies. Please bring all documents and necessary paperwork.'
  };

  // Use provided data or fallback to demo
  const officeDetails = propOfficeDetails || demoOfficeDetails;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <Building className="h-4 w-4" />
            कार्यालय माहिती
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            पंचायत कार्यालयाचा पत्ता, कामकाजाची वेळ आणि संपर्क माहिती
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            ग्रामपंचायत कार्यालयाची संपूर्ण माहिती आणि संपर्क तपशील
          </p>
        </motion.div>

        {/* Office Information Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Office Address */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">कार्यालयाचा पत्ता</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {officeDetails.address}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    {officeDetails.addressEn}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Working Hours */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">कामकाजाची वेळ</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {officeDetails.workingHours}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    {officeDetails.workingHoursEn}
                  </p>
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800 font-medium">
                      रविवार: सुट्टी
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">संपर्क माहिती</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <a 
                      href={`tel:${officeDetails.phone}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {officeDetails.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <a 
                      href={`mailto:${officeDetails.email}`}
                      className="text-green-600 hover:text-green-800 font-medium transition-colors"
                    >
                      {officeDetails.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-indigo-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">महत्त्वाची सूचना</h3>
                </div>
                <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  {officeDetails.importantNotice || 'ग्रामपंचायत कार्यालयात येण्यापूर्वी कृपया संपर्क करा. आपत्कालीन प्रसंगी २४ तास संपर्क सुविधा उपलब्ध आहे. सर्व कागदपत्रे आणि आवश्यक दस्तऐवज घेऊन येण्याची कृपा करा.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
