'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'पाणीपुरवठा बंदची सूचना',
    date: '२३ मार्च २०२४',
    description: 'गावातील पाणीपुरवठा यंत्रणेच्या देखभालीसाठी २४ मार्च रोजी पाणी बंद राहील.',
    image: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'पाणीपुरवठा',
    priority: 'high',
  },
  {
    id: 2,
    title: 'लसीकरण मोहिम',
    date: '१५ फेब्रुवारी २०२४',
    description: 'उद्या सकाळी १० पासून गावात लसीकरण शिबीर आयोजित करण्यात आले आहे.',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'आरोग्य',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'रस्त्याचे काम सुरू',
    date: '८ जानेवारी २०२४',
    description: 'मुख्य रस्त्याच्या डांबरीकरणाचे काम सुरू झाले असून ३ दिवसात पूर्ण होणार आहे.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXHzQbI8CMazDK7mcyIVO4w3rKJ7hxrAkk-FkTmqVcgj_6dvsvIpfzTMBYju6jtAgymV8&usqp=CAU',
    category: 'विकास',
    priority: 'low',
  },
] as const;

export function AnnouncementsSection() {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
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
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 text-white mr-4">
              <Megaphone className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              सूचना
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            गाव कार्यालयाकडून महत्त्वाच्या सूचना, अद्यतने आणि जाहीराती. गावसंबंधित घडामोडींची माहिती घ्या.
          </p>
        </motion.div>

        {/* Announcements Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {ANNOUNCEMENTS.map((announcement) => (
            <motion.div key={announcement.id} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="relative">
                  <div className="h-56 w-full overflow-hidden">
                    <Image
                      src={announcement.image}
                      alt={announcement.title}
                      width={400}
                      height={220}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className={`${getPriorityColor(announcement.priority)} text-white border-0`}
                    >
                      {announcement.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {announcement.title}
                  </h3>
                  
                  <div className="flex items-center justify-center mb-3 text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{announcement.date}</span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {announcement.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-purple-50 group-hover:border-purple-200 transition-colors"
                  >
                    अधिक माहिती
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            asChild
          >
            <Link href="/announcements">
              सर्व सूचना पहा
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
