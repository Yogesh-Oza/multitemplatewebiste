'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Layout, Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { FooterContent, SocialMediaLink } from './types';

export function FooterContentSection() {
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
  const [isLoadingFooter, setIsLoadingFooter] = useState(true);
  const [isSavingFooter, setIsSavingFooter] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState({
    satyamev: false,
    digitalIndia: false,
  });

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
            website: data.website || footerContent.website,
            footerSatyamevJayateLogoUrl: data.footerSatyamevJayateLogoUrl,
            footerDigitalIndiaLogoUrl: data.footerDigitalIndiaLogoUrl,
            footerGovDeptText: data.footerGovDeptText,
            footerOwnershipText: data.footerOwnershipText
          });
        }
      }
    } catch (error) {
      console.error('Error fetching footer content:', error);
      toast.error('फुटर सामग्री लोड करताना त्रुटी');
    } finally {
      setIsLoadingFooter(false);
    }
  };

  const handleSaveFooter = async () => {
    setIsSavingFooter(true);
    try {
      const response = await fetch('/api/admin/footer-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerContent),
      });

      if (response.ok) {
        toast.success('फुटर सामग्री सेव्ह केली');
      } else {
        toast.error('फुटर सामग्री सेव्ह करताना त्रुटी');
      }
    } catch (error) {
      console.error('Error saving footer content:', error);
      toast.error('फुटर सामग्री सेव्ह करताना त्रुटी');
    } finally {
      setIsSavingFooter(false);
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

  const handleFooterFileUpload = async (file: File, type: 'satyamev' | 'digitalIndia') => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया फक्त प्रतिमा फाइल निवडा');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('फाइल आकार 5MB पेक्षा कमी असावा');
      return;
    }

    setUploadingFooter(prev => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const fieldName = type === 'satyamev' ? 'footerSatyamevJayateLogoUrl' : 'footerDigitalIndiaLogoUrl';
        setFooterContent(prev => ({ ...prev, [fieldName]: result.imageUrl || result.url }));
        toast.success(`${type === 'satyamev' ? 'Satyamev Jayate' : 'Digital India'} लोगो अपलोड झाले`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'अपलोड अयशस्वी');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'अपलोड अयशस्वी');
    } finally {
      setUploadingFooter(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="footer-content">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <Layout className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">Footer Content Management</h2>
                <p className="text-sm text-gray-600">Manage footer description and social media links</p>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 pt-4">
            {/* Footer Description */}
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
                    <Label htmlFor="footerDescription">Description (Marathi)</Label>
                    <Textarea
                      id="footerDescription"
                      value={footerContent.description}
                      onChange={(e) => setFooterContent({ ...footerContent, description: e.target.value })}
                      placeholder="Enter footer description..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
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

            {/* Social Media Links */}
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

            {/* Government Branding */}
            <Card>
              <CardHeader>
                <CardTitle>सरकारी ब्रँडिंग (फुटर)</CardTitle>
                <CardDescription>
                  फुटरमधील सरकारी लोगो आणि मजकूर व्यवस्थापन
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Satyamev Jayate Logo */}
                  <div className="space-y-3">
                    <Label>Satyamev Jayate लोगो</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input 
                          value={footerContent.footerSatyamevJayateLogoUrl || ''}
                          onChange={(e) => setFooterContent(prev => ({ ...prev, footerSatyamevJayateLogoUrl: e.target.value }))}
                          placeholder="/images/gov-logos/satyamev_jayate_logo.png" 
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                          <Upload className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">
                            {uploadingFooter.satyamev ? 'अपलोड करत आहे...' : 'फाइल निवडा'}
                          </span>
                          <input
                            type="file"
                            accept={process.env.NEXT_PUBLIC_UPLOAD_ALLOWED_FILE_TYPES || 'image/*'}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFooterFileUpload(file, 'satyamev');
                            }}
                            disabled={uploadingFooter.satyamev}
                          />
                        </label>
                        {footerContent.footerSatyamevJayateLogoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFooterContent(prev => ({ ...prev, footerSatyamevJayateLogoUrl: '' }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {footerContent.footerSatyamevJayateLogoUrl && (
                      <div className="mt-2">
                        <div className="inline-block p-2 border rounded-lg bg-gray-50">
                          <img
                            src={footerContent.footerSatyamevJayateLogoUrl}
                            alt="Satyamev Jayate Preview"
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Digital India Logo */}
                  <div className="space-y-3">
                    <Label>Digital India लोगो</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input 
                          value={footerContent.footerDigitalIndiaLogoUrl || ''}
                          onChange={(e) => setFooterContent(prev => ({ ...prev, footerDigitalIndiaLogoUrl: e.target.value }))}
                          placeholder="/images/gov-logos/digital-india.png" 
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                          <Upload className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">
                            {uploadingFooter.digitalIndia ? 'अपलोड करत आहे...' : 'फाइल निवडा'}
                          </span>
                          <input
                            type="file"
                            accept={process.env.NEXT_PUBLIC_UPLOAD_ALLOWED_FILE_TYPES || 'image/*'}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFooterFileUpload(file, 'digitalIndia');
                            }}
                            disabled={uploadingFooter.digitalIndia}
                          />
                        </label>
                        {footerContent.footerDigitalIndiaLogoUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFooterContent(prev => ({ ...prev, footerDigitalIndiaLogoUrl: '' }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {footerContent.footerDigitalIndiaLogoUrl && (
                      <div className="mt-2">
                        <div className="inline-block p-2 border rounded-lg bg-gray-50">
                          <img
                            src={footerContent.footerDigitalIndiaLogoUrl}
                            alt="Digital India Preview"
                            width={80}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Government Department Text */}
                  <div className="space-y-2">
                    <Label htmlFor="footerGovDeptText">विभाग मजकूर</Label>
                    <Input
                      id="footerGovDeptText"
                      value={footerContent.footerGovDeptText || ''}
                      onChange={(e) => setFooterContent(prev => ({ ...prev, footerGovDeptText: e.target.value }))}
                      placeholder="शासन महाराष्ट्र • ग्रामीण विकास विभाग"
                    />
                    <p className="text-xs text-gray-500">हे मजकूर फुटरमधील सरकारी ब्रँडिंग विभागात दिसेल</p>
                  </div>

                  {/* Ownership Text */}
                  <div className="space-y-2">
                    <Label htmlFor="footerOwnershipText">मालकी मजकूर</Label>
                    <Input
                      id="footerOwnershipText"
                      value={footerContent.footerOwnershipText || ''}
                      onChange={(e) => setFooterContent(prev => ({ ...prev, footerOwnershipText: e.target.value }))}
                      placeholder="या संकेतस्थळाचे मालक: ग्रामपंचायत कार्यालय"
                    />
                    <p className="text-xs text-gray-500">हे मजकूर फुटरमधील मालकी विभागात दिसेल</p>
                  </div>

                  {/* File Upload Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">फाइल अपलोड माहिती</h4>
                        <p className="text-xs text-blue-700 mt-1">
                          • JPG, PNG, WebP स्वरूपातील प्रतिमा स्वीकारल्या जातात<br/>
                          • कमाल फाइल आकार: 5MB<br/>
                          • लोगो साठी शिफारस केलेले आकार: Satyamev Jayate (40x40px), Digital India (80x32px)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveFooter}
                disabled={isSavingFooter}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSavingFooter ? 'Saving...' : 'Save Footer Content'}
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

