'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Music, Camera, BookOpen, Users, Calendar, MapPin, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CulturalHeritageItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const TRADITIONAL_ARTS = [
  {
    name: 'भजन-कीर्तन',
    description: 'परंपरागत भक्तीगीतांचे गायन',
    icon: Music,
  },
  {
    name: 'लोकगीत',
    description: 'गावातील पारंपरिक गीतांचे संग्रह',
    icon: BookOpen,
  },
  {
    name: 'लोककला',
    description: 'परंपरागत चित्रकला आणि शिल्पकला',
    icon: Palette,
  },
  {
    name: 'सांस्कृतिक दस्तऐवज',
    description: 'गावाच्या इतिहासाचे फोटो आणि दस्तऐवज',
    icon: Camera,
  },
];

export function CulturalHeritageSection() {
  const [heritageItems, setHeritageItems] = useState<CulturalHeritageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeritageItems = async () => {
      try {
        const response = await fetch('/api/cultural-heritage');
        if (response.ok) {
          const data = await response.json();
          setHeritageItems(data.filter((item: CulturalHeritageItem) => item.isActive));
        }
      } catch (error) {
        console.error('Error fetching cultural heritage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeritageItems();
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


  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
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
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-600 text-white mr-4">
              <Palette className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              सांस्कृतिक वारसा
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            गावाच्या समृद्ध सांस्कृतिक वारशाचे संवर्धन आणि प्रदर्शन. परंपरागत कला, उत्सव आणि सांस्कृतिक कार्यक्रम.
          </p>
        </motion.div>

        {/* Cultural Heritage Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-56 w-full rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded mb-4"></div>
                <div className="bg-gray-200 h-3 w-full rounded"></div>
              </div>
            ))
          ) : heritageItems.length > 0 ? (
            heritageItems.map((heritage) => (
              <motion.div key={heritage.id} variants={itemVariants}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                  <div className="relative">
                    <div className="h-56 w-full overflow-hidden">
                      <Image
                        src={heritage.image || '/images/placeholder-heritage.jpg'}
                        alt={heritage.title}
                        width={400}
                        height={220}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className="bg-orange-500 text-white border-0"
                      >
                        {heritage.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {heritage.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {heritage.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:bg-orange-50 group-hover:border-orange-200 transition-colors"
                    >
                      अधिक माहिती
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                सांस्कृतिक वारसा माहिती उपलब्ध नाही
              </div>
            </div>
          )}
        </motion.div>

        {/* Traditional Arts Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              परंपरागत कला
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              गावातील विविध परंपरागत कलांचे संवर्धन आणि प्रशिक्षण
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRADITIONAL_ARTS.map((art, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <art.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {art.name}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {art.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            asChild
          >
            <Link href="/cultural-heritage">
              सांस्कृतिक कार्यक्रम पहा
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
