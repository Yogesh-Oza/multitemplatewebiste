'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Laptop,
  CheckCircle, 
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  ExternalLink,
  ArrowRight,
  Download,
  Eye,
  Copy,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaxPayment {
  id: string;
  type: string;
  typeEn: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod: 'online' | 'offline' | 'both';
  qrCode: string;
  paymentUrl: string;
  icon: any;
  color: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: any;
  color: string;
  isAvailable: boolean;
}

const demoTaxPayments: TaxPayment[] = [
  {
    id: 'property-tax',
    type: 'मालमत्ता कर',
    typeEn: 'Property Tax',
    description: 'गावातील मालमत्तेवर आकारले जाणारे वार्षिक कर',
    amount: 2500,
    dueDate: '2024-03-31',
    status: 'pending',
    paymentMethod: 'both',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://grampanchayat.gov.in/pay/property-tax',
    paymentUrl: 'https://grampanchayat.gov.in/pay/property-tax',
    icon: Building,
    color: 'bg-blue-500'
  },
  {
    id: 'water-tax',
    type: 'पाणी कर',
    typeEn: 'Water Tax',
    description: 'पाणी पुरवठा सेवेसाठी आकारले जाणारे मासिक कर',
    amount: 150,
    dueDate: '2024-04-15',
    status: 'pending',
    paymentMethod: 'both',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://grampanchayat.gov.in/pay/water-tax',
    paymentUrl: 'https://grampanchayat.gov.in/pay/water-tax',
    icon: Building,
    color: 'bg-cyan-500'
  },
  {
    id: 'electricity-tax',
    type: 'वीज कर',
    typeEn: 'Electricity Tax',
    description: 'वीज पुरवठा सेवेसाठी आकारले जाणारे मासिक कर',
    amount: 200,
    dueDate: '2024-04-10',
    status: 'paid',
    paymentMethod: 'both',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://grampanchayat.gov.in/pay/electricity-tax',
    paymentUrl: 'https://grampanchayat.gov.in/pay/electricity-tax',
    icon: Building,
    color: 'bg-yellow-500'
  }
];

const demoPaymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI पेमेंट',
    nameEn: 'UPI Payment',
    description: 'PhonePe, Google Pay, Paytm, BHIM UPI द्वारे पेमेंट करा',
    icon: Smartphone,
    color: 'bg-purple-500',
    isAvailable: true
  },
  {
    id: 'netbanking',
    name: 'नेट बँकिंग',
    nameEn: 'Net Banking',
    description: 'आपल्या बँक खात्यातून ऑनलाइन पेमेंट करा',
    icon: Laptop,
    color: 'bg-blue-500',
    isAvailable: true
  },
  {
    id: 'debit-card',
    name: 'डेबिट कार्ड',
    nameEn: 'Debit Card',
    description: 'डेबिट कार्ड द्वारे सुरक्षित पेमेंट करा',
    icon: CreditCard,
    color: 'bg-green-500',
    isAvailable: true
  },
  {
    id: 'credit-card',
    name: 'क्रेडिट कार्ड',
    nameEn: 'Credit Card',
    description: 'क्रेडिट कार्ड द्वारे पेमेंट करा',
    icon: CreditCard,
    color: 'bg-orange-500',
    isAvailable: true
  },
  {
    id: 'wallet',
    name: 'डिजिटल वॉलेट',
    nameEn: 'Digital Wallet',
    description: 'Paytm, PhonePe वॉलेट द्वारे पेमेंट करा',
    icon: Smartphone,
    color: 'bg-pink-500',
    isAvailable: false
  }
];

export function OnlineTaxPaymentSection() {
  const [taxPayments, setTaxPayments] = useState<TaxPayment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<TaxPayment | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTaxPayments(demoTaxPayments);
      setPaymentMethods(demoPaymentMethods);
      setLoading(false);
    };

    fetchData();
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
      case 'pending':
        return { label: 'प्रलंबित', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'paid':
        return { label: 'भरले', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'overdue':
        return { label: 'ओव्हरड्यू', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'online':
        return { label: 'ऑनलाइन', color: 'bg-green-100 text-green-800' };
      case 'offline':
        return { label: 'ऑफलाइन', color: 'bg-blue-100 text-blue-800' };
      case 'both':
        return { label: 'दोन्ही', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'अज्ञात', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const totalPending = taxPayments.filter(p => p.status === 'pending').length;
  const totalAmount = taxPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">कर भरणा माहिती लोड होत आहे...</p>
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
              <CreditCard className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              ऑनलाइन कर भरणा
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            QR कोड इंटिग्रेशनसह सुरक्षित आणि सोयीस्कर कर भरणा
          </p>
        </motion.div>

        {/* Summary Cards */}
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
                  <p className="text-green-100 text-sm font-medium">प्रलंबित कर</p>
                  <p className="text-3xl font-bold">{totalPending}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">एकूण रक्कम</p>
                  <p className="text-3xl font-bold">{formatAmount(totalAmount)}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">पेमेंट पद्धती</p>
                  <p className="text-3xl font-bold">{paymentMethods.filter(m => m.isAvailable).length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <CreditCard className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tax Payments List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6 mb-12"
        >
          {taxPayments.map((payment, index) => {
            const statusInfo = getStatusInfo(payment.status);
            const methodInfo = getPaymentMethodInfo(payment.paymentMethod);
            const StatusIcon = statusInfo.icon;
            const PaymentIcon = payment.icon;

            return (
              <motion.div
                key={payment.id}
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
                        <div className={`p-3 rounded-xl ${payment.color} text-white`}>
                          <PaymentIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {payment.type}
                            </h3>
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                            <Badge className={methodInfo.color}>
                              {methodInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {payment.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              अंतिम मुदत: {formatDate(payment.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800 mb-2">
                          {formatAmount(payment.amount)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            तपशील
                          </Button>
                          {payment.status === 'pending' && (
                            <Button
                              onClick={() => setShowQRCode(true)}
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              QR कोड
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Payment Methods */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">पेमेंट पद्धती</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => {
              const MethodIcon = method.icon;

              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="transform transition-all duration-300"
                >
                  <Card className={`h-full overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    !method.isAvailable ? 'opacity-50' : ''
                  }`}>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-xl ${method.color} text-white mb-4`}>
                        <MethodIcon className="h-8 w-8" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {method.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {method.description}
                      </p>
                      <Button
                        className="w-full"
                        disabled={!method.isAvailable}
                        onClick={() => setSelectedMethod(method)}
                      >
                        {method.isAvailable ? 'वापरा' : 'लवकरच उपलब्ध'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Payment Details Modal */}
        <AnimatePresence>
          {selectedPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedPayment(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${selectedPayment.color} text-white`}>
                        <selectedPayment.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{selectedPayment.type}</h3>
                        <p className="text-gray-600">{selectedPayment.typeEn}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPayment(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">वर्णन</h4>
                      <p className="text-gray-600">{selectedPayment.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">रक्कम</h5>
                        <p className="text-2xl font-bold text-gray-800">{formatAmount(selectedPayment.amount)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-800 mb-2">अंतिम मुदत</h5>
                        <p className="text-gray-600">{formatDate(selectedPayment.dueDate)}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        className="flex-1"
                        onClick={() => window.open(selectedPayment.paymentUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        ऑनलाइन भरा
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowQRCode(true)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        QR कोड
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowQRCode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">QR कोड स्कॅन करा</h3>
                  <p className="text-gray-600">आपल्या फोनमध्ये QR कोड स्कॅन करून पेमेंट करा</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <img
                    src={selectedPayment?.qrCode || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Sample'}
                    alt="Payment QR Code"
                    className="mx-auto"
                  />
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPayment?.paymentUrl || '');
                      // You could add a toast notification here
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    लिंक कॉपी करा
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowQRCode(false)}
                  >
                    बंद करा
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Information */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">संपर्क माहिती</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mb-4 inline-flex">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">पेमेंट सहाय्य</h4>
              <p className="text-gray-600">+91 1800 123 4567</p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-4 inline-flex">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">ईमेल</h4>
              <p className="text-gray-600">payments@grampanchayat.gov.in</p>
            </div>
            <div className="text-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-4 inline-flex">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">कामकाजाची वेळ</h4>
              <p className="text-gray-600">सोम-शनि: ९:०० - ५:००</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
