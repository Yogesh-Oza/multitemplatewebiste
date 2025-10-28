'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Eye,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Filter,
  Calendar,
  Building,
  BookOpen,
  Heart,
  Shield,
  TreePine,
  Home,
  Users,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BudgetData {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  color: string;
  icon: any;
  subcategories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

const demoBudgetData: BudgetData[] = [
  {
    category: 'पायाभूत सुविधा',
    budgeted: 4500000,
    spent: 4200000,
    remaining: 300000,
    percentage: 93.3,
    color: '#3B82F6',
    icon: Building,
    subcategories: [
      { name: 'रस्ते निर्माण', amount: 1500000, percentage: 35.7 },
      { name: 'पाणी पुरवठा', amount: 1200000, percentage: 28.6 },
      { name: 'वीज पुरवठा', amount: 800000, percentage: 19.0 },
      { name: 'पूल निर्माण', amount: 700000, percentage: 16.7 }
    ]
  },
  {
    category: 'शिक्षण',
    budgeted: 3000000,
    spent: 2800000,
    remaining: 200000,
    percentage: 93.3,
    color: '#10B981',
    icon: BookOpen,
    subcategories: [
      { name: 'शिक्षक वेतन', amount: 1200000, percentage: 42.9 },
      { name: 'शाळा दुरुस्ती', amount: 800000, percentage: 28.6 },
      { name: 'शैक्षणिक साहित्य', amount: 500000, percentage: 17.9 },
      { name: 'अंगणवाडी', amount: 300000, percentage: 10.7 }
    ]
  },
  {
    category: 'आरोग्य',
    budgeted: 2000000,
    spent: 1800000,
    remaining: 200000,
    percentage: 90.0,
    color: '#EF4444',
    icon: Heart,
    subcategories: [
      { name: 'डॉक्टर वेतन', amount: 800000, percentage: 44.4 },
      { name: 'औषधे', amount: 500000, percentage: 27.8 },
      { name: 'आरोग्य केंद्र दुरुस्ती', amount: 300000, percentage: 16.7 },
      { name: 'आरोग्य शिबिरे', amount: 200000, percentage: 11.1 }
    ]
  },
  {
    category: 'स्वच्छता',
    budgeted: 1500000,
    spent: 1450000,
    remaining: 50000,
    percentage: 96.7,
    color: '#8B5CF6',
    icon: Shield,
    subcategories: [
      { name: 'कचरा व्यवस्थापन', amount: 600000, percentage: 41.4 },
      { name: 'शौचालय निर्माण', amount: 500000, percentage: 34.5 },
      { name: 'स्वच्छता अभियान', amount: 250000, percentage: 17.2 },
      { name: 'कचरा वाहन', amount: 100000, percentage: 6.9 }
    ]
  },
  {
    category: 'कृषी',
    budgeted: 2000000,
    spent: 1600000,
    remaining: 400000,
    percentage: 80.0,
    color: '#F59E0B',
    icon: TreePine,
    subcategories: [
      { name: 'कृषी यंत्रे', amount: 800000, percentage: 50.0 },
      { name: 'बियाणे व खते', amount: 400000, percentage: 25.0 },
      { name: 'कृषी प्रशिक्षण', amount: 200000, percentage: 12.5 },
      { name: 'सिंचन सुविधा', amount: 200000, percentage: 12.5 }
    ]
  },
  {
    category: 'प्रशासन',
    budgeted: 2000000,
    spent: 1000000,
    remaining: 1000000,
    percentage: 50.0,
    color: '#6B7280',
    icon: Home,
    subcategories: [
      { name: 'कर्मचारी वेतन', amount: 600000, percentage: 60.0 },
      { name: 'कार्यालय खर्च', amount: 200000, percentage: 20.0 },
      { name: 'कागदपत्रे', amount: 100000, percentage: 10.0 },
      { name: 'संगणक व सॉफ्टवेअर', amount: 100000, percentage: 10.0 }
    ]
  }
];

export function InteractiveBudgetVisualizer() {
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'donut'>('pie');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [animationSpeed, setAnimationSpeed] = useState(1);

  useEffect(() => {
    const fetchBudgetData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBudgetData(demoBudgetData);
      setLoading(false);
    };

    fetchBudgetData();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('mr-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  const renderPieChart = () => {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    let cumulativePercentage = 0;

    return (
      <div className="relative">
        <svg width="300" height="300" className="mx-auto">
          {budgetData.map((item, index) => {
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = item.percentage > 50 ? 1 : 0;
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            cumulativePercentage += item.percentage;

            return (
              <motion.path
                key={item.category}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(item.category)}
              />
            );
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {formatAmount(totalSpent)}
            </div>
            <div className="text-sm text-gray-600">एकूण खर्च</div>
          </div>
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    const maxAmount = Math.max(...budgetData.map(item => item.spent));
    
    return (
      <div className="space-y-4">
        {budgetData.map((item, index) => {
          const height = (item.spent / maxAmount) * 200;
          const IconComponent = item.icon;
          
          return (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="w-24 text-sm font-medium text-gray-700">
                {item.category}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <IconComponent className="h-4 w-4" style={{ color: item.color }} />
                  <span className="text-sm text-gray-600">{formatAmount(item.spent)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    className="h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">
                {item.percentage.toFixed(1)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderDonutChart = () => {
    const radius = 100;
    const centerX = 150;
    const centerY = 150;
    let cumulativePercentage = 0;

    return (
      <div className="relative">
        <svg width="300" height="300" className="mx-auto">
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
          />
          
          {budgetData.map((item, index) => {
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = item.percentage > 50 ? 1 : 0;
            const pathData = [
              `M ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            ].join(' ');

            cumulativePercentage += item.percentage;

            return (
              <motion.path
                key={item.category}
                d={pathData}
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                whileHover={{ strokeWidth: 25 }}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(item.category)}
              />
            );
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {formatAmount(totalSpent)}
            </div>
            <div className="text-sm text-gray-600">एकूण खर्च</div>
            <div className="text-xs text-gray-500 mt-1">
              {((totalSpent / totalBudgeted) * 100).toFixed(1)}% वापर
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">बजेट व्हिज्युअलायझर लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white mr-4">
              <PieChart className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              इंटरअॅक्टिव्ह बजेट व्हिज्युअलायझर
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            पारदर्शकतेसाठी पाई चार्ट स्वरूपात माहिती - इंटरअॅक्टिव्ह आलेख
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          {/* Chart Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              onClick={() => setChartType('pie')}
              size="sm"
            >
              <PieChart className="h-4 w-4 mr-2" />
              पाई चार्ट
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              onClick={() => setChartType('bar')}
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              बार चार्ट
            </Button>
            <Button
              variant={chartType === 'donut' ? 'default' : 'outline'}
              onClick={() => setChartType('donut')}
              size="sm"
            >
              <Target className="h-4 w-4 mr-2" />
              डोनट चार्ट
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              onClick={() => setViewMode('overview')}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              सारांश
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              onClick={() => setViewMode('detailed')}
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              तपशील
            </Button>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            रीसेट
          </Button>
        </motion.div>

        {/* Budget Overview Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">एकूण अर्थसंकल्प</p>
                  <p className="text-3xl font-bold">{formatAmount(totalBudgeted)}</p>
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
                  <p className="text-purple-100 text-sm font-medium">एकूण खर्च</p>
                  <p className="text-3xl font-bold">{formatAmount(totalSpent)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingDown className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">शिल्लक</p>
                  <p className="text-3xl font-bold">{formatAmount(totalRemaining)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {chartType === 'pie' && 'पाई चार्ट - खर्च विभाजन'}
              {chartType === 'bar' && 'बार चार्ट - खर्च तुलना'}
              {chartType === 'donut' && 'डोनट चार्ट - अर्थसंकल्प वापर'}
            </h3>
            <p className="text-gray-600">
              {selectedCategory ? `${selectedCategory} निवडले` : 'चार्टवर क्लिक करून तपशील पहा'}
            </p>
          </div>

          <div className="flex justify-center">
            {chartType === 'pie' && renderPieChart()}
            {chartType === 'bar' && renderBarChart()}
            {chartType === 'donut' && renderDonutChart()}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-center mb-6">श्रेणी सूची</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetData.map((item, index) => {
              const IconComponent = item.icon;
              const isSelected = selectedCategory === item.category;
              
              return (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCategory(isSelected ? null : item.category)}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.category}</h4>
                      <p className="text-sm text-gray-600">{formatAmount(item.spent)}</p>
                      <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Category Details */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {(() => {
              const category = budgetData.find(item => item.category === selectedCategory);
              if (!category) return null;
              
              const IconComponent = category.icon;
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{category.category}</h3>
                        <p className="text-gray-600">तपशीलवार माहिती</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCategory(null)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      बंद करा
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">
                        {formatAmount(category.budgeted)}
                      </div>
                      <div className="text-sm text-gray-600">अर्थसंकल्प</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">
                        {formatAmount(category.spent)}
                      </div>
                      <div className="text-sm text-gray-600">खर्च</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">
                        {formatAmount(category.remaining)}
                      </div>
                      <div className="text-sm text-gray-600">शिल्लक</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">उपश्रेण्या</h4>
                    <div className="space-y-3">
                      {category.subcategories.map((sub, index) => (
                        <motion.div
                          key={sub.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium text-gray-800">{sub.name}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              {formatAmount(sub.amount)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {sub.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </div>
    </section>
  );
}
