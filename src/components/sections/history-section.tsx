'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, BookOpen, Users, ChevronRight, TrendingUp, Palette, Globe } from 'lucide-react';
import Image from 'next/image';

interface HistoryCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  gradient: string;
  icon: string;
}

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  imageUrl?: string;
  side: string;
}

interface HistorySectionProps {
  historyCards: HistoryCard[];
  timelineItems: TimelineItem[];
}

export function HistorySection({ historyCards, timelineItems }: HistorySectionProps) {
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Demo timeline items when no data exists
  const getDemoTimelineItems = (): TimelineItem[] => [
    {
      id: 'demo-1',
      year: '1950',
      title: 'गावाची स्थापना',
      titleEn: 'Village Foundation',
      description: 'आमच्या गावाची स्थापना आणि पहिले निवासी',
      descriptionEn: 'Foundation of our village and first residents',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
      side: 'left',
    },
    {
      id: 'demo-2',
      year: '1970',
      title: 'पहिली ग्रामपंचायत',
      titleEn: 'First Gram Panchayat',
      description: 'लोकशाही व्यवस्थेची सुरुवात आणि स्थानिक स्वराज्य',
      descriptionEn: 'Beginning of democratic system and local self-governance',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
      side: 'right',
    },
    {
      id: 'demo-3',
      year: '1990',
      title: 'शिक्षणाची सुरुवात',
      titleEn: 'Education Begins',
      description: 'पहिले शाळा आणि शिक्षणाच्या सुविधांची सुरुवात',
      descriptionEn: 'First schools and beginning of educational facilities',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
      side: 'left',
    },
    {
      id: 'demo-4',
      year: '2010',
      title: 'डिजिटल युग',
      titleEn: 'Digital Era',
      description: 'तंत्रज्ञानाचा वापर आणि आधुनिकीकरण',
      descriptionEn: 'Use of technology and modernization',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      side: 'right',
    },
  ];

  const displayTimelineItems = timelineItems.length > 0 ? timelineItems : getDemoTimelineItems();

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
              {historyCards.map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardContent className="p-0 h-full">
                  <div className={`h-48 bg-gradient-to-br ${card.gradient} rounded-t-lg flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">
                        {card.icon === 'BookOpen' && <BookOpen className="h-16 w-16 mx-auto" />}
                        {card.icon === 'Palette' && <Palette className="h-16 w-16 mx-auto" />}
                        {card.icon === 'TrendingUp' && <TrendingUp className="h-16 w-16 mx-auto" />}
                        {card.icon === 'Users' && <Users className="h-16 w-16 mx-auto" />}
                        {card.icon === 'History' && <History className="h-16 w-16 mx-auto" />}
                        {card.icon === 'Globe' && <Globe className="h-16 w-16 mx-auto" />}
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
              {displayTimelineItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: item.side === 'left' ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.15,
                    type: 'spring',
                    stiffness: 100
                  }}
                  viewport={{ once: true, margin: '-100px' }}
                  className={`flex items-center ${
                    item.side === 'left' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${item.side === 'left' ? 'pr-8 text-right' : 'pl-8'}`}>
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-0 shadow-lg bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden">
                        <CardContent className="p-0">
                          {/* Image */}
                          {item.imageUrl && (
                            <motion.div
                              variants={imageVariants}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              className="relative h-48 w-full overflow-hidden"
                            >
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <div className="text-3xl font-bold text-white mb-1">{item.year}</div>
                              </div>
                            </motion.div>
                          )}
                          <div className="p-6">
                            {!item.imageUrl && (
                              <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                            )}
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            {item.titleEn && (
                              <p className="text-sm text-gray-500 italic">{item.titleEn}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                  
                  {/* Timeline Dot with Pulse Animation */}
                  <motion.div
                    variants={dotVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    animate="pulse"
                    className="relative z-10 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-xl"
                  ></motion.div>
                  
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
