'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  DollarSign, 
  TrendingDown, 
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
  Wrench,
  BookOpen,
  Heart,
  Shield,
  TreePine,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpenseCategory {
  id: string;
  name: string;
  nameEn: string;
  budgeted: number;
  spent: number;
  percentage: number;
  remaining: number;
  lastUpdated: string;
  description: string;
  color: string;
  icon: any;
  status: 'on_track' | 'over_budget' | 'under_budget';
  subcategories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

const demoExpenseCategories: ExpenseCategory[] = [
  {
    id: 'infrastructure',
    name: 'पायाभूत सुविधा',
    nameEn: 'Infrastructure',
    budgeted: 4500000,
    spent: 4200000,
    percentage: 93.3,
    remaining: 300000,
    lastUpdated: '2024-03-15',
    description: 'रस्ते, पूल, पाणी पुरवठा, वीज पुरवठा इत्यादी पायाभूत सुविधा',
    color: 'bg-blue-500',
    icon: Building,
    status: 'on_track',
    subcategories: [
      { name: 'रस्ते निर्माण', amount: 1500000, percentage: 35.7 },
      { name: 'पाणी पुरवठा', amount: 1200000, percentage: 28.6 },
      { name: 'वीज पुरवठा', amount: 800000, percentage: 19.0 },
      { name: 'पूल निर्माण', amount: 700000, percentage: 16.7 }
    ]
  },
  {
    id: 'education',
    name: 'शिक्षण',
    nameEn: 'Education',
    budgeted: 3000000,
    spent: 2800000,
    percentage: 93.3,
    remaining: 200000,
    lastUpdated: '2024-03-10',
    description: 'शाळा, अंगणवाडी, शिक्षक वेतन, शैक्षणिक साहित्य',
    color: 'bg-green-500',
    icon: BookOpen,
    status: 'on_track',
    subcategories: [
      { name: 'शिक्षक वेतन', amount: 1200000, percentage: 42.9 },
      { name: 'शाळा दुरुस्ती', amount: 800000, percentage: 28.6 },
      { name: 'शैक्षणिक साहित्य', amount: 500000, percentage: 17.9 },
      { name: 'अंगणवाडी', amount: 300000, percentage: 10.7 }
    ]
  },
  {
    id: 'health',
    name: 'आरोग्य',
    nameEn: 'Health',
    budgeted: 2000000,
    spent: 1800000,
    percentage: 90.0,
    remaining: 200000,
    lastUpdated: '2024-03-12',
    description: 'आरोग्य केंद्रे, डॉक्टर वेतन, औषधे, आरोग्य शिबिरे',
    color: 'bg-red-500',
    icon: Heart,
    status: 'on_track',
    subcategories: [
      { name: 'डॉक्टर वेतन', amount: 800000, percentage: 44.4 },
      { name: 'औषधे', amount: 500000, percentage: 27.8 },
      { name: 'आरोग्य केंद्र दुरुस्ती', amount: 300000, percentage: 16.7 },
      { name: 'आरोग्य शिबिरे', amount: 200000, percentage: 11.1 }
    ]
  },
  {
    id: 'sanitation',
    name: 'स्वच्छता',
    nameEn: 'Sanitation',
    budgeted: 1500000,
    spent: 1450000,
    percentage: 96.7,
    remaining: 50000,
    lastUpdated: '2024-03-18',
    description: 'स्वच्छता अभियान, कचरा व्यवस्थापन, शौचालय निर्माण',
    color: 'bg-purple-500',
    icon: Shield,
    status: 'on_track',
    subcategories: [
      { name: 'कचरा व्यवस्थापन', amount: 600000, percentage: 41.4 },
      { name: 'शौचालय निर्माण', amount: 500000, percentage: 34.5 },
      { name: 'स्वच्छता अभियान', amount: 250000, percentage: 17.2 },
      { name: 'कचरा वाहन', amount: 100000, percentage: 6.9 }
    ]
  },
  {
    id: 'agriculture',
    name: 'कृषी',
    nameEn: 'Agriculture',
    budgeted: 2000000,
    spent: 1600000,
    percentage: 80.0,
    remaining: 400000,
    lastUpdated: '2024-03-08',
    description: 'कृषी यंत्रे, बियाणे, खते, कृषी प्रशिक्षण',
    color: 'bg-orange-500',
    icon: TreePine,
    status: 'under_budget',
    subcategories: [
      { name: 'कृषी यंत्रे', amount: 800000, percentage: 50.0 },
      { name: 'बियाणे व खते', amount: 400000, percentage: 25.0 },
      { name: 'कृषी प्रशिक्षण', amount: 200000, percentage: 12.5 },
      { name: 'सिंचन सुविधा', amount: 200000, percentage: 12.5 }
    ]
  },
  {
    id: 'administration',
    name: 'प्रशासन',
    nameEn: 'Administration',
    budgeted: 2000000,
    spent: 1000000,
    percentage: 50.0,
    remaining: 1000000,
    lastUpdated: '2024-03-20',
    description: 'कार्यालय खर्च, कर्मचारी वेतन, कागदपत्रे, संगणक',
    color: 'bg-gray-500',
    icon: Home,
    status: 'under_budget',
    subcategories: [
      { name: 'कर्मचारी वेतन', amount: 600000, percentage: 60.0 },
      { name: 'कार्यालय खर्च', amount: 200000, percentage: 20.0 },
      { name: 'कागदपत्रे', amount: 100000, percentage: 10.0 },
      { name: 'संगणक व सॉफ्टवेअर', amount: 100000, percentage: 10.0 }
    ]
  }
];

export function ExpenseBreakdownSection() {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [selectedExpense, setSelectedExpense] = useState<ExpenseCategory | null>(null);

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExpenseCategories(demoExpenseCategories);
      setLoading(false);
    };

    fetchExpenseCategories();
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
      case 'over_budget':
        return { label: 'अर्थसंकल्प ओलांडले', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case 'under_budget':
        return { label: 'अर्थसंकल्पाखाली', color: 'bg-blue-100 text-blue-800', icon: ArrowDownRight };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  const filteredCategories = selectedCategory === 'all' 
    ? expenseCategories 
    : expenseCategories.filter(category => category.id === selectedCategory);

  const totalBudgeted = expenseCategories.reduce((sum, category) => sum + category.budgeted, 0);
  const totalSpent = expenseCategories.reduce((sum, category) => sum + category.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallUtilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">खर्च विभाजन लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white mr-4">
              <TrendingDown className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              खर्चाचे विभाजन
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ग्रामपंचायतच्या विविध क्षेत्रांमध्ये होणाऱ्या खर्चाची तपशीलवार माहिती
          </p>
        </motion.div>

        {/* Expense Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">एकूण अर्थसंकल्प</p>
                  <p className="text-3xl font-bold">{formatAmount(totalBudgeted)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Target className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">एकूण खर्च</p>
                  <p className="text-3xl font-bold">{formatAmount(totalSpent)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingDown className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">शिल्लक</p>
                  <p className="text-3xl font-bold">{formatAmount(totalRemaining)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Wallet className="h-8 w-8" />
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
              सर्व श्रेण्या
            </Button>
            {expenseCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
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

        {/* Expense Categories List */}
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
              {filteredCategories.map((category, index) => {
                const statusInfo = getStatusInfo(category.status);
                const StatusIcon = statusInfo.icon;
                const CategoryIcon = category.icon;

                return (
                  <motion.div
                    key={category.id}
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
                            <div className={`p-3 rounded-xl ${category.color} text-white`}>
                              <CategoryIcon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {category.name}
                                </h3>
                                <Badge className={statusInfo.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {category.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(category.lastUpdated)}
                                </span>
                                <span>अर्थसंकल्प: {formatAmount(category.budgeted)}</span>
                                <span>शिल्लक: {formatAmount(category.remaining)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-orange-600 mb-2">
                              {formatAmount(category.spent)}
                            </p>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <motion.div 
                                className={`h-2 rounded-full ${category.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${category.percentage}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {category.percentage.toFixed(1)}% वापर
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2"
                              onClick={() => setSelectedExpense(category)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              तपशील
                            </Button>
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
              {/* Expense by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    श्रेणीनुसार खर्च
                  </CardTitle>
                  <CardDescription>
                    विविध श्रेण्यांमध्ये होणारा खर्च
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenseCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold">{formatAmount(category.spent)}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(category.spent / totalSpent * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    अर्थसंकल्प वापर
                  </CardTitle>
                  <CardDescription>
                    प्रत्येक श्रेणीचा अर्थसंकल्प वापर
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenseCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm font-bold">{category.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className={`h-2 rounded-full ${category.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${category.percentage}%` }}
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
          <h3 className="text-2xl font-bold text-center mb-8">खर्च सारांश</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {expenseCategories.length}
              </div>
              <div className="text-gray-600">खर्च श्रेण्या</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {expenseCategories.filter(c => c.status === 'on_track').length}
              </div>
              <div className="text-gray-600">योजनेत</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {expenseCategories.filter(c => c.status === 'under_budget').length}
              </div>
              <div className="text-gray-600">अर्थसंकल्पाखाली</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {overallUtilization.toFixed(1)}%
              </div>
              <div className="text-gray-600">एकूण वापर</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
