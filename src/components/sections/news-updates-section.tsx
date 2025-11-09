'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, ExternalLink, Newspaper, TrendingUp, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsItem {
  id?: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  category: string;
  categoryColor: string;
  isUrgent?: boolean;
  isActive?: boolean;
  order?: number;
}

export function NewsUpdatesSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news-items');
        if (response.ok) {
          const data = await response.json();
          // Filter only active news items and sort by order
          const activeNews = data
            .filter((item: NewsItem) => item.isActive !== false)
            .sort((a: NewsItem, b: NewsItem) => {
              if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
              }
              return 0;
            });
          setNewsItems(activeNews);
        }
      } catch (error) {
        console.error('Error fetching news items:', error);
        // Fallback to default news
        setNewsItems([
          {
            id: '1',
            title: 'नवीन पाणी पुरवठा योजना यशस्वी',
            description: 'गावातील सर्व भागांमध्ये २४ तास पाणी पुरवठा सुनिश्चित करण्यासाठी आधुनिक पंपिंग सिस्टम स्थापना पूर्ण झाली.',
            date: '२३ मार्च २०२४',
            imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
            category: 'पायाभूत सुविधा',
            categoryColor: 'bg-blue-500',
            isUrgent: true
          },
          {
            id: '2',
            title: 'शिक्षण क्षेत्रात राज्यस्तरीय पुरस्कार',
            description: 'आमच्या गावातील प्राथमिक शाळेला डिजिटल शिक्षणातील उत्कृष्ट कामगिरीसाठी राज्य सरकारकडून सन्मान मिळाला.',
            date: '१५ फेब्रुवारी २०२४',
            imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&crop=center',
            category: 'शिक्षण',
            categoryColor: 'bg-green-500'
          },
          {
            id: '3',
            title: 'स्वच्छता अभियान मोठे यश',
            description: 'गावव्यापी स्वच्छता अभियानात ९८% कुटुंबांनी सहभाग घेतला आणि गावाला \'स्वच्छ गाव\' चा दर्जा मिळाला.',
            date: '८ जानेवारी २०२४',
            imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
            category: 'स्वच्छता',
            categoryColor: 'bg-cyan-500'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

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

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-orange-500 rounded-full blur-2xl"></div>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <Calendar className="h-4 w-4" />
            नवीन सूचना
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            ताज्या बातम्या व अद्यतन
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            गावातील महत्त्वाच्या सूचना, उपलब्धी आणि विकासाच्या नवीनतम बातम्या
          </motion.p>
        </motion.div>

        {/* News Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">लोड होत आहे...</span>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">अजून कोणतीही बातमी नाही</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          >
            {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <Card className="h-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <div className="relative">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Urgent Badge */}
                    {item.isUrgent && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 text-white animate-pulse">
                          <Star className="h-3 w-3 mr-1" />
                          तातडीचे
                        </Badge>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${item.categoryColor} text-white shadow-lg`}>
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {/* Read More Link */}
                    <Link
                      href={`/announcements#${item.id}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 group/link"
                    >
                      संपूर्ण वाचा
                      <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/announcements">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Newspaper className="h-5 w-5 mr-2" />
              सर्व बातम्या पहा
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-lg opacity-30 animate-pulse delay-1000"></div>
      </div>
    </section>
  );
}
