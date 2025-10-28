'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  location: string;
  contactInfo: string;
  workingHours: string;
  imageUrl: string;
  isActive: boolean;
}

const categoryColors = {
  'पाणी': 'bg-blue-500',
  'वीज': 'bg-yellow-500',
  'स्वच्छता': 'bg-green-500',
  'वाहतूक': 'bg-purple-500',
  'संचार': 'bg-pink-500',
  'शिक्षण': 'bg-indigo-500',
  'आरोग्य': 'bg-red-500',
  'अन्य': 'bg-gray-500'
};

export function FacilitiesSection() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('सर्व');

  const categories = ['सर्व', 'पाणी', 'वीज', 'स्वच्छता', 'वाहतूक', 'संचार', 'शिक्षण', 'आरोग्य', 'अन्य'];

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch('/api/facilities');
        if (response.ok) {
          const data = await response.json();
          setFacilities(data.filter((facility: Facility) => facility.isActive));
        } else {
          setError('सुविधा लोड करताना त्रुटी आली');
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
        setError('सुविधा लोड करताना त्रुटी आली');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const filteredFacilities = selectedCategory === 'सर्व' 
    ? facilities 
    : facilities.filter(facility => facility.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">सुविधा लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 text-white mr-4">
              <Wrench className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              सुविधा
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            गावातील विविध सुविधा आणि त्यांची माहिती
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* GIS-style Map */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">ग्राम पायाभूत नकाशा (GIS-style Map)</h3>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="h-72 w-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Map Placeholder
            </div>
            {filteredFacilities.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                {filteredFacilities.length} सुविधा दर्शवित आहेत • श्रेणी: {selectedCategory}
              </div>
            )}
          </div>
        </div>

        {/* Facilities Grid */}
        {filteredFacilities.length === 0 ? (
          <div className="text-center py-16">
            <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              कोणतीही सुविधा सापडली नाही
            </h3>
            <p className="text-gray-500">
              {selectedCategory === 'सर्व' 
                ? 'अद्याप कोणतीही सुविधा जोडली गेली नाही'
                : `${selectedCategory} श्रेणीत कोणतीही सुविधा नाही`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((facility) => (
              <Card key={facility.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                {/* Image Section */}
                {facility.imageUrl && (
                  <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-200">
                    <img
                      src={facility.imageUrl}
                      alt={facility.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={`${categoryColors[facility.category as keyof typeof categoryColors] || 'bg-gray-500'} text-white`}>
                        {facility.category}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white">
                      <Wrench className="h-6 w-6" />
                    </div>
                    {!facility.imageUrl && (
                      <Badge className={`${categoryColors[facility.category as keyof typeof categoryColors] || 'bg-gray-500'} text-white`}>
                        {facility.category}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {facility.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {facility.description}
                  </CardDescription>
                </CardHeader>

                {/* Content */}
                <CardContent className="space-y-4">
                  {/* Location */}
                  {facility.location && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-green-600" />
                        स्थान
                      </h4>
                      <p className="text-sm text-gray-600">
                        {facility.location}
                      </p>
                    </div>
                  )}

                  {/* Contact Information */}
                  {facility.contactInfo && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        संपर्क
                      </h4>
                      <p className="text-sm text-gray-600">
                        {facility.contactInfo}
                      </p>
                    </div>
                  )}
                  
                  {/* Working Hours */}
                  {facility.workingHours && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-600" />
                        कामाचे तास
                      </h4>
                      <p className="text-sm text-gray-600">
                        {facility.workingHours}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        // You can add contact functionality here
                        if (facility.contactInfo) {
                          // Try to extract phone number or open contact
                          if (facility.contactInfo.includes('@')) {
                            window.open(`mailto:${facility.contactInfo}`);
                          } else {
                            window.open(`tel:${facility.contactInfo}`);
                          }
                        }
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      संपर्क करा
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {facilities.length > 0 && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {facilities.length}
                </div>
                <div className="text-gray-600">एकूण सुविधा</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {facilities.filter(f => f.isActive).length}
                </div>
                <div className="text-gray-600">सक्रिय सुविधा</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {new Set(facilities.map(f => f.category)).size}
                </div>
                <div className="text-gray-600">श्रेण्या</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {facilities.filter(f => f.imageUrl).length}
                </div>
                <div className="text-gray-600">प्रतिमा सह</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
