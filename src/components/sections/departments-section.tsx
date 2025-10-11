'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  head: string;
  headEn: string;
  phone: string;
  email: string;
  address: string;
  addressEn: string;
  workingHours: string;
  workingHoursEn: string;
  services: string[];
  servicesEn: string[];
  imageUrl: string;
  isActive: boolean;
}

export function DepartmentsSection() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (response.ok) {
          const data = await response.json();
          setDepartments(data.filter((dept: Department) => dept.isActive));
        } else {
          setError('विभाग लोड करताना त्रुटी आली');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError('विभाग लोड करताना त्रुटी आली');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">विभाग लोड होत आहे...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
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
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white mr-4">
              <Building className="h-8 w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              विभाग
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ग्रामपंचायतातील विविध विभाग आणि त्यांची सेवा
          </p>
        </div>

        {/* Departments Grid */}
        {departments.length === 0 ? (
          <div className="text-center py-16">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              कोणताही विभाग सापडला नाही
            </h3>
            <p className="text-gray-500">
              अद्याप कोणताही विभाग जोडला गेला नाही
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((department) => (
              <Card key={department.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                {/* Image Section */}
                {department.imageUrl && (
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-200">
                    <img
                      src={department.imageUrl}
                      alt={department.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        सक्रिय
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <Building className="h-6 w-6" />
                    </div>
                    {!department.imageUrl && (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        सक्रिय
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {department.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {department.description}
                  </CardDescription>
                </CardHeader>

                {/* Content */}
                <CardContent className="space-y-4">
                  {/* Head Information */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      प्रमुख
                    </h4>
                    <p className="text-sm text-gray-600">
                      {department.head}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    {department.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-green-600" />
                        <span>{department.phone}</span>
                      </div>
                    )}
                    
                    {department.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{department.email}</span>
                      </div>
                    )}
                    
                    {department.address && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-red-600 mt-0.5" />
                        <span>{department.address}</span>
                      </div>
                    )}
                    
                    {department.workingHours && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-purple-600" />
                        <span>{department.workingHours}</span>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  {department.services && department.services.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700">
                        सेवा
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {department.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {department.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{department.services.length - 3} अधिक
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        // You can add contact functionality here
                        if (department.phone) {
                          window.open(`tel:${department.phone}`);
                        } else if (department.email) {
                          window.open(`mailto:${department.email}`);
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
        {departments.length > 0 && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {departments.length}
                </div>
                <div className="text-gray-600">एकूण विभाग</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {departments.filter(d => d.isActive).length}
                </div>
                <div className="text-gray-600">सक्रिय विभाग</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {departments.reduce((total, dept) => total + (dept.services?.length || 0), 0)}
                </div>
                <div className="text-gray-600">एकूण सेवा</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
