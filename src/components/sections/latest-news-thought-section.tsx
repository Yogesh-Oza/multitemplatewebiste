'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Eye, 
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Building,
  Heart,
  BookOpen,
  Shield,
  TreePine,
  Home,
  Lightbulb,
  Quote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  category: string;
  image: string;
  isImportant: boolean;
  readTime: string;
  author: string;
}

interface ThoughtItem {
  id: string;
  quote: string;
  quoteEn: string;
  author: string;
  authorEn: string;
  date: string;
  category: string;
  icon: any;
}

const demoNewsItems: NewsItem[] = [
  {
    id: 'news-1',
    title: 'नवीन पाणी पुरवठा योजना यशस्वी',
    titleEn: 'New Water Supply Project Successful',
    description: 'गावातील सर्व भागांमध्ये २४ तास पाणी पुरवठा सुनिश्चित करण्यासाठी आधुनिक पंपिंग सिस्टम स्थापना पूर्ण झाली. या योजनेमुळे १२०० कुटुंबांना लाभ होणार आहे.',
    descriptionEn: 'Modern pumping system installation completed to ensure 24-hour water supply in all areas of the village. This project will benefit 1200 families.',
    date: '2024-03-23',
    category: 'पायाभूत सुविधा',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center',
    isImportant: true,
    readTime: '३ मिनिटे',
    author: 'ग्रामसेवक'
  },
  {
    id: 'news-2',
    title: 'शिक्षण क्षेत्रात राज्यस्तरीय पुरस्कार',
    titleEn: 'State Level Award in Education',
    description: 'आमच्या गावातील प्राथमिक शाळेला डिजिटल शिक्षणातील उत्कृष्ट कामगिरीसाठी राज्य सरकारकडून सन्मान मिळाला. हा पुरस्कार शिक्षक आणि विद्यार्थ्यांच्या मेहनतीचा परिणाम आहे.',
    descriptionEn: 'Our village primary school received recognition from the state government for excellent performance in digital education. This award is the result of hard work by teachers and students.',
    date: '2024-02-15',
    category: 'शिक्षण',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&crop=center',
    isImportant: false,
    readTime: '२ मिनिटे',
    author: 'शिक्षक संघ'
  },
  {
    id: 'news-3',
    title: 'स्वच्छता अभियान मोठे यश',
    titleEn: 'Sanitation Campaign Great Success',
    description: 'गावव्यापी स्वच्छता अभियानात ९८% कुटुंबांनी सहभाग घेतला आणि गावाला \'स्वच्छ गाव\' चा दर्जा मिळाला. हा दर्जा मिळविण्यासाठी सर्व नागरिकांनी मोठ्या प्रमाणात योगदान दिले.',
    descriptionEn: '98% of families participated in the village-wide sanitation campaign and the village received the \'Clean Village\' status. All citizens contributed significantly to achieve this status.',
    date: '2024-01-08',
    category: 'स्वच्छता',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&crop=center',
    isImportant: true,
    readTime: '४ मिनिटे',
    author: 'स्वच्छता समिती'
  }
];

const demoThoughtItems: ThoughtItem[] = [
  {
    id: 'thought-1',
    quote: 'ग्राम विकास म्हणजे देश विकास. प्रत्येक गावाचा विकास हा राष्ट्रीय विकासाचा पाया आहे.',
    quoteEn: 'Village development means national development. The development of every village is the foundation of national development.',
    author: 'महात्मा गांधी',
    authorEn: 'Mahatma Gandhi',
    date: '2024-03-25',
    category: 'विकास',
    icon: Building
  },
  {
    id: 'thought-2',
    quote: 'शिक्षण हे सर्वांत मोठे शस्त्र आहे ज्याद्वारे तुम्ही जग बदलू शकता.',
    quoteEn: 'Education is the most powerful weapon which you can use to change the world.',
    author: 'नेल्सन मंडेला',
    authorEn: 'Nelson Mandela',
    date: '2024-03-24',
    category: 'शिक्षण',
    icon: BookOpen
  },
  {
    id: 'thought-3',
    quote: 'स्वच्छता ही ईश्वरभक्तीच्या समान आहे. स्वच्छ राहणे हे आपले कर्तव्य आहे.',
    quoteEn: 'Cleanliness is next to godliness. Staying clean is our duty.',
    author: 'स्वामी विवेकानंद',
    authorEn: 'Swami Vivekananda',
    date: '2024-03-23',
    category: 'स्वच्छता',
    icon: Shield
  }
];

export function LatestNewsThoughtSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [thoughtItems, setThoughtItems] = useState<ThoughtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNewsItems(demoNewsItems);
      setThoughtItems(demoThoughtItems);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentThoughtIndex((prev) => (prev + 1) % thoughtItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [thoughtItems.length]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mr-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'पायाभूत सुविधा':
        return { color: 'bg-blue-100 text-blue-800', icon: Building };
      case 'शिक्षण':
        return { color: 'bg-green-100 text-green-800', icon: BookOpen };
      case 'स्वच्छता':
        return { color: 'bg-purple-100 text-purple-800', icon: Shield };
      case 'आरोग्य':
        return { color: 'bg-red-100 text-red-800', icon: Heart };
      case 'कृषी':
        return { color: 'bg-orange-100 text-orange-800', icon: TreePine };
      case 'प्रशासन':
        return { color: 'bg-gray-100 text-gray-800', icon: Home };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Building };
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">बातम्या लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mr-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              ताज्या बातम्या व अद्यतन
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            गावातील महत्त्वाच्या सूचना आणि उपलब्धी
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest News */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">नवीन सूचना आणि घोषणा</h3>
                <Button variant="outline" size="sm">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  सर्व पहा
                </Button>
              </div>

              <div className="space-y-6">
                {newsItems.map((news, index) => {
                  const categoryInfo = getCategoryInfo(news.category);
                  const CategoryIcon = categoryInfo.icon;

                  return (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="transform transition-all duration-300"
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <Badge className={categoryInfo.color}>
                                    <CategoryIcon className="h-3 w-3 mr-1" />
                                    {news.category}
                                  </Badge>
                                  {news.isImportant && (
                                    <Badge className="bg-red-100 text-red-800">
                                      <Star className="h-3 w-3 mr-1" />
                                      महत्त्वाचे
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {news.readTime}
                                </div>
                              </div>

                              <h4 className="text-xl font-bold text-gray-800 mb-3">
                                {news.title}
                              </h4>
                              <p className="text-gray-600 mb-4 line-clamp-3">
                                {news.description}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formatDate(news.date)}
                                  </span>
                                  <span>{news.author}</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedNews(news)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  संपूर्ण वाचा
                                </Button>
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Thought for the Day */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">आजचा सुविचार</h3>
              
              <AnimatePresence mode="wait">
                {thoughtItems.length > 0 && (
                  <motion.div
                    key={currentThoughtIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mb-4 inline-flex">
                            <Quote className="h-8 w-8" />
                          </div>
                          
                          <blockquote className="text-lg font-medium text-gray-800 mb-4 italic">
                            "{thoughtItems[currentThoughtIndex]?.quote}"
                          </blockquote>
                          
                          <div className="text-sm text-gray-600 mb-4">
                            - {thoughtItems[currentThoughtIndex]?.author}
                          </div>
                          
                          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(thoughtItems[currentThoughtIndex]?.date || '')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Navigation Dots */}
                    <div className="flex justify-center space-x-2 mt-4">
                      {thoughtItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentThoughtIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentThoughtIndex 
                              ? 'bg-yellow-500 w-8' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex justify-center space-x-4 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentThoughtIndex(
                          currentThoughtIndex === 0 
                            ? thoughtItems.length - 1 
                            : currentThoughtIndex - 1
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentThoughtIndex(
                          currentThoughtIndex === thoughtItems.length - 1 
                            ? 0 
                            : currentThoughtIndex + 1
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* News Modal */}
        <AnimatePresence>
          {selectedNews && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedNews(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">संपूर्ण माहिती</h3>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedNews(null)}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <img
                    src={selectedNews.image}
                    alt={selectedNews.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  
                  <h4 className="text-3xl font-bold text-gray-800 mb-4">
                    {selectedNews.title}
                  </h4>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {selectedNews.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(selectedNews.date)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedNews.readTime}
                      </span>
                      <span>{selectedNews.author}</span>
                    </div>
                    <Badge className={getCategoryInfo(selectedNews.category).color}>
                      {selectedNews.category}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
