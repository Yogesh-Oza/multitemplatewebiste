'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  FileText,
  Download,
  Eye,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IncomeExpense {
  id: string;
  type: 'income' | 'expense';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  amount: number;
  category: string;
  date: string;
  receiptUrl: string;
  isActive: boolean;
}

const categories = [
  { value: 'कर', label: 'कर', color: 'bg-blue-500', icon: DollarSign },
  { value: 'अनुदान', label: 'अनुदान', color: 'bg-green-500', icon: TrendingUp },
  { value: 'दान', label: 'दान', color: 'bg-purple-500', icon: Wallet },
  { value: 'विकास', label: 'विकास', color: 'bg-orange-500', icon: BarChart3 },
  { value: 'सुविधा', label: 'सुविधा', color: 'bg-cyan-500', icon: Receipt },
  { value: 'शिक्षण', label: 'शिक्षण', color: 'bg-indigo-500', icon: FileText },
  { value: 'आरोग्य', label: 'आरोग्य', color: 'bg-red-500', icon: TrendingUp },
  { value: 'अन्य', label: 'अन्य', color: 'bg-gray-500', icon: DollarSign }
];

export function IncomeExpenseSection() {
  const [transactions, setTransactions] = useState<IncomeExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState('सर्व');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/income-expense');
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.filter((transaction: IncomeExpense) => transaction.isActive));
        } else {
          setError('जमा-खर्च लोड करताना त्रुटी आली');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('जमा-खर्च लोड करताना त्रुटी आली');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = selectedType === 'all' || transaction.type === selectedType;
    const categoryMatch = selectedCategory === 'सर्व' || transaction.category === selectedCategory;
    return typeMatch && categoryMatch;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

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

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[categories.length - 1];
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">जमा-खर्च लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container">
          <div className="text-center">
            <div className="h-16 w-16 text-red-500 mx-auto mb-4">⚠️</div>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 text-white mr-4">
              <DollarSign className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              जमा-खर्च
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ग्रामपंचायतच्या आर्थिक व्यवस्थापनाची पारदर्शक माहिती
          </p>
        </motion.div>

        {/* Financial Summary Cards */}
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
                  <p className="text-green-100 text-sm font-medium">एकूण जमा</p>
                  <p className="text-3xl font-bold">{formatAmount(totalIncome)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">एकूण खर्च</p>
                  <p className="text-3xl font-bold">{formatAmount(totalExpense)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingDown className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-r ${netBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white overflow-hidden`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">शिल्लक</p>
                  <p className="text-3xl font-bold">{formatAmount(netBalance)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  {netBalance >= 0 ? <ArrowUpRight className="h-8 w-8" /> : <ArrowDownRight className="h-8 w-8" />}
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
          {/* Type Filter */}
          <div className="flex gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              size="sm"
            >
              सर्व
            </Button>
            <Button
              variant={selectedType === 'income' ? 'default' : 'outline'}
              onClick={() => setSelectedType('income')}
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              जमा
            </Button>
            <Button
              variant={selectedType === 'expense' ? 'default' : 'outline'}
              onClick={() => setSelectedType('expense')}
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              खर्च
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'सर्व' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('सर्व')}
              size="sm"
            >
              सर्व श्रेण्या
            </Button>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.value)}
                  size="sm"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.label}
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
              <BarChart3 className="h-4 w-4 mr-2" />
              आलेख
            </Button>
          </div>
        </motion.div>

        {/* Transactions List */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {filteredTransactions.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="h-16 w-16 text-gray-400 mx-auto mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    कोणतेही व्यवहार सापडले नाही
                  </h3>
                  <p className="text-gray-500">
                    {selectedType === 'all' 
                      ? 'अद्याप कोणतेही व्यवहार जोडले गेले नाही'
                      : `${selectedType === 'income' ? 'जमा' : 'खर्च'} व्यवहार नाही`
                    }
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction, index) => {
                    const categoryInfo = getCategoryInfo(transaction.category);
                    const IconComponent = categoryInfo.icon;
                    
                    return (
                      <motion.div
                        key={transaction.id}
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
                                <div className={`p-3 rounded-xl ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                  {transaction.type === 'income' ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {transaction.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 line-clamp-1">
                                    {transaction.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className={`${categoryInfo.color} text-white text-xs`}>
                                      <IconComponent className="h-3 w-3 mr-1" />
                                      {transaction.category}
                                    </Badge>
                                    <span className="text-xs text-gray-500 flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {formatDate(transaction.date)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                  {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                                </p>
                                {transaction.receiptUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2"
                                    onClick={() => window.open(transaction.receiptUrl, '_blank')}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    पावती
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
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
              {/* Income vs Expense Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    जमा vs खर्च
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">जमा</span>
                      <span className="text-sm font-bold text-green-600">{formatAmount(totalIncome)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${totalIncome > 0 ? (totalIncome / (totalIncome + totalExpense)) * 100 : 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">खर्च</span>
                      <span className="text-sm font-bold text-red-600">{formatAmount(totalExpense)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="bg-red-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${totalExpense > 0 ? (totalExpense / (totalIncome + totalExpense)) * 100 : 0}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    श्रेणीनुसार विभागणी
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category) => {
                      const categoryTransactions = filteredTransactions.filter(t => t.category === category.value);
                      const categoryTotal = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                      const percentage = totalIncome + totalExpense > 0 ? (categoryTotal / (totalIncome + totalExpense)) * 100 : 0;
                      
                      if (categoryTotal === 0) return null;
                      
                      return (
                        <motion.div
                          key={category.value}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold">{formatAmount(categoryTotal)}</span>
                            <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics Summary */}
        {transactions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-center mb-8">आर्थिक सारांश</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {transactions.filter(t => t.type === 'income').length}
                </div>
                <div className="text-gray-600">जमा व्यवहार</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {transactions.filter(t => t.type === 'expense').length}
                </div>
                <div className="text-gray-600">खर्च व्यवहार</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {new Set(transactions.map(t => t.category)).size}
                </div>
                <div className="text-gray-600">श्रेण्या</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {transactions.length}
                </div>
                <div className="text-gray-600">एकूण व्यवहार</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
