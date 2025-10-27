'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3,
  Download,
  ExternalLink,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Wallet,
  CreditCard,
  Banknote,
  Calculator,
  Receipt,
  Building,
  Users,
  Wrench,
  Heart,
  GraduationCap,
  Shield
} from 'lucide-react';
import Image from 'next/image';

interface BudgetData {
  id: string;
  category: string;
  categoryEn: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
  description: string;
  descriptionEn: string;
  isActive: boolean;
}

interface IncomeData {
  id: string;
  source: string;
  sourceEn: string;
  amount: number;
  percentage: number;
  description: string;
  descriptionEn: string;
  isActive: boolean;
}

interface ExpenseData {
  id: string;
  category: string;
  categoryEn: string;
  amount: number;
  percentage: number;
  description: string;
  descriptionEn: string;
  date: string;
  isActive: boolean;
}

interface FinancialReport {
  id: string;
  title: string;
  titleEn: string;
  type: 'annual' | 'quarterly' | 'monthly' | 'special';
  period: string;
  periodEn: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  fileUrl?: string;
  isActive: boolean;
  publishedDate: string;
}

interface FinanceSectionProps {
  budgetData?: BudgetData[];
  incomeData?: IncomeData[];
  expenseData?: ExpenseData[];
  reports?: FinancialReport[];
  statistics?: {
    totalBudget: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    budgetUtilization: number;
    savingsRate: number;
  };
}

export function FinanceSection({ 
  budgetData = [], 
  incomeData = [],
  expenseData = [],
  reports = [],
  statistics = {
    totalBudget: 0,
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    budgetUtilization: 0,
    savingsRate: 0
  }
}: FinanceSectionProps) {
  const { t, language } = useTranslation();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'infrastructure':
        return Building;
      case 'health':
        return Heart;
      case 'education':
        return GraduationCap;
      case 'welfare':
        return Users;
      case 'administration':
        return Shield;
      case 'maintenance':
        return Wrench;
      case 'utilities':
        return Wrench;
      case 'transport':
        return Wrench;
      case 'security':
        return Shield;
      case 'development':
        return Building;
      default:
        return PieChart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'infrastructure':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'health':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'education':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'welfare':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'administration':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'maintenance':
        return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      case 'utilities':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'transport':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'security':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'development':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBalanceColor = (balance: number) => {
    return balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getBalanceIcon = (balance: number) => {
    return balance >= 0 ? ArrowUpRight : ArrowDownRight;
  };

  return (
    <section id="finance" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.finance.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Transparent financial management and budget tracking'
              : 'पारदर्शक आर्थिक व्यवस्थापन आणि अर्थसंकल्प ट्रॅकिंग'
            }
          </p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(statistics.totalBudget)}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Total Budget' : 'एकूण अर्थसंकल्प'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(statistics.totalIncome)}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Total Income' : 'एकूण उत्पन्न'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(statistics.totalExpense)}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Total Expense' : 'एकूण खर्च'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${getBalanceColor(statistics.balance)}`}>
                {formatCurrency(statistics.balance)}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Balance' : 'शिल्लक'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Utilization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                {language === 'en' ? 'Budget Utilization' : 'अर्थसंकल्प वापर'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {statistics.budgetUtilization}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${statistics.budgetUtilization}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {language === 'en' 
                  ? 'Budget utilized this year'
                  : 'या वर्षी वापरलेला अर्थसंकल्प'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                {language === 'en' ? 'Savings Rate' : 'बचत दर'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {statistics.savingsRate}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${statistics.savingsRate}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {language === 'en' 
                  ? 'Savings as percentage of income'
                  : 'उत्पन्नाच्या टक्केवारीत बचत'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Budget Categories' : 'अर्थसंकल्प श्रेणी'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View Detailed Budget' : 'तपशीलवार अर्थसंकल्प पहा'}
            </Button>
          </div>

          {budgetData.length === 0 ? (
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Budget information will be updated soon'
                  : 'अर्थसंकल्प माहिती लवकरच अद्यतनित केली जाईल'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetData.map((budget) => {
                const CategoryIcon = getCategoryIcon(budget.category);
                const categoryColor = getCategoryColor(budget.category);
                
                return (
                  <Card key={budget.id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryColor.split(' ')[1]}`}>
                          <CategoryIcon className={`w-5 h-5 ${categoryColor.split(' ')[0]}`} />
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                          {language === 'en' ? budget.categoryEn : budget.category}
                        </CardTitle>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {language === 'en' ? budget.descriptionEn : budget.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Budget Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {language === 'en' ? 'Allocated' : 'वाटप केले'}:
                            </span>
                            <span className="font-medium">
                              {formatCurrency(budget.allocated)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {language === 'en' ? 'Spent' : 'खर्च केले'}:
                            </span>
                            <span className="font-medium">
                              {formatCurrency(budget.spent)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {language === 'en' ? 'Remaining' : 'शिल्लक'}:
                            </span>
                            <span className="font-medium">
                              {formatCurrency(budget.remaining)}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {language === 'en' ? 'Utilization' : 'वापर'}:
                            </span>
                            <span className={`font-medium ${getPercentageColor(budget.percentage)}`}>
                              {budget.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${budget.percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full group-hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {language === 'en' ? 'View Details' : 'तपशील पहा'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Income Sources */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Income Sources' : 'उत्पन्न स्रोत'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View Income Report' : 'उत्पन्न अहवाल पहा'}
            </Button>
          </div>

          {incomeData.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Income information will be updated soon'
                  : 'उत्पन्न माहिती लवकरच अद्यतनित केली जाईल'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {incomeData.map((income) => (
                <Card key={income.id} className="hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900">
                        {language === 'en' ? income.sourceEn : income.source}
                      </h4>
                      <Badge className="bg-green-100 text-green-800">
                        {income.percentage}%
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {language === 'en' ? income.descriptionEn : income.description}
                    </p>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {formatCurrency(income.amount)}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${income.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Expense Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Expense Categories' : 'खर्च श्रेणी'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View Expense Report' : 'खर्च अहवाल पहा'}
            </Button>
          </div>

          {expenseData.length === 0 ? (
            <div className="text-center py-12">
              <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Expense information will be updated soon'
                  : 'खर्च माहिती लवकरच अद्यतनित केली जाईल'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expenseData.map((expense) => {
                const CategoryIcon = getCategoryIcon(expense.category);
                const categoryColor = getCategoryColor(expense.category);
                
                return (
                  <Card key={expense.id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryColor.split(' ')[1]}`}>
                          <CategoryIcon className={`w-5 h-5 ${categoryColor.split(' ')[0]}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">
                            {language === 'en' ? expense.categoryEn : expense.category}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          {expense.percentage}%
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {language === 'en' ? expense.descriptionEn : expense.description}
                      </p>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 mb-2">
                          {formatCurrency(expense.amount)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${expense.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Financial Reports */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Financial Reports' : 'आर्थिक अहवाल'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Reports' : 'सर्व अहवाल पहा'}
            </Button>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Financial reports will be updated soon'
                  : 'आर्थिक अहवाल लवकरच अद्यतनित केले जातील'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => {
                const BalanceIcon = getBalanceIcon(report.balance);
                
                return (
                  <Card key={report.id} className="hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                          {language === 'en' ? report.titleEn : report.title}
                        </CardTitle>
                        <Badge className="bg-blue-100 text-blue-800">
                          {language === 'en' ? report.type : report.type}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {language === 'en' ? report.periodEn : report.period}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Income' : 'उत्पन्न'}:
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(report.totalIncome)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Expense' : 'खर्च'}:
                          </span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(report.totalExpense)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Balance' : 'शिल्लक'}:
                          </span>
                          <span className={`font-medium flex items-center ${getBalanceColor(report.balance)}`}>
                            <BalanceIcon className="w-4 h-4 mr-1" />
                            {formatCurrency(report.balance)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Published' : 'प्रकाशित'}:
                          </span>
                          <span className="font-medium">
                            {new Date(report.publishedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {language === 'en' ? 'Download Report' : 'अहवाल डाउनलोड करा'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full group-hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {language === 'en' ? 'View Online' : 'ऑनलाइन पहा'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Financial Transparency */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'Financial Transparency' : 'आर्थिक पारदर्शकता'}
                </h3>
                <p className="text-green-100">
                  {language === 'en' 
                    ? 'We believe in complete transparency in financial management'
                    : 'आम्ही आर्थिक व्यवस्थापनात पूर्ण पारदर्शकतेवर विश्वास ठेवतो'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Public Access' : 'सार्वजनिक प्रवेश'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'All financial data is publicly accessible'
                      : 'सर्व आर्थिक डेटा सार्वजनिकरित्या उपलब्ध आहे'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Regular Updates' : 'नियमित अद्यतने'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'Financial data updated regularly'
                      : 'आर्थिक डेटा नियमितपणे अद्यतनित केला जातो'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Audited' : 'लेखापरीक्षित'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'All reports are professionally audited'
                      : 'सर्व अहवाल व्यावसायिकरित्या लेखापरीक्षित केले जातात'
                    }
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'View All Reports' : 'सर्व अहवाल पहा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            <PieChart className="w-5 h-5 mr-2" />
            {language === 'en' ? 'View Financial Dashboard' : 'आर्थिक डॅशबोर्ड पहा'}
          </Button>
        </div>
      </div>
    </section>
  );
}