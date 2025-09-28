'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, BookOpen, Users, ChevronRight, TrendingUp, Palette } from 'lucide-react';
import { HISTORY_CARDS } from '@/lib/constants';

export function HistorySection() {
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className="py-20 bg-white">
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
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white mr-4">
              <History className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              आमचा इतिहास
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            आमच्या गावाचा समृद्ध इतिहास, परंपरा आणि सांस्कृतिक वारसा
          </p>
        </motion.div>

        {/* History Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {HISTORY_CARDS.map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardContent className="p-0 h-full">
                  <div className={`h-48 bg-gradient-to-br ${card.gradient} rounded-t-lg flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">
                        {card.icon === 'BookOpen' && <BookOpen className="h-16 w-16 mx-auto" />}
                        {card.icon === 'Palette' && <Palette className="h-16 w-16 mx-auto" />}
                        {card.icon === 'TrendingUp' && <TrendingUp className="h-16 w-16 mx-auto" />}
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {card.description}
                    </p>
                    <div className="text-sm text-gray-500 italic">
                      {card.titleEn}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">काळाचा प्रवास</h3>
            <p className="text-lg text-gray-600">गावाच्या विकासाची मुख्य टप्पे</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {[
                {
                  year: '1950',
                  title: 'गावाची स्थापना',
                  description: 'आमच्या गावाची स्थापना आणि पहिले निवासी',
                  side: 'left',
                },
                {
                  year: '1970',
                  title: 'पहिली ग्रामपंचायत',
                  description: 'लोकशाही व्यवस्थेची सुरुवात आणि स्थानिक स्वराज्य',
                  side: 'right',
                },
                {
                  year: '1990',
                  title: 'शिक्षणाची सुरुवात',
                  description: 'पहिले शाळा आणि शिक्षणाच्या सुविधांची सुरुवात',
                  side: 'left',
                },
                {
                  year: '2010',
                  title: 'डिजिटल युग',
                  description: 'तंत्रज्ञानाचा वापर आणि आधुनिकीकरण',
                  side: 'right',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: item.side === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex items-center ${
                    item.side === 'left' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${item.side === 'left' ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 text-lg rounded-full"
          >
            संपूर्ण इतिहास पहा
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
