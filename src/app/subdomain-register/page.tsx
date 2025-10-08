'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Globe, Mail, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface SubdomainFormData {
  subdomain: string;
  villageName: string;
  villageNameEn: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

export default function SubdomainRegisterPage() {
  const [formData, setFormData] = useState<SubdomainFormData>({
    subdomain: '',
    villageName: '',
    villageNameEn: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateSubdomain = (subdomain: string) => {
    const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return regex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 20;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSubdomain(formData.subdomain)) {
      toast.error('Invalid subdomain format. Use only lowercase letters, numbers, and hyphens (3-20 characters)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subdomain/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Subdomain registration successful! Check your email for login details.');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your subdomain <strong>{formData.subdomain}.mahagp.in</strong> has been created.
            </p>
            <p className="text-sm text-gray-500">
              Check your email for login credentials and setup instructions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Village Website
          </h1>
          <p className="text-xl text-gray-600">
            Get your own subdomain and start building your gram panchayat website
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              Subdomain Registration
            </CardTitle>
            <CardDescription>
              Fill in your village details to get started with your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subdomain Input */}
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain Name</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => setFormData({...formData, subdomain: e.target.value.toLowerCase()})}
                    placeholder="your-village-name"
                    className="flex-1"
                    required
                  />
                  <Badge variant="outline" className="whitespace-nowrap">
                    .mahagp.in
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Only lowercase letters, numbers, and hyphens allowed (3-20 characters)
                </p>
              </div>

              {/* Village Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="villageName">Village Name (Marathi)</Label>
                  <Input
                    id="villageName"
                    value={formData.villageName}
                    onChange={(e) => setFormData({...formData, villageName: e.target.value})}
                    placeholder="गावाचे नाव"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="villageNameEn">Village Name (English)</Label>
                  <Input
                    id="villageNameEn"
                    value={formData.villageNameEn}
                    onChange={(e) => setFormData({...formData, villageNameEn: e.target.value})}
                    placeholder="Village Name"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="village@example.com"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Village Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Complete village address with taluka, district, state"
                  rows={3}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Village Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description about your village, its history, or special features"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !validateSubdomain(formData.subdomain)}
              >
                {isSubmitting ? 'Creating Subdomain...' : 'Create My Village Website'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Custom Subdomain</h3>
              <p className="text-sm text-gray-600">Your village gets its own website URL</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Easy Management</h3>
              <p className="text-sm text-gray-600">Simple admin panel to update content</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Professional Design</h3>
              <p className="text-sm text-gray-600">Beautiful, responsive website template</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
