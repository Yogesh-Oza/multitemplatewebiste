'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Building,
  BookOpen,
  Heart,
  Shield,
  TreePine,
  Home,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Target,
  PieChart,
  BarChart3,
  Eye,
  Download,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RupeeFlow {
  id: string;
  source: string;
  amount: number;
  percentage: number;
  color: string;
  icon: any;
  description: string;
  flows: {
    destination: string;
    amount: number;
    percentage: number;
    color: string;
    icon: any;
    description: string;
  }[];
}

const demoRupeeFlow: RupeeFlow[] = [
  {
    id: 'central-grants',
    source: 'केंद्र सरकार अनुदाने',
    amount: 4500000,
    percentage: 34.1,
    color: 'bg-blue-500',
    icon: Building,
    description: 'केंद्र सरकारकडून मिळणारे अनुदाने',
    flows: [
      {
        destination: 'पायाभूत सुविधा',
        amount: 2000000,
        percentage: 44.4,
        color: 'bg-blue-400',
        icon: Building,
        description: 'रस्ते, पूल, पाणी पुरवठा'
      },
      {
        destination: 'शिक्षण',
        amount: 1500000,
        percentage: 33.3,
        color: 'bg-green-400',
        icon: BookOpen,
        description: 'शाळा, अंगणवाडी, शिक्षक वेतन'
      },
      {
        destination: 'आरोग्य',
        amount: 1000000,
        percentage: 22.2,
        color: 'bg-red-400',
        icon: Heart,
        description: 'आरोग्य केंद्रे, औषधे'
      }
    ]
  },
  {
    id: 'state-grants',
    source: 'राज्य सरकार अनुदाने',
    amount: 3200000,
    percentage: 24.2,
    color: 'bg-green-500',
    icon: Building,
    description: 'महाराष्ट्र सरकारकडून मिळणारे अनुदाने',
    flows: [
      {
        destination: 'स्वच्छता',
        amount: 1200000,
        percentage: 37.5,
        color: 'bg-purple-400',
        icon: Shield,
        description: 'स्वच्छता अभियान, कचरा व्यवस्थापन'
      },
      {
        destination: 'कृषी',
        amount: 1000000,
        percentage: 31.3,
        color: 'bg-orange-400',
        icon: TreePine,
        description: 'कृषी यंत्रे, बियाणे, खते'
      },
      {
        destination: 'प्रशासन',
        amount: 1000000,
        percentage: 31.3,
        color: 'bg-gray-400',
        icon: Home,
        description: 'कार्यालय खर्च, कर्मचारी वेतन'
      }
    ]
  },
  {
    id: 'taxes',
    source: 'कर उत्पन्न',
    amount: 3000000,
    percentage: 22.7,
    color: 'bg-orange-500',
    icon: DollarSign,
    description: 'मालमत्ता कर, पाणी कर',
    flows: [
      {
        destination: 'पायाभूत सुविधा',
        amount: 1500000,
        percentage: 50.0,
        color: 'bg-blue-400',
        icon: Building,
        description: 'रस्ते दुरुस्ती, वीज पुरवठा'
      },
      {
        destination: 'शिक्षण',
        amount: 1000000,
        percentage: 33.3,
        color: 'bg-green-400',
        icon: BookOpen,
        description: 'शाळा दुरुस्ती, शैक्षणिक साहित्य'
      },
      {
        destination: 'आरोग्य',
        amount: 500000,
        percentage: 16.7,
        color: 'bg-red-400',
        icon: Heart,
        description: 'आरोग्य केंद्र दुरुस्ती'
      }
    ]
  },
  {
    id: 'donations',
    source: 'दान देणग्या',
    amount: 2500000,
    percentage: 18.9,
    color: 'bg-purple-500',
    icon: Users,
    description: 'गावातील नागरिकांकडून मिळणारे दान',
    flows: [
      {
        destination: 'शिक्षण',
        amount: 1000000,
        percentage: 40.0,
        color: 'bg-green-400',
        icon: BookOpen,
        description: 'शैक्षणिक साहित्य, शाळा सुविधा'
      },
      {
        destination: 'आरोग्य',
        amount: 800000,
        percentage: 32.0,
        color: 'bg-red-400',
        icon: Heart,
        description: 'आरोग्य शिबिरे, औषधे'
      },
      {
        destination: 'स्वच्छता',
        amount: 700000,
        percentage: 28.0,
        color: 'bg-purple-400',
        icon: Shield,
        description: 'स्वच्छता अभियान, शौचालय निर्माण'
      }
    ]
  }
];

export function RupeeTrackingInfographic() {
  const [rupeeFlows, setRupeeFlows] = useState<RupeeFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<RupeeFlow | null>(null);
  const [viewMode, setViewMode] = useState<'flow' | 'chart'>('flow');

  useEffect(() => {
    const fetchRupeeFlows = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRupeeFlows(demoRupeeFlow);
      setLoading(false);
    };

    fetchRupeeFlows();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('mr-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = rupeeFlows.reduce((sum, flow) => sum + flow.amount, 0);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">रुपया ट्रॅकिंग माहिती लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white mr-4">
              <DollarSign className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              आपला रुपया कुठे जातो
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ग्रामनिधीचा वापर दाखविणारा इन्फोग्राफिक - प्रत्येक रुपयाचा मार्ग
          </p>
        </motion.div>

        {/* View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'flow' ? 'default' : 'outline'}
              onClick={() => setViewMode('flow')}
              size="sm"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              रुपया प्रवाह
            </Button>
            <Button
              variant={viewMode === 'chart' ? 'default' : 'outline'}
              onClick={() => setViewMode('chart')}
              size="sm"
            >
              <PieChart className="h-4 w-4 mr-2" />
              आलेख
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'flow' ? (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {rupeeFlows.map((flow, flowIndex) => {
                const SourceIcon = flow.icon;
                
                return (
                  <motion.div
                    key={flow.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: flowIndex * 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                  >
                    {/* Source Card */}
                    <div className="text-center mb-8">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center justify-center p-6 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 mb-4"
                      >
                        <div className={`p-4 rounded-xl ${flow.color} text-white mr-4`}>
                          <SourceIcon className="h-8 w-8" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-2xl font-bold text-gray-800">{flow.source}</h3>
                          <p className="text-lg text-gray-600">{formatAmount(flow.amount)}</p>
                          <p className="text-sm text-gray-500">{flow.description}</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Flow Arrows */}
                    <div className="flex justify-center mb-8">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-4xl text-gray-400"
                      >
                        <ArrowDown />
                      </motion.div>
                    </div>

                    {/* Destination Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {flow.flows.map((destination, destIndex) => {
                        const DestIcon = destination.icon;
                        
                        return (
                          <motion.div
                            key={destination.destination}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: flowIndex * 0.2 + destIndex * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="text-center">
                              <div className={`inline-flex p-3 rounded-xl ${destination.color} text-white mb-4`}>
                                <DestIcon className="h-6 w-6" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                {destination.destination}
                              </h4>
                              <p className="text-2xl font-bold text-gray-700 mb-2">
                                {formatAmount(destination.amount)}
                              </p>
                              <p className="text-sm text-gray-600 mb-3">
                                {destination.description}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div 
                                  className={`h-2 rounded-full ${destination.color}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${destination.percentage}%` }}
                                  transition={{ duration: 1, delay: 1 + flowIndex * 0.2 + destIndex * 0.1 }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {destination.percentage.toFixed(1)}% वाटप
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="chart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Revenue Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    उत्पन्न स्त्रोत
                  </CardTitle>
                  <CardDescription>
                    विविध स्त्रोतांकडून मिळणारे उत्पन्न
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rupeeFlows.map((flow, index) => {
                      const SourceIcon = flow.icon;
                      return (
                        <motion.div
                          key={flow.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${flow.color}`} />
                            <span className="text-sm font-medium">{flow.source}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold">{formatAmount(flow.amount)}</span>
                            <span className="text-xs text-gray-500 ml-2">({flow.percentage.toFixed(1)}%)</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Expense Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    खर्च वितरण
                  </CardTitle>
                  <CardDescription>
                    विविध क्षेत्रांमध्ये होणारा खर्च
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rupeeFlows.flatMap(flow => flow.flows).reduce((acc, dest) => {
                      const existing = acc.find(item => item.destination === dest.destination);
                      if (existing) {
                        existing.amount += dest.amount;
                      } else {
                        acc.push({ ...dest });
                      }
                      return acc;
                    }, [] as any[]).map((dest, index) => (
                      <motion.div
                        key={dest.destination}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${dest.color}`} />
                          <span className="text-sm font-medium">{dest.destination}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold">{formatAmount(dest.amount)}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({((dest.amount / totalRevenue) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">रुपया ट्रॅकिंग सारांश</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {rupeeFlows.length}
              </div>
              <div className="text-gray-600">उत्पन्न स्त्रोत</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {rupeeFlows.flatMap(flow => flow.flows).length}
              </div>
              <div className="text-gray-600">खर्च गंतव्ये</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatAmount(totalRevenue)}
              </div>
              <div className="text-gray-600">एकूण उत्पन्न</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                100%
              </div>
              <div className="text-gray-600">पारदर्शकता</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
