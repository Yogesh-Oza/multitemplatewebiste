'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  DollarSign, 
  TrendingUp, 
  Users,
  FileText,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  AlertTriangle,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Wallet,
  Gift,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RevenueSource {
  id: string;
  name: string;
  nameEn: string;
  category: 'grant' | 'tax' | 'donation' | 'other';
  amount: number;
  percentage: number;
  target: number;
  achieved: number;
  lastUpdated: string;
  description: string;
  color: string;
  icon: any;
  status: 'on_track' | 'below_target' | 'exceeded';
}

const demoRevenueSources: RevenueSource[] = [
  {
    id: 'central-grants',
    name: 'केंद्र सरकार अनुदाने',
    nameEn: 'Central Government Grants',
    category: 'grant',
    amount: 4500000,
    percentage: 34.1,
    target: 5000000,
    achieved: 90,
    lastUpdated: '2024-03-15',
    description: 'केंद्र सरकारकडून मिळणारे विविध योजनांसाठीचे अनुदाने',
    color: 'bg-blue-500',
    icon: Building,
    status: 'below_target'
  },
  {
    id: 'state-grants',
    name: 'राज्य सरकार अनुदाने',
    nameEn: 'State Government Grants',
    category: 'grant',
    amount: 3200000,
    percentage: 24.2,
    target: 3000000,
    achieved: 106.7,
    lastUpdated: '2024-03-10',
    description: 'महाराष्ट्र सरकारकडून मिळणारे अनुदाने',
    color: 'bg-green-500',
    icon: Building,
    status: 'exceeded'
  },
  {
    id: 'property-tax',
    name: 'मालमत्ता कर',
    nameEn: 'Property Tax',
    category: 'tax',
    amount: 1800000,
    percentage: 13.6,
    target: 2000000,
    achieved: 90,
    lastUpdated: '2024-03-20',
    description: 'गावातील मालमत्तेवर आकारले जाणारे कर',
    color: 'bg-orange-500',
    icon: Receipt,
    status: 'below_target'
  },
  {
    id: 'water-tax',
    name: 'पाणी कर',
    nameEn: 'Water Tax',
    category: 'tax',
    amount: 1200000,
    percentage: 9.1,
    target: 1000000,
    achieved: 120,
    lastUpdated: '2024-03-18',
    description: 'पाणी पुरवठा सेवेसाठी आकारले जाणारे कर',
    color: 'bg-cyan-500',
    icon: Receipt,
    status: 'exceeded'
  },
  {
    id: 'donations',
    name: 'दान देणग्या',
    nameEn: 'Donations',
    category: 'donation',
    amount: 800000,
    percentage: 6.1,
    target: 500000,
    achieved: 160,
    lastUpdated: '2024-03-12',
    description: 'गावातील नागरिकांकडून मिळणारे दान देणग्या',
    color: 'bg-purple-500',
    icon: Gift,
    status: 'exceeded'
  },
  {
    id: 'other-sources',
    name: 'इतर स्त्रोत',
    nameEn: 'Other Sources',
    category: 'other',
    amount: 1700000,
    percentage: 12.9,
    target: 1500000,
    achieved: 113.3,
    lastUpdated: '2024-03-08',
    description: 'इतर विविध स्त्रोतांकडून मिळणारे उत्पन्न',
    color: 'bg-gray-500',
    icon: Wallet,
    status: 'exceeded'
  }
];

export function RevenueSourcesSection() {
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  useEffect(() => {
    const fetchRevenueSources = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRevenueSources(demoRevenueSources);
      setLoading(false);
    };

    fetchRevenueSources();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('mr-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mr-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'on_track':
        return { label: 'योजनेत', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'below_target':
        return { label: 'लक्ष्याखाली', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
      case 'exceeded':
        return { label: 'लक्ष्य ओलांडले', color: 'bg-blue-100 text-blue-800', icon: ArrowUpRight };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'grant':
        return { label: 'अनुदान', color: 'bg-blue-100 text-blue-800' };
      case 'tax':
        return { label: 'कर', color: 'bg-orange-100 text-orange-800' };
      case 'donation':
        return { label: 'दान', color: 'bg-purple-100 text-purple-800' };
      case 'other':
        return { label: 'इतर', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredSources = selectedCategory === 'all' 
    ? revenueSources 
    : revenueSources.filter(source => source.category === selectedCategory);

  const totalRevenue = revenueSources.reduce((sum, source) => sum + source.amount, 0);
  const totalTarget = revenueSources.reduce((sum, source) => sum + source.target, 0);
  const overallAchievement = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">उत्पन्न स्त्रोत लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 text-white mr-4">
              <DollarSign className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              उत्पन्नाचे स्त्रोत
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ग्रामपंचायतच्या विविध उत्पन्न स्त्रोतांची तपशीलवार माहिती
          </p>
        </motion.div>

        {/* Revenue Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">एकूण उत्पन्न</p>
                  <p className="text-3xl font-bold">{formatAmount(totalRevenue)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">एकूण लक्ष्य</p>
                  <p className="text-3xl font-bold">{formatAmount(totalTarget)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Target className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">साध्यता</p>
                  <p className="text-3xl font-bold">{overallAchievement.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  {overallAchievement >= 100 ? <ArrowUpRight className="h-8 w-8" /> : <ArrowDownRight className="h-8 w-8" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              सर्व स्त्रोत
            </Button>
            <Button
              variant={selectedCategory === 'grant' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('grant')}
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Building className="h-4 w-4 mr-2" />
              अनुदाने
            </Button>
            <Button
              variant={selectedCategory === 'tax' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('tax')}
              size="sm"
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <Receipt className="h-4 w-4 mr-2" />
              कर
            </Button>
            <Button
              variant={selectedCategory === 'donation' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('donation')}
              size="sm"
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              <Gift className="h-4 w-4 mr-2" />
              दान
            </Button>
            <Button
              variant={selectedCategory === 'other' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('other')}
              size="sm"
              className="text-gray-600 border-gray-600 hover:bg-gray-50"
            >
              <Wallet className="h-4 w-4 mr-2" />
              इतर
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              यादी
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

        {/* Revenue Sources List */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {filteredSources.map((source, index) => {
                const statusInfo = getStatusInfo(source.status);
                const categoryInfo = getCategoryInfo(source.category);
                const StatusIcon = statusInfo.icon;
                const SourceIcon = source.icon;

                return (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="transform transition-all duration-300"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${source.color} text-white`}>
                              <SourceIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {source.name}
                                </h3>
                                <Badge className={categoryInfo.color}>
                                  {categoryInfo.label}
                                </Badge>
                                <Badge className={statusInfo.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {source.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(source.lastUpdated)}
                                </span>
                                <span>लक्ष्य: {formatAmount(source.target)}</span>
                                <span>साध्यता: {source.achieved.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 mb-2">
                              {formatAmount(source.amount)}
                            </p>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <motion.div 
                                className={`h-2 rounded-full ${source.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${source.percentage}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {source.percentage.toFixed(1)}% एकूण उत्पन्नात
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
              {/* Revenue by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    श्रेणीनुसार उत्पन्न
                  </CardTitle>
                  <CardDescription>
                    विविध श्रेण्यांमधून मिळणारे उत्पन्न
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueSources.map((source, index) => (
                      <motion.div
                        key={source.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${source.color}`} />
                          <span className="text-sm font-medium">{source.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold">{formatAmount(source.amount)}</span>
                          <span className="text-xs text-gray-500 ml-2">({source.percentage.toFixed(1)}%)</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    साध्यता स्थिती
                  </CardTitle>
                  <CardDescription>
                    प्रत्येक स्त्रोताची लक्ष्य साध्यता
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueSources.map((source, index) => (
                      <motion.div
                        key={source.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{source.name}</span>
                          <span className="text-sm font-bold">{source.achieved.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className={`h-2 rounded-full ${source.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(source.achieved, 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
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
          <h3 className="text-2xl font-bold text-center mb-8">उत्पन्न सारांश</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {revenueSources.length}
              </div>
              <div className="text-gray-600">उत्पन्न स्त्रोत</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {revenueSources.filter(s => s.status === 'exceeded').length}
              </div>
              <div className="text-gray-600">लक्ष्य ओलांडले</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {revenueSources.filter(s => s.status === 'below_target').length}
              </div>
              <div className="text-gray-600">लक्ष्याखाली</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {overallAchievement.toFixed(1)}%
              </div>
              <div className="text-gray-600">एकूण साध्यता</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
