'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Home, MapPin, TrendingUp, ChevronRight } from 'lucide-react';
import { useVillageInfo } from '@/hooks/useVillageInfo';

interface Stat {
  value: string;
  label: string;
  labelEn: string;
  icon: string;
}

interface VillageInfo {
  id: string;
  title: string;
  description: string;
  titleEn: string;
  descriptionEn: string;
  stats: Stat[];
}

export function AboutSection() {
  const { villageInfo, loading, error } = useVillageInfo();

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container">
          <div className="text-center">
            <p className="text-red-600">गावाची माहिती लोड करताना त्रुटी आली</p>
          </div>
        </div>
      </section>
    );
  }

  if (!villageInfo) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container">
          <div className="text-center">
            <p className="text-gray-600">गावाची माहिती उपलब्ध नाही</p>
          </div>
        </div>
      </section>
    );
  }

  // Use dynamic stats from villageInfo or fallback to default
  const villageStats = villageInfo?.stats && villageInfo.stats.length > 0 
    ? villageInfo.stats 
    : [
        {
          icon: '👨‍👩‍👧‍👦',
          value: '227',
          label: 'कुटुंबे',
          labelEn: 'Families'
        },
        {
          icon: '👥',
          value: '1958',
          label: 'लोकसंख्या',
          labelEn: 'Population'
        },
        {
          icon: '🏛️',
          value: '1',
          label: 'ग्रामपंचायत',
          labelEn: 'Gram Panchayat'
        },
        {
          icon: '🌾',
          value: '654.455',
          label: 'क्षेत्रफळ (हेक्टर)',
          labelEn: 'Area (Hectares)'
        }
      ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white mr-4">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {villageInfo.title || 'आमच्या गावाबद्दल'}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {villageInfo.description || 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख'}
          </p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {villageStats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-100 to-purple-100">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.labelEn}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white mr-4">
                    <Home className="h-6 w-6" />
                  </div>
              <h3 className="text-xl font-bold text-gray-900">{villageInfo.sectionOneTitle || 'आमचे गाव'}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{villageInfo.sectionOneBody || 'आमचे गाव एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गाव आहे. येथे सर्व जाती-धर्माचे लोक एकत्रित राहतात आणि सामूहिक विकासासाठी काम करतात.'}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
              <h3 className="text-xl font-bold text-gray-900">{villageInfo.sectionTwoTitle || 'स्थान'}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{villageInfo.sectionTwoBody || 'आमचे गाव महाराष्ट्र राज्यातील एक महत्त्वाचे गाव आहे. येथे सुंदर निसर्ग, समृद्ध संस्कृती आणि मैत्रीपूर्ण वातावरण आहे.'}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white mr-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
              <h3 className="text-xl font-bold text-gray-900">{villageInfo.sectionThreeTitle || 'विकास'}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{villageInfo.sectionThreeBody || 'आमच्या गावाचा सतत विकास होत आहे. शिक्षण, आरोग्य, रोजगार आणि मूलभूत सुविधांसाठी सर्व प्रयत्न केले जात आहेत.'}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>


        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
            अधिक जाणून घ्या
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
