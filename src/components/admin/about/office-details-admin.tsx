'use client';

import { useEffect, useState } from 'react';
import { Building, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface OfficeDetails {
  id: string;
  address: string;
  addressEn: string;
  phone: string;
  email: string;
  workingHours: string;
  workingHoursEn: string;
  importantNotice?: string;
  importantNoticeEn?: string;
  isDemo?: boolean;
}

const emptyForm = {
  address: '',
  addressEn: '',
  phone: '',
  email: '',
  workingHours: '',
  workingHoursEn: '',
  importantNotice: '',
  importantNoticeEn: '',
};

export function OfficeDetailsAdmin() {
  const [officeDetails, setOfficeDetails] = useState<OfficeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const fetchOfficeDetails = async () => {
    try {
      const response = await fetch('/api/office-details');
      if (response.ok) {
        const data = await response.json();
        setOfficeDetails(data);
        if (!data.isDemo) {
          setFormData({
            address: data.address || '',
            addressEn: data.addressEn || '',
            phone: data.phone || '',
            email: data.email || '',
            workingHours: data.workingHours || '',
            workingHoursEn: data.workingHoursEn || '',
            importantNotice: data.importantNotice || '',
            importantNoticeEn: data.importantNoticeEn || '',
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('कार्यालय माहिती लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficeDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/office-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('save failed');
      await fetchOfficeDetails();
      setIsModalOpen(false);
      toast.success('कार्यालय माहिती सेव्ह केली');
    } catch {
      toast.error('कार्यालय माहिती सेव्ह करताना त्रुटी');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            कार्यालय पत्ता, वेळ आणि संपर्क
          </CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {officeDetails && !officeDetails.isDemo ? 'संपादित करा' : 'जोडा'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>लोड होत आहे...</p>
        ) : officeDetails && !officeDetails.isDemo ? (
          <div className="space-y-3 text-sm">
            <div>
              <Label>पत्ता (मराठी)</Label>
              <p className="text-gray-700 whitespace-pre-wrap">{officeDetails.address}</p>
            </div>
            <div>
              <Label>फोन</Label>
              <p className="text-gray-700">{officeDetails.phone}</p>
            </div>
            <div>
              <Label>ईमेल</Label>
              <p className="text-gray-700">{officeDetails.email}</p>
            </div>
            <div>
              <Label>कामकाजाची वेळ</Label>
              <p className="text-gray-700">{officeDetails.workingHours}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">कृपया कार्यालय माहिती जोडा</p>
        )}
      </CardContent>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">कार्यालय माहिती</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>पत्ता (मराठी) *</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>पत्ता (इंग्रजी)</Label>
                <Textarea
                  value={formData.addressEn}
                  onChange={(e) => setFormData((p) => ({ ...p, addressEn: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>फोन *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>ईमेल</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>कामकाजाची वेळ (मराठी) *</Label>
                <Input
                  value={formData.workingHours}
                  onChange={(e) => setFormData((p) => ({ ...p, workingHours: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>कामकाजाची वेळ (इंग्रजी)</Label>
                <Input
                  value={formData.workingHoursEn}
                  onChange={(e) => setFormData((p) => ({ ...p, workingHoursEn: e.target.value }))}
                />
              </div>
              <div>
                <Label>महत्त्वाची सूचना (मराठी)</Label>
                <Textarea
                  value={formData.importantNotice}
                  onChange={(e) => setFormData((p) => ({ ...p, importantNotice: e.target.value }))}
                />
              </div>
              <div>
                <Label>महत्त्वाची सूचना (इंग्रजी)</Label>
                <Textarea
                  value={formData.importantNoticeEn}
                  onChange={(e) => setFormData((p) => ({ ...p, importantNoticeEn: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  रद्द करा
                </Button>
                <Button type="submit">सेव्ह करा</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
