'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  Save,
  TrendingUp,
  TrendingDown,
  Download,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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
  receipt: string;
}

const mockIncomeExpense: IncomeExpense[] = [
  {
    id: '1',
    type: 'income',
    title: 'कर संग्रह',
    titleEn: 'Tax Collection',
    description: 'गावातील कर संग्रह',
    descriptionEn: 'Tax collection from village',
    amount: 150000,
    category: 'कर',
    date: '2024-03-15',
    receipt: '/receipts/receipt-1.pdf'
  },
  {
    id: '2',
    type: 'expense',
    title: 'रस्ता दुरुस्ती',
    titleEn: 'Road Repair',
    description: 'मुख्य रस्त्याची दुरुस्ती',
    descriptionEn: 'Main road repair work',
    amount: 75000,
    category: 'विकास',
    date: '2024-03-10',
    receipt: '/receipts/receipt-2.pdf'
  },
  {
    id: '3',
    type: 'income',
    title: 'सरकारी अनुदान',
    titleEn: 'Government Grant',
    description: 'केंद्र सरकारचे अनुदान',
    descriptionEn: 'Central government grant',
    amount: 200000,
    category: 'अनुदान',
    date: '2024-02-28',
    receipt: '/receipts/receipt-3.pdf'
  },
  {
    id: '4',
    type: 'expense',
    title: 'पाणीपुरवठा यंत्रणा',
    titleEn: 'Water Supply System',
    description: 'पाणीपुरवठा यंत्रणेची दुरुस्ती',
    descriptionEn: 'Water supply system maintenance',
    amount: 120000,
    category: 'सुविधा',
    date: '2024-02-20',
    receipt: '/receipts/receipt-4.pdf'
  }
];

const categories = [
  'कर', 'अनुदान', 'दान', 'विकास', 'सुविधा', 'शिक्षण', 'आरोग्य', 'अन्य'
];

export default function IncomeExpensePage() {
  const [transactions, setTransactions] = useState<IncomeExpense[]>(mockIncomeExpense);
  const [editingTransaction, setEditingTransaction] = useState<IncomeExpense | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');

  const handleEdit = (transaction: IncomeExpense) => {
    setEditingTransaction(transaction);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingTransaction({
      id: '',
      type: 'income',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      amount: 0,
      category: 'कर',
      date: new Date().toISOString().split('T')[0],
      receipt: ''
    });
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!editingTransaction) return;

    if (isAdding) {
      const newTransaction = { ...editingTransaction, id: Date.now().toString() };
      setTransactions(prev => [...prev, newTransaction]);
      toast.success('नवीन नोंद जोडली');
    } else {
      setTransactions(prev => prev.map(transaction => 
        transaction.id === editingTransaction.id ? editingTransaction : transaction
      ));
      toast.success('नोंद अपडेट केली');
    }

    setEditingTransaction(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success('नोंद हटवली');
  };

  const handleCancel = () => {
    setEditingTransaction(null);
    setIsAdding(false);
  };

  const filteredTransactions = selectedType === 'all' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === selectedType);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              मुख्यपृष्ठ
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">जमा-खर्च</h1>
            <p className="text-gray-600 mt-1">आर्थिक माहिती व्यवस्थापन</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            रिपोर्ट डाउनलोड
          </Button>
          <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            नवीन नोंद
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">एकूण जमा</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{totalIncome.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">एकूण खर्च</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{totalExpense.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">शिल्लक</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{balance.toLocaleString('en-IN')}
                </p>
              </div>
              <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-6 w-6 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedType('all')}
        >
          सर्व
        </Button>
        <Button
          variant={selectedType === 'income' ? 'default' : 'outline'}
          onClick={() => setSelectedType('income')}
          className="text-green-600"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          जमा
        </Button>
        <Button
          variant={selectedType === 'expense' ? 'default' : 'outline'}
          onClick={() => setSelectedType('expense')}
          className="text-red-600"
        >
          <TrendingDown className="h-4 w-4 mr-2" />
          खर्च
        </Button>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className={`h-6 w-6 ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{transaction.title}</h3>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{transaction.category}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('mr-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                    </p>
                    <Badge className={
                      transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }>
                      {transaction.type === 'income' ? 'जमा' : 'खर्च'}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन नोंद जोडा' : 'नोंद संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">प्रकार</Label>
                  <select
                    id="type"
                    value={editingTransaction.type}
                    onChange={(e) => setEditingTransaction({...editingTransaction, type: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="income">जमा</option>
                    <option value="expense">खर्च</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="amount">रक्कम</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={editingTransaction.amount}
                    onChange={(e) => setEditingTransaction({...editingTransaction, amount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">शीर्षक (मराठी)</Label>
                  <Input
                    id="title"
                    value={editingTransaction.title}
                    onChange={(e) => setEditingTransaction({...editingTransaction, title: e.target.value})}
                    placeholder="कर संग्रह"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
                  <Input
                    id="titleEn"
                    value={editingTransaction.titleEn}
                    onChange={(e) => setEditingTransaction({...editingTransaction, titleEn: e.target.value})}
                    placeholder="Tax Collection"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">वर्णन (मराठी)</Label>
                  <Textarea
                    id="description"
                    value={editingTransaction.description}
                    onChange={(e) => setEditingTransaction({...editingTransaction, description: e.target.value})}
                    placeholder="नोंदीचे तपशील"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingTransaction.descriptionEn}
                    onChange={(e) => setEditingTransaction({...editingTransaction, descriptionEn: e.target.value})}
                    placeholder="Transaction details"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">वर्ग</Label>
                  <select
                    id="category"
                    value={editingTransaction.category}
                    onChange={(e) => setEditingTransaction({...editingTransaction, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="date">तारीख</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingTransaction.date}
                    onChange={(e) => setEditingTransaction({...editingTransaction, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="receipt">पावती/दस्तऐवज</Label>
                <Input
                  id="receipt"
                  value={editingTransaction.receipt}
                  onChange={(e) => setEditingTransaction({...editingTransaction, receipt: e.target.value})}
                  placeholder="पावती फाइल पाथ"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCancel}>
                  रद्द करा
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
