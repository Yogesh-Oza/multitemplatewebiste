'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Leaf,
  Heart,
  Briefcase,
  GraduationCap,
  Shield,
  Zap,
  Star,
  Award,
  BarChart3,
} from 'lucide-react';
import {
  DEFAULT_SANKALP_ITEMS,
  SankalpPriority,
  SankalpStatus,
  SankalpTrackerItem,
} from '@/lib/sankalp-defaults';
import { useEffect, useState } from 'react';

interface SankalpTrackerSectionProps {
  items?: SankalpTrackerItem[];
}

export function SankalpTrackerSection({ items }: SankalpTrackerSectionProps) {
  const [fetchedItems, setFetchedItems] = useState<SankalpTrackerItem[]>([]);

  useEffect(() => {
    if (items && items.length > 0) {
      setFetchedItems([]);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/sankalp-items');
        if (response.ok) {
          const data = await response.json();
          setFetchedItems(
            data.length > 0
              ? data
              : DEFAULT_SANKALP_ITEMS
          );
        } else {
          setFetchedItems(DEFAULT_SANKALP_ITEMS);
        }
      } catch (error) {
        console.error('Error fetching Sankalp tracker data:', error);
        setFetchedItems(DEFAULT_SANKALP_ITEMS);
      }
    };

    if (!items) {
      fetchData();
    }
  }, [items]);

  const displayItems =
    items && items.length > 0
      ? items
      : fetchedItems.length > 0
        ? fetchedItems
        : DEFAULT_SANKALP_ITEMS;

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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="h-6 w-6" />;
      case 'BookOpen':
        return <BookOpen className="h-6 w-6" />;
      case 'Zap':
        return <Zap className="h-6 w-6" />;
      case 'GraduationCap':
        return <GraduationCap className="h-6 w-6" />;
      case 'Heart':
        return <Heart className="h-6 w-6" />;
      case 'Briefcase':
        return <Briefcase className="h-6 w-6" />;
      case 'Users':
        return <Users className="h-6 w-6" />;
      case 'TrendingUp':
        return <TrendingUp className="h-6 w-6" />;
      case 'Leaf':
        return <Leaf className="h-6 w-6" />;
      case 'Award':
        return <Award className="h-6 w-6" />;
      default:
        return <Target className="h-6 w-6" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <Target className="h-5 w-5 text-gray-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'उच्च';
      case 'medium':
        return 'मध्यम';
      case 'low':
        return 'कमी';
      default:
        return 'सामान्य';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'पूर्ण';
      case 'in-progress':
        return 'चालू';
      case 'pending':
        return 'प्रलंबित';
      default:
        return 'अज्ञात';
    }
  };

  // Calculate overall progress
  const activeItems = displayItems.filter((item) => item.isActive !== false);
  const overallProgress =
    activeItems.length > 0
      ? Math.round(
          activeItems.reduce(
            (sum, item) => sum + (item.currentValue / item.targetValue) * 100,
            0
          ) / activeItems.length
        )
      : 0;

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-400 rounded-full blur-2xl animate-pulse delay-500"></div>
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <Target className="h-4 w-4" />
            संकल्प ट्रॅकर
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            गावाचा वचन ट्रॅकर
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            १० बिंदूंचा गावाचा वचन ट्रॅकर - स्वच्छता, डिजिटल साक्षरता, हरित ऊर्जा इत्यादी
          </p>
        </motion.div>

        {/* Overall Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">एकूण प्रगती</h3>
                </div>
                <div className="text-6xl font-bold mb-4">{overallProgress}%</div>
                <div className="w-full bg-white/20 rounded-full h-4 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-4 bg-white rounded-full"
                  />
                </div>
                <p className="text-lg text-indigo-100">
                  {displayItems.filter(item => item.status === 'completed').length} / {displayItems.length} संकल्प पूर्ण
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sankalp Items Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayItems.map((item, index) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      {getIcon(item.icon)}
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(item.status)} border`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{getStatusText(item.status)}</span>
                      </Badge>
                      <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                        {getPriorityText(item.priority)}
                      </Badge>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 italic mb-4">
                    {item.titleEn}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">प्रगती</span>
                      <span className="text-sm font-bold text-gray-900">
                        {item.currentValue}{item.unit} / {item.targetValue}{item.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.currentValue / item.targetValue) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-3 rounded-full bg-gradient-to-r ${item.color}`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0{item.unit}</span>
                      <span className="font-medium">
                        {Math.round((item.currentValue / item.targetValue) * 100)}% पूर्ण
                      </span>
                      <span>{item.targetValue}{item.unit}</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.status === 'completed' ? (
                        <Star className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="text-xs text-gray-600">
                        {item.status === 'completed' ? 'पूर्ण झाले' : 'चालू आहे'}
                      </span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">संकल्प सारांश</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {displayItems.filter(item => item.status === 'completed').length}
                    </div>
                    <div className="text-gray-600">पूर्ण संकल्प</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {displayItems.filter(item => item.status === 'in-progress').length}
                    </div>
                    <div className="text-gray-600">चालू संकल्प</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {displayItems.filter(item => item.priority === 'high').length}
                    </div>
                    <div className="text-gray-600">उच्च प्राधान्य</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
