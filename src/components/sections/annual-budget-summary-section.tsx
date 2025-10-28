'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Calendar, 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  Clock,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BudgetSummary {
  id: string;
  year: string;
  totalBudget: number;
  totalExpenditure: number;
  totalRevenue: number;
  balance: number;
  status: 'approved' | 'draft' | 'under_review';
  lastUpdated: string;
  categories: {
    name: string;
    budgeted: number;
    spent: number;
    percentage: number;
    color: string;
  }[];
}

const demoBudgetSummary: BudgetSummary = {
  id: 'budget-2024',
  year: '2024-25',
  totalBudget: 15000000,
  totalExpenditure: 12850000,
  totalRevenue: 13200000,
  balance: 350000,
  status: 'approved',
  lastUpdated: '2024-03-15',
  categories: [
    { name: 'पायाभूत सुविधा', budgeted: 4500000, spent: 4200000, percentage: 93.3, color: 'bg-blue-500' },
    { name: 'शिक्षण', budgeted: 3000000, spent: 2800000, percentage: 93.3, color: 'bg-green-500' },
    { name: 'आरोग्य', budgeted: 2000000, spent: 1800000, percentage: 90.0, color: 'bg-red-500' },
    { name: 'स्वच्छता', budgeted: 1500000, spent: 1450000, percentage: 96.7, color: 'bg-purple-500' },
    { name: 'कृषी', budgeted: 2000000, spent: 1600000, percentage: 80.0, color: 'bg-orange-500' },
    { name: 'अन्य', budgeted: 2000000, spent: 1000000, percentage: 50.0, color: 'bg-gray-500' }
  ]
};

export function AnnualBudgetSummarySection() {
  const [budgetData, setBudgetData] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024-25');

  useEffect(() => {
    // Simulate API call
    const fetchBudgetData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBudgetData(demoBudgetSummary);
      setLoading(false);
    };

    fetchBudgetData();
  }, [selectedYear]);

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
      case 'approved':
        return { label: 'मंजूर', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'draft':
        return { label: 'मसुदा', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'under_review':
        return { label: 'पुनरावलोकन', color: 'bg-blue-100 text-blue-800', icon: AlertTriangle };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">अर्थसंकल्प माहिती लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!budgetData) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="h-16 w-16 text-red-500 mx-auto mb-4">⚠️</div>
            <p className="text-red-600">अर्थसंकल्प माहिती लोड करताना त्रुटी आली</p>
          </div>
        </div>
      </section>
    );
  }

  const statusInfo = getStatusInfo(budgetData.status);
  const StatusIcon = statusInfo.icon;

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
              <Building className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              वार्षिक अर्थसंकल्प सारांश
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {budgetData.year} सालासाठी ग्रामपंचायतच्या अर्थसंकल्पाची संपूर्ण माहिती
          </p>
        </motion.div>

        {/* Budget Overview Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Total Budget */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">एकूण अर्थसंकल्प</p>
                  <p className="text-3xl font-bold">{formatAmount(budgetData.totalBudget)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Target className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">एकूण उत्पन्न</p>
                  <p className="text-3xl font-bold">{formatAmount(budgetData.totalRevenue)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Expenditure */}
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">एकूण खर्च</p>
                  <p className="text-3xl font-bold">{formatAmount(budgetData.totalExpenditure)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingDown className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance */}
          <Card className={`bg-gradient-to-r ${budgetData.balance >= 0 ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} text-white overflow-hidden`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">शिल्लक</p>
                  <p className="text-3xl font-bold">{formatAmount(budgetData.balance)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  {budgetData.balance >= 0 ? <ArrowUpRight className="h-8 w-8" /> : <ArrowDownRight className="h-8 w-8" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Status and Details */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Budget Status */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <StatusIcon className="h-5 w-5 mr-2" />
                अर्थसंकल्प स्थिती
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">वर्ष</span>
                  <span className="text-sm font-bold">{budgetData.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">स्थिती</span>
                  <Badge className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">अंतिम अद्यतन</span>
                  <span className="text-sm text-gray-600">{formatDate(budgetData.lastUpdated)}</span>
                </div>
                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    अर्थसंकल्प डाउनलोड करा
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Utilization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                अर्थसंकल्प वापर
              </CardTitle>
              <CardDescription>
                श्रेणीनुसार अर्थसंकल्प वापराची माहिती
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">{formatAmount(category.spent)}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          / {formatAmount(category.budgeted)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${category.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{category.percentage.toFixed(1)}% वापर</span>
                      <span>{formatAmount(category.budgeted - category.spent)} शिल्लक</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">कार्यक्षमता निर्देशक</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {((budgetData.totalExpenditure / budgetData.totalBudget) * 100).toFixed(1)}%
              </div>
              <div className="text-gray-600">अर्थसंकल्प वापर</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {((budgetData.totalRevenue / budgetData.totalBudget) * 100).toFixed(1)}%
              </div>
              <div className="text-gray-600">उत्पन्न गोळा</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {budgetData.categories.length}
              </div>
              <div className="text-gray-600">श्रेण्या</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {budgetData.categories.filter(c => c.percentage >= 90).length}
              </div>
              <div className="text-gray-600">उत्कृष्ट कामगिरी</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
