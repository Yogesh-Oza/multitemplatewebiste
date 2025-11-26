'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'काहीतरी चुकीचे झाले');
      }

      setSuccess(true);
      toast.success('पासवर्ड रीसेट लिंक आपल्या ईमेलवर पाठवला गेला आहे');
    } catch (err: any) {
      setError(err.message || 'काहीतरी चुकीचे झाले');
      toast.error(err.message || 'काहीतरी चुकीचे झाले');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>पासवर्ड विसरलात?</CardTitle>
            <CardDescription>
              आपला ईमेल किंवा वापरकर्ता नाव प्रविष्ट करा
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800 font-medium">
                    पासवर्ड रीसेट लिंक आपल्या ईमेलवर पाठवला गेला आहे
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    कृपया आपला ईमेल तपासा आणि नवीन पासवर्ड सेट करण्यासाठी लिंकवर क्लिक करा.
                  </p>
                </div>
              </div>
              <Button onClick={handleClose} className="w-full">
                बंद करा
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div>
                <Label htmlFor="email">ईमेल किंवा वापरकर्ता नाव</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="ईमेल किंवा वापरकर्ता नाव"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  रद्द करा
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {loading ? 'पाठवत आहे...' : 'पाठवा'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

