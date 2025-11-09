'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Calendar, User, Star, Heart, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DailyMessage {
  id: string;
  message: string;
  authorTitle: string;
  date: string;
  category: 'inspirational' | 'development' | 'community' | 'governance';
  icon: string;
  color: string;
}

export function DailyMessageSection() {
  const [currentMessage, setCurrentMessage] = useState<DailyMessage | null>(null);

  // Static daily messages - in real app, this would come from API
  const dailyMessages: DailyMessage[] = [
    {
      id: '1',
      message: 'एकत्रित विकास, सामाजिक न्याय आणि सुशासनाच्या मार्गावर प्रगतीशील गाव बनवण्यासाठी सर्व नागरिकांचा सहभाग आवश्यक आहे.',
      authorTitle: 'सरपंच',
      date: new Date().toLocaleDateString('mr-IN'),
      category: 'governance',
      icon: 'User',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: '2',
      message: 'शिक्षण हे सर्वांत मोठे शस्त्र आहे ज्याद्वारे तुम्ही जग बदलू शकता. आपल्या मुलांना उत्तम शिक्षण द्या.',
      authorTitle: 'उपसरपंच',
      date: new Date().toLocaleDateString('mr-IN'),
      category: 'development',
      icon: 'Lightbulb',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '3',
      message: 'स्वच्छता ही आरोग्याची गुरुकिल्ली आहे. स्वच्छ गाव म्हणजे निरोगी गाव.',
      authorTitle: 'सदस्य',
      date: new Date().toLocaleDateString('mr-IN'),
      category: 'community',
      icon: 'Heart',
      color: 'from-orange-500 to-red-600'
    }
  ];

  useEffect(() => {
    // Rotate messages daily
    const today = new Date().getDate();
    const messageIndex = today % dailyMessages.length;
    setCurrentMessage(dailyMessages[messageIndex]);
  }, []);

  if (!currentMessage) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'User':
        return <User className="h-6 w-6" />;
      case 'Lightbulb':
        return <Lightbulb className="h-6 w-6" />;
      case 'Heart':
        return <Heart className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-400 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="container relative z-10">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <Calendar className="h-4 w-4" />
            आजचा सुविचार
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            आजचा सुविचार / पंचायत संदेश
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            ग्रामपंचायत नेतृत्वाकडून नागरिकांसाठी प्रेरणादायी संदेश
          </motion.p>
        </motion.div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="relative overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            {/* Decorative Quote Icon */}
            <div className="absolute top-8 left-8 text-orange-200">
              <Quote className="h-16 w-16" />
            </div>

            <CardContent className="p-8 md:p-12">
              <div className="relative z-10">
                {/* Message */}
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-medium italic text-center"
                >
                  "{currentMessage.message}"
                </motion.blockquote>

                {/* Author Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Author Avatar */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentMessage.color} flex items-center justify-center text-white shadow-lg`}>
                      {getIcon(currentMessage.icon)}
                    </div>

                    {/* Author Details */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                      {currentMessage.authorTitle}
                      </h4>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {currentMessage.date}
                  </div>
                </motion.div>

                {/* Decorative Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className={`mt-8 h-1 bg-gradient-to-r ${currentMessage.color} rounded-full`}
                ></motion.div>
              </div>
            </CardContent>

            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-orange-200 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-red-200 rounded-full animate-bounce delay-500"></div>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 text-sm">
            हा संदेश दररोज अद्यतन केला जातो
          </p>
        </motion.div>
      </div>
    </section>
  );
}
