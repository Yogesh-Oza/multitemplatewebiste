'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QrCode as QrCodeIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { QRCodeSettings } from './types';
import { extractUpiId, extractPayeeName, buildUpiString } from '@/lib/upi-utils';

interface UpiFormData {
  propertyTaxUpiId: string;
  propertyTaxPayeeName: string;
  waterTaxUpiId: string;
  waterTaxPayeeName: string;
}

export function QRCodeSettingsSection() {
  const [qrSettings, setQrSettings] = useState<QRCodeSettings | null>(null);
  const [upiFormData, setUpiFormData] = useState<UpiFormData>({
    propertyTaxUpiId: '',
    propertyTaxPayeeName: '',
    waterTaxUpiId: '',
    waterTaxPayeeName: '',
  });
  const [isLoadingQrSettings, setIsLoadingQrSettings] = useState(true);
  const [isSavingQrSettings, setIsSavingQrSettings] = useState(false);

  useEffect(() => {
    fetchQrSettings();
  }, []);

  const fetchQrSettings = async () => {
    try {
      const response = await fetch('/api/qr-code-settings');
      if (response.ok) {
        const data = await response.json();
        setQrSettings(data);
        
        // Extract UPI ID and payee name from existing full UPI strings
        setUpiFormData({
          propertyTaxUpiId: extractUpiId(data.propertyTaxQrData || ''),
          propertyTaxPayeeName: extractPayeeName(data.propertyTaxQrData || ''),
          waterTaxUpiId: extractUpiId(data.waterTaxQrData || ''),
          waterTaxPayeeName: extractPayeeName(data.waterTaxQrData || ''),
        });
      }
    } catch (error) {
      console.error('Error fetching QR settings:', error);
      toast.error('QR सेटिंग्स लोड करताना त्रुटी');
    } finally {
      setIsLoadingQrSettings(false);
    }
  };

  const handleSave = async () => {
    if (!qrSettings) return;
    
    // Validate UPI IDs
    if (!upiFormData.propertyTaxUpiId || !upiFormData.waterTaxUpiId) {
      toast.error('कृपया दोन्ही UPI ID भरा');
      return;
    }

    // Build full UPI strings from UPI IDs
    const propertyTaxQrData = buildUpiString(
      upiFormData.propertyTaxUpiId,
      upiFormData.propertyTaxPayeeName,
      'Property Tax'
    );
    const waterTaxQrData = buildUpiString(
      upiFormData.waterTaxUpiId,
      upiFormData.waterTaxPayeeName,
      'Water Tax'
    );

    const settingsToSave = {
      ...qrSettings,
      propertyTaxQrData,
      waterTaxQrData,
    };

    setIsSavingQrSettings(true);
    try {
      const response = await fetch('/api/qr-code-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToSave),
      });

      if (response.ok) {
        toast.success('QR सेटिंग्स सेव्ह केल्या');
        fetchQrSettings();
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving QR settings:', error);
      toast.error('सेटिंग्स सेव्ह करताना त्रुटी');
    } finally {
      setIsSavingQrSettings(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="qr-settings">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <QrCodeIcon className="h-5 w-5 text-emerald-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">QR कोड सेटिंग्स</h2>
                <p className="text-sm text-gray-600">QR कोडद्वारे कर भरण्यासाठी सेटिंग्स</p>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-4">
            {isLoadingQrSettings ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-2 text-gray-600">लोड होत आहे...</span>
              </div>
            ) : qrSettings ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCodeIcon className="h-5 w-5 mr-2" />
                    QR कोड सेटिंग्स
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Property Tax Section */}
                    <div className="md:col-span-2">
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">मालमत्ता कर (Property Tax)</h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="propertyTaxUpiId">UPI ID *</Label>
                            <Input
                              id="propertyTaxUpiId"
                              type="text"
                              value={upiFormData.propertyTaxUpiId}
                              onChange={(e) => setUpiFormData({ ...upiFormData, propertyTaxUpiId: e.target.value })}
                              placeholder="rupeshmore2006@okaxis"
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">फक्त UPI ID टाइप करा (उदा: yourname@okaxis, yourname@paytm)</p>
                          </div>
                          <div>
                            <Label htmlFor="propertyTaxPayeeName">पेमेंट नाव (Payee Name)</Label>
                            <Input
                              id="propertyTaxPayeeName"
                              type="text"
                              value={upiFormData.propertyTaxPayeeName}
                              onChange={(e) => setUpiFormData({ ...upiFormData, propertyTaxPayeeName: e.target.value })}
                              placeholder="Rupesh More"
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">वैकल्पिक - UPI पेमेंटमध्ये दिसणारे नाव</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="propertyTaxInstruction">मालमत्ता कर सूचना</Label>
                      <textarea
                        id="propertyTaxInstruction"
                        value={qrSettings.propertyTaxInstruction}
                        onChange={(e) => setQrSettings({ ...qrSettings, propertyTaxInstruction: e.target.value })}
                        className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                      />
                    </div>
                    
                    {/* Water Tax Section */}
                    <div className="md:col-span-2">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">पाणी कर (Water Tax)</h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="waterTaxUpiId">UPI ID *</Label>
                            <Input
                              id="waterTaxUpiId"
                              type="text"
                              value={upiFormData.waterTaxUpiId}
                              onChange={(e) => setUpiFormData({ ...upiFormData, waterTaxUpiId: e.target.value })}
                              placeholder="rupeshmore2006@okaxis"
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">फक्त UPI ID टाइप करा (उदा: yourname@okaxis, yourname@paytm)</p>
                          </div>
                          <div>
                            <Label htmlFor="waterTaxPayeeName">पेमेंट नाव (Payee Name)</Label>
                            <Input
                              id="waterTaxPayeeName"
                              type="text"
                              value={upiFormData.waterTaxPayeeName}
                              onChange={(e) => setUpiFormData({ ...upiFormData, waterTaxPayeeName: e.target.value })}
                              placeholder="Rupesh More"
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">वैकल्पिक - UPI पेमेंटमध्ये दिसणारे नाव</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="waterTaxInstruction">पाणी कर सूचना</Label>
                      <textarea
                        id="waterTaxInstruction"
                        value={qrSettings.waterTaxInstruction}
                        onChange={(e) => setQrSettings({ ...qrSettings, waterTaxInstruction: e.target.value })}
                        className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={isSavingQrSettings}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isSavingQrSettings ? 'सेव्ह होत आहे...' : 'सेटिंग्स सेव्ह करा'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <QrCodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">QR सेटिंग्स लोड करताना त्रुटी</p>
                </CardContent>
              </Card>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

