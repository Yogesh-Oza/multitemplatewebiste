import { IncomeExpenseSection } from '@/components/sections/income-expense-section';
import { AnnualBudgetSummarySection } from '@/components/sections/annual-budget-summary-section';
import { RevenueSourcesSection } from '@/components/sections/revenue-sources-section';
import { ExpenseBreakdownSection } from '@/components/sections/expense-breakdown-section';
import { RupeeTrackingInfographic } from '@/components/sections/rupee-tracking-infographic';
import { InteractiveBudgetVisualizer } from '@/components/sections/interactive-budget-visualizer';
import { LatestNewsThoughtSection } from '@/components/sections/latest-news-thought-section';
import { Building, DollarSign, TrendingUp, PieChart, BarChart3, Users, Calendar } from 'lucide-react';

export default function SubdomainJamaKharchPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        {/* Government Logo Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <Building className="h-10 w-10 text-blue-600" />
          </div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-white/20 text-white mr-4 backdrop-blur-sm">
                <Building className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                अर्थसंकल्प आणि पारदर्शकता
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Finance & Budget Transparency
            </p>
            <p className="text-lg mb-8 opacity-80">
              ग्रामपंचायतच्या आर्थिक व्यवस्थापनाची पूर्ण पारदर्शक माहिती
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Building className="h-5 w-5 mr-2" />
                <span>वार्षिक अर्थसंकल्प</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <DollarSign className="h-5 w-5 mr-2" />
                <span>उत्पन्न स्त्रोत</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <PieChart className="h-5 w-5 mr-2" />
                <span>खर्च विभाजन</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <BarChart3 className="h-5 w-5 mr-2" />
                <span>इंटरअॅक्टिव्ह व्हिज्युअलायझर</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Thought for the Day */}
      <LatestNewsThoughtSection />

      {/* Annual Budget Summary */}
      <AnnualBudgetSummarySection />

      {/* Revenue Sources */}
      <RevenueSourcesSection />

      {/* Expense Breakdown */}
      <ExpenseBreakdownSection />

      {/* Rupee Tracking Infographic */}
      <RupeeTrackingInfographic />

      {/* Interactive Budget Visualizer */}
      <InteractiveBudgetVisualizer />

      {/* Basic Income/Expense Section */}
      <IncomeExpenseSection />

      {/* Government Compliance Footer */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-white/20">
                <Building className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">महाराष्ट्र शासन</h3>
                <p className="text-lg opacity-90">Maharashtra Government</p>
              </div>
            </div>
            <p className="text-lg opacity-80 mb-4">
              सर्व आर्थिक व्यवहार भारत सरकार आणि महाराष्ट्र शासनाच्या मार्गदर्शनाखाली पारदर्शकपणे चालवले जातात
            </p>
            <p className="text-sm opacity-70">
              All financial transactions are conducted transparently under the guidance of Government of India and Maharashtra Government
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
