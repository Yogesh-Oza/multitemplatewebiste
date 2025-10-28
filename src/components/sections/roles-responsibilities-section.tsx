'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, FileText, Home, Heart, TrendingUp, CheckCircle, Star } from 'lucide-react';

interface Role {
  title: string;
  titleEn: string;
  description: string;
  responsibilities: string[];
  icon: string;
  color: string;
}

export function RolesResponsibilitiesSection() {
  // Static roles data - in real app, this would come from API
  const roles: Role[] = [
    {
      title: 'सरपंच',
      titleEn: 'Sarpanch',
      description: 'ग्रामपंचायतचे मुख्य प्रमुख आणि निर्णय घेणारा अधिकारी',
      responsibilities: [
        'ग्रामपंचायतचे नेतृत्व आणि मार्गदर्शन',
        'सर्व निर्णयांवर अंतिम मत',
        'सरकारी योजनांची अंमलबजावणी',
        'नागरिकांच्या समस्यांचे निराकरण',
        'अर्थसंकल्पाचे व्यवस्थापन'
      ],
      icon: 'Users',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'उपसरपंच',
      titleEn: 'Up-Sarpanch',
      description: 'सरपंचाच्या अनुपस्थितीत कार्यभार सांभाळणारा अधिकारी',
      responsibilities: [
        'सरपंचाच्या अनुपस्थितीत कार्यभार',
        'सरपंचाला सहाय्य आणि सल्ला',
        'विकास कामांचे निरीक्षण',
        'नागरिकांच्या तक्रारींचे निराकरण',
        'बैठकींचे आयोजन'
      ],
      icon: 'Shield',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'ग्रामसेवक',
      titleEn: 'Gramsevak',
      description: 'ग्रामपंचायतचे प्रशासकीय अधिकारी आणि कार्यकारी',
      responsibilities: [
        'दैनंदिन प्रशासकीय कामकाज',
        'कागदपत्रांचे व्यवस्थापन',
        'सरकारी योजनांची अंमलबजावणी',
        'नागरिक सेवांची देखरेख',
        'अहवाल तयार करणे'
      ],
      icon: 'FileText',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'सदस्य',
      titleEn: 'Member',
      description: 'ग्रामपंचायतचे निर्वाचित सदस्य आणि प्रतिनिधी',
      responsibilities: [
        'ग्रामपंचायत बैठकींमध्ये सहभाग',
        'निर्णय घेण्यात सहाय्य',
        'वॉर्डच्या विकासाची जबाबदारी',
        'नागरिकांच्या समस्यांचे निराकरण',
        'सरकारी योजनांचा प्रचार'
      ],
      icon: 'Home',
      color: 'from-orange-500 to-red-600'
    }
  ];

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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="h-8 w-8" />;
      case 'Shield':
        return <Shield className="h-8 w-8" />;
      case 'FileText':
        return <FileText className="h-8 w-8" />;
      case 'Home':
        return <Home className="h-8 w-8" />;
      default:
        return <Users className="h-8 w-8" />;
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-400 rounded-full blur-2xl animate-pulse delay-500"></div>
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <Users className="h-4 w-4" />
            भूमिका व जबाबदाऱ्या
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            भूमिका व जबाबदाऱ्या - कोण काय करते
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            ग्रामपंचायतच्या प्रत्येक सदस्याची भूमिका, जबाबदाऱ्या आणि कार्यक्षेत्र
          </p>
        </motion.div>

        {/* Roles Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {roles.map((role, index) => (
            <motion.div key={role.title} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                <CardContent className="p-8">
                  {/* Role Header */}
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${role.color} text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      {getIcon(role.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                      <p className="text-sm text-gray-500 italic">{role.titleEn}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {role.description}
                  </p>

                  {/* Responsibilities */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      मुख्य जबाबदाऱ्या
                    </h4>
                    <ul className="space-y-3">
                      {role.responsibilities.map((responsibility, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {responsibility}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">सामूहिक जबाबदारी</h3>
                </div>
                <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  सर्व सदस्यांना एकत्रितपणे गावाच्या विकासासाठी काम करावे लागते. 
                  नागरिकांच्या कल्याणासाठी, सरकारी योजनांच्या यशस्वी अंमलबजावणीसाठी 
                  आणि गावाच्या प्रगतीसाठी सर्वांनी मिळून प्रयत्न करावेत.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
