'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import ForgotPasswordModal from './forgot-password-modal';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Check for subdomain mismatch error
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'subdomain_mismatch') {
      toast.error('आपण या सबडोमेनसाठी अधिकृत नाही. कृपया योग्य सबडोमेनवर लॉगिन करा.');
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
        callbackUrl: window.location.origin + '/admin'
      });
      if (result?.ok) {
        toast.success('लॉगिन यशस्वी!');
        router.push('/admin');
      } else {
        // Check if it's a subdomain mismatch error
        if (result?.error === 'CredentialsSignin') {
          toast.error('अवैध वापरकर्ता नाव किंवा पासवर्ड, किंवा आपण या सबडोमेनसाठी अधिकृत नाही');
        } else {
          toast.error('अवैध वापरकर्ता नाव किंवा पासवर्ड');
        }
      }
    } catch (error) {
      toast.error('त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">वापरकर्ता नाव</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="वापरकर्ता नाव"
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="password">पासवर्ड</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="पासवर्ड"
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        disabled={isLoading}
      >
        {isLoading ? 'लॉगिन करत आहे...' : 'लॉगिन करा'}
      </Button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
        >
          पासवर्ड विसरलात?
        </button>
      </div>
      
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </form>
  );
}
