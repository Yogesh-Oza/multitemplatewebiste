'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Eye, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BeforeAfterItem {
  id: string;
  title: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  descriptionEn: string;
  impact: string;
  impactEn: string;
  year: string;
  cost: string;
  category: string;
}

export function EnhancedBeforeAfterSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBefore, setShowBefore] = useState(true);
  const [beforeAfterData, setBeforeAfterData] = useState<BeforeAfterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default before/after data
  const getDefaultData = (): BeforeAfterItem[] => [
    {
      id: 'default-1',
      title: 'रस्ते दुरुस्ती प्रकल्प',
      titleEn: 'Road Repair Project',
      beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center',
      afterImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center',
      description: 'गावातील मुख्य रस्त्यांची दुरुस्ती आणि सुधारणा',
      descriptionEn: 'Repair and improvement of main roads in the village',
      impact: 'रस्ते सुधारले, वाहतूक सुगम झाली, दुर्घटना कमी झाल्या',
      impactEn: 'Roads improved, traffic became smoother, accidents reduced',
      year: '२०२३',
      cost: '₹२५ लाख',
      category: 'पायाभूत सुविधा'
    }
  ];

  // Fetch before/after data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/before-after-gallery');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            // Map API data to component format
            const mappedData: BeforeAfterItem[] = data.map((item: any) => ({
              id: item.id,
              title: item.title,
              titleEn: item.titleEn,
              beforeImage: item.beforeImage,
              afterImage: item.afterImage,
              description: item.description,
              descriptionEn: item.descriptionEn,
              impact: item.impact,
              impactEn: item.impactEn,
              year: item.year,
              cost: item.cost,
              category: item.category
            }));
            setBeforeAfterData(mappedData);
          } else {
            // Use default data if none exists
            setBeforeAfterData(getDefaultData());
          }
        } else {
          // Use default data on error
          setBeforeAfterData(getDefaultData());
        }
      } catch (error) {
        console.error('Error fetching before/after gallery:', error);
        // Use default data on error
        setBeforeAfterData(getDefaultData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    const dataLength = beforeAfterData.length > 0 ? beforeAfterData.length : getDefaultData().length;
    if (isPlaying && dataLength > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % dataLength);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, beforeAfterData.length]);

  // Use default data while loading or if no data exists
  const displayData = beforeAfterData.length > 0 ? beforeAfterData : getDefaultData();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayData.length) % displayData.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetToBefore = () => {
    setShowBefore(true);
  };

  const currentItem = displayData[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
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
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <Eye className="h-4 w-4" />
            पूर्वी आणि नंतर
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            पूर्वी आणि नंतर गॅलरी
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            स्लायडरद्वारे परिवर्तन दाखविणे – रस्ते, तळी, शाळा आणि इतर विकास कामे
          </p>
        </motion.div>

        {/* Enhanced Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Image Slider */}
              <div className="relative">
                <div className="relative h-96 md:h-[500px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentIndex}-${showBefore ? 'before' : 'after'}`}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={showBefore ? currentItem.beforeImage : currentItem.afterImage}
                        alt={showBefore ? 'पूर्वी' : 'नंतर'}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                      >
                        {showBefore ? 'पूर्वी' : 'नंतर'}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl md:text-2xl font-medium"
                      >
                        {currentItem.title}
                      </motion.div>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>

                  {/* Control Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlayPause}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetToBefore}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Before/After Toggle */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex bg-white/20 rounded-full p-1">
                      <Button
                        variant={showBefore ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setShowBefore(true)}
                        className="rounded-full"
                      >
                        पूर्वी
                      </Button>
                      <Button
                        variant={!showBefore ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setShowBefore(false)}
                        className="rounded-full"
                      >
                        नंतर
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Project Info */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {currentItem.title}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {currentItem.category}
                        </Badge>
                      </div>
                      <p className="text-gray-500 italic mb-4">
                        {currentItem.titleEn}
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {currentItem.description}
                      </p>

                      {/* Project Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">वर्ष</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {currentItem.year}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">खर्च</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {currentItem.cost}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Impact */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="h-6 w-6 text-green-600" />
                        <h4 className="text-xl font-bold text-gray-900">परिणाम</h4>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                        <p className="text-green-800 font-medium leading-relaxed">
                          {currentItem.impact}
                        </p>
                        <p className="text-green-600 text-sm mt-2 italic">
                          {currentItem.impactEn}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 p-4 bg-gray-50">
                {displayData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-blue-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-sm">
            स्लाइडर वापरून वेगवेगळे प्रकल्प पहा. पूर्वी आणि नंतर बटण वापरून परिवर्तन तुलना करा.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
