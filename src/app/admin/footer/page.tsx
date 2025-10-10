'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Twitter, Instagram, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SocialMediaLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterContent {
  id?: string;
  description: string;
  socialMedia: SocialMediaLink[];
  officeName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export default function FooterContentPage() {
  const [footerContent, setFooterContent] = useState<FooterContent>({
    description: 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख. सर्वांसाठी विकास आणि समृद्धी.',
    socialMedia: [
      { platform: 'facebook', url: '', icon: 'Facebook' },
      { platform: 'twitter', url: '', icon: 'Twitter' },
      { platform: 'instagram', url: '', icon: 'Instagram' },
      { platform: 'youtube', url: '', icon: 'Youtube' }
    ],
    officeName: 'ग्रामपंचायत कार्यालय',
    address: 'गाव, तालुका, जिल्हा\nमहाराष्ट्र, भारत',
    phone: '+91 12345 67890',
    email: 'info@grampanchayat.com',
    website: 'mahagp.in'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const fetchFooterContent = async () => {
    try {
      const response = await fetch('/api/admin/footer-content');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setFooterContent({
            description: data.description || footerContent.description,
            socialMedia: data.socialMedia || footerContent.socialMedia,
            officeName: data.officeName || footerContent.officeName,
            address: data.address || footerContent.address,
            phone: data.phone || footerContent.phone,
            email: data.email || footerContent.email,
            website: data.website || footerContent.website
          });
        }
      }
    } catch (error) {
      console.error('Error fetching footer content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/footer-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerContent),
      });

      if (response.ok) {
        toast.success('Footer content saved successfully!');
      } else {
        toast.error('Failed to save footer content');
      }
    } catch (error) {
      console.error('Error saving footer content:', error);
      toast.error('Error saving footer content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSocialMediaChange = (index: number, field: keyof SocialMediaLink, value: string) => {
    const updatedSocialMedia = [...footerContent.socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [field]: value
    };
    setFooterContent({
      ...footerContent,
      socialMedia: updatedSocialMedia
    });
  };

  const addSocialMediaLink = () => {
    setFooterContent({
      ...footerContent,
      socialMedia: [
        ...footerContent.socialMedia,
        { platform: '', url: '', icon: '' }
      ]
    });
  };

  const removeSocialMediaLink = (index: number) => {
    const updatedSocialMedia = footerContent.socialMedia.filter((_, i) => i !== index);
    setFooterContent({
      ...footerContent,
      socialMedia: updatedSocialMedia
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Footer Content Management</h1>
          <p className="text-gray-600">Manage footer description and social media links</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Footer Description</CardTitle>
          <CardDescription>
            Edit the description text that appears in the footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description (Marathi)</Label>
              <Textarea
                id="description"
                value={footerContent.description}
                onChange={(e) => setFooterContent({ ...footerContent, description: e.target.value })}
                placeholder="Enter footer description..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Manage contact information that appears in the footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="officeName">Office Name</Label>
              <Input
                id="officeName"
                value={footerContent.officeName}
                onChange={(e) => setFooterContent({ ...footerContent, officeName: e.target.value })}
                placeholder="ग्रामपंचायत कार्यालय"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={footerContent.address}
                onChange={(e) => setFooterContent({ ...footerContent, address: e.target.value })}
                placeholder="गाव, तालुका, जिल्हा\nमहाराष्ट्र, भारत"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={footerContent.phone}
                  onChange={(e) => setFooterContent({ ...footerContent, phone: e.target.value })}
                  placeholder="+91 12345 67890"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={footerContent.email}
                  onChange={(e) => setFooterContent({ ...footerContent, email: e.target.value })}
                  placeholder="info@grampanchayat.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={footerContent.website}
                onChange={(e) => setFooterContent({ ...footerContent, website: e.target.value })}
                placeholder="mahagp.in"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>
            Manage social media links that appear in the footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {footerContent.socialMedia.map((link, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`platform-${index}`}>Platform</Label>
                    <Input
                      id={`platform-${index}`}
                      value={link.platform}
                      onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                      placeholder="facebook, twitter, instagram"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`url-${index}`}>URL</Label>
                    <Input
                      id={`url-${index}`}
                      value={link.url}
                      onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor={`icon-${index}`}>Icon</Label>
                    <Input
                      id={`icon-${index}`}
                      value={link.icon}
                      onChange={(e) => handleSocialMediaChange(index, 'icon', e.target.value)}
                      placeholder="Facebook, Twitter, Instagram"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocialMediaLink(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={addSocialMediaLink}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Social Media Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? 'Saving...' : 'Save Footer Content'}
        </Button>
      </div>
    </div>
  );
}
