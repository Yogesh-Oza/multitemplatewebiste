'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Crown, Plus, Edit, Save, X, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { Leader } from './types';

export function LeadersSection() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(true);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [isUploadingLeaderImage, setIsUploadingLeaderImage] = useState(false);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch('/api/leaders');
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      }
    } catch (error) {
      console.error('Error fetching leaders:', error);
      toast.error('नेते लोड करताना त्रुटी');
    } finally {
      setIsLoadingLeaders(false);
    }
  };

  const handleSaveLeader = async () => {
    if (!editingLeader) return;
    if (!editingLeader.name || !editingLeader.role || !editingLeader.roleEn || !editingLeader.imageUrl) {
      toast.error('कृपया सर्व फील्ड भरा');
      return;
    }

    try {
      const url = '/api/leaders';
      const method = editingLeader.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLeader),
      });

      if (response.ok) {
        toast.success(editingLeader.id ? 'नेता अपडेट केला' : 'नेता जोडला');
        setEditingLeader(null);
        fetchLeaders();
      } else {
        throw new Error('Failed to save leader');
      }
    } catch (error) {
      console.error('Error saving leader:', error);
      toast.error('नेता सेव्ह करताना त्रुटी');
    }
  };

  const handleDeleteLeader = async (id: string) => {
    if (!confirm('तुम्हाला खात्री आहे की तुम्ही हा नेता हटवू इच्छिता?')) return;
    
    try {
      const response = await fetch(`/api/leaders/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('नेता हटवला');
        fetchLeaders();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('हटवताना त्रुटी');
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="leaders">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">आपले नेते व पदसोपान रचना</h2>
                <p className="text-sm text-gray-600">मा. मुख्यमंत्री, मा. उपमुख्यमंत्री, मंत्रीमंडळ आणि संबंधित विभागीय अधिकारी</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {leaders.filter(l => l.isActive).length} सक्रिय
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 pt-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setEditingLeader({
                  name: '',
                  role: '',
                  roleEn: '',
                  imageUrl: '',
                  order: leaders.length,
                  isActive: true
                })}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                नवीन नेता जोडा
              </Button>
            </div>

            {/* Add/Edit Leader Form */}
            {editingLeader && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Crown className="h-5 w-5 mr-2" />
                      {editingLeader.id ? 'नेता संपादित करा' : 'नवीन नेता जोडा'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingLeader(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leaderName">नाव</Label>
                      <Input
                        id="leaderName"
                        value={editingLeader.name}
                        onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                        placeholder="Shri. Devendra Fadnavis"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leaderRole">पद (मराठी)</Label>
                      <Input
                        id="leaderRole"
                        value={editingLeader.role}
                        onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                        placeholder="मा. मुख्यमंत्री"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leaderRoleEn">पद (इंग्रजी)</Label>
                      <Input
                        id="leaderRoleEn"
                        value={editingLeader.roleEn}
                        onChange={(e) => setEditingLeader({ ...editingLeader, roleEn: e.target.value })}
                        placeholder="Hon'ble Chief Minister"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leaderOrder">क्रम</Label>
                      <Input
                        id="leaderOrder"
                        type="number"
                        value={editingLeader.order}
                        onChange={(e) => setEditingLeader({ ...editingLeader, order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>प्रतिमा</Label>
                    <div className="mt-2">
                      <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Upload className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">प्रतिमा अपलोड करा</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsUploadingLeaderImage(true);
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              const uploadResponse = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });

                              if (uploadResponse.ok) {
                                const uploadData = await uploadResponse.json();
                                setEditingLeader({ ...editingLeader, imageUrl: uploadData.imageUrl || uploadData.url });
                                toast.success('प्रतिमा अपलोड केली');
                              } else {
                                toast.error('प्रतिमा अपलोड करताना त्रुटी');
                              }
                            } catch (error) {
                              console.error('Upload error:', error);
                              toast.error('प्रतिमा अपलोड करताना त्रुटी');
                            } finally {
                              setIsUploadingLeaderImage(false);
                            }
                          }}
                          disabled={isUploadingLeaderImage}
                        />
                      </label>
                      {editingLeader.imageUrl && (
                        <div className="mt-2">
                          <img src={editingLeader.imageUrl} alt="Preview" className="h-20 w-20 rounded object-cover border" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingLeader.isActive}
                        onChange={(e) => setEditingLeader({ ...editingLeader, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">सक्रिय</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingLeader(null)}
                    >
                      रद्द करा
                    </Button>
                    <Button
                      onClick={handleSaveLeader}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      सेव्ह करा
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaders Grid */}
            <div>
              {isLoadingLeaders ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-gray-600">लोड होत आहे...</span>
                </div>
              ) : leaders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">अजून कोणतेही नेते जोडलेले नाहीत</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leaders.map((leader) => (
                    <Card key={leader.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          {leader.imageUrl ? (
                            <img
                              src={leader.imageUrl}
                              alt={leader.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Crown className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge 
                            variant={leader.isActive ? "default" : "secondary"}
                            className={leader.isActive ? "bg-green-500" : "bg-gray-500"}
                          >
                            {leader.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-700 text-sm mb-1">{leader.role}</h4>
                        <h3 className="font-bold text-gray-900 mb-1">{leader.name}</h3>
                        <p className="text-xs text-gray-500 mb-4">{leader.roleEn}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingLeader(leader)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            संपादित
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteLeader(leader.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

