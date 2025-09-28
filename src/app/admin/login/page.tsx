import { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/admin-login-form';

export const metadata: Metadata = {
  title: 'प्रशासक लॉगिन - ग्रामपंचायत',
  description: 'प्रशासक लॉगिन पृष्ठ',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">ग्रा</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">प्रशासक लॉगिन</h1>
            <p className="text-gray-600 mt-2">ग्रामपंचायत प्रशासन पैनल</p>
          </div>
          
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
