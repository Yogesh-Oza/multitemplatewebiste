'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TrendingUp, Plus, Edit, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ProgressMetric } from './types';

export function ProgressMetricsSection() {
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [editingMetric, setEditingMetric] = useState<ProgressMetric | null>(null);

  useEffect(() => {
    fetchProgressMetrics();
  }, []);

  const fetchProgressMetrics = async () => {
    try {
      const response = await fetch('/api/progress-metrics');
      if (response.ok) {
        const data = await response.json();
        setProgressMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching progress metrics:', error);
      toast.error('मेट्रिक्स लोड करताना त्रुटी');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleSaveMetric = async () => {
    if (!editingMetric) return;
    if (!editingMetric.key || !editingMetric.label || !editingMetric.labelEn) {
      toast.error('कृपया सर्व फील्ड भरा');
      return;
    }

    try {
      const url = '/api/progress-metrics';
      const method = editingMetric.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMetric),
      });

      if (response.ok) {
        toast.success(editingMetric.id ? 'मेट्रिक अपडेट केला' : 'मेट्रिक जोडला');
        setEditingMetric(null);
        fetchProgressMetrics();
      } else {
        throw new Error('Failed to save metric');
      }
    } catch (error) {
      console.error('Error saving metric:', error);
      toast.error('मेट्रिक सेव्ह करताना त्रुटी');
    }
  };

  const handleDeleteMetric = async (id: string) => {
    if (!confirm('तुम्हाला खात्री आहे की तुम्ही हा मेट्रिक हटवू इच्छिता?')) return;
    
    try {
      const response = await fetch(`/api/progress-metrics/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('मेट्रिक हटवला');
        fetchProgressMetrics();
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
      <AccordionItem value="progress-metrics">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">प्रगती मीटर</h2>
                <p className="text-sm text-gray-600">समृद्ध पंचायत योजना प्रगती, स्वच्छता टक्केवारी, नळजोडणी कव्हरेज इत्यादी</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {progressMetrics.filter(m => m.isActive).length} सक्रिय
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 pt-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setEditingMetric({
                  key: '',
                  label: '',
                  labelEn: '',
                  value: 0,
                  unit: '%',
                  target: 100,
                  icon: 'TrendingUp',
                  color: 'blue',
                  order: progressMetrics.length,
                  isActive: true
                })}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                नवीन मेट्रिक जोडा
              </Button>
            </div>

            {/* Add/Edit Metric Form */}
            {editingMetric && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {editingMetric.id ? 'मेट्रिक संपादित करा' : 'नवीन मेट्रिक जोडा'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMetric(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="metricKey">Key</Label>
                      <Input
                        id="metricKey"
                        value={editingMetric.key}
                        onChange={(e) => setEditingMetric({ ...editingMetric, key: e.target.value })}
                        placeholder="sanitation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricLabel">लेबल (मराठी)</Label>
                      <Input
                        id="metricLabel"
                        value={editingMetric.label}
                        onChange={(e) => setEditingMetric({ ...editingMetric, label: e.target.value })}
                        placeholder="स्वच्छता कव्हरेज"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricLabelEn">लेबल (इंग्रजी)</Label>
                      <Input
                        id="metricLabelEn"
                        value={editingMetric.labelEn}
                        onChange={(e) => setEditingMetric({ ...editingMetric, labelEn: e.target.value })}
                        placeholder="Sanitation Coverage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricValue">मूल्य</Label>
                      <Input
                        id="metricValue"
                        type="number"
                        value={editingMetric.value}
                        onChange={(e) => setEditingMetric({ ...editingMetric, value: parseFloat(e.target.value) || 0 })}
                        placeholder="85"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricUnit">युनिट</Label>
                      <Input
                        id="metricUnit"
                        value={editingMetric.unit}
                        onChange={(e) => setEditingMetric({ ...editingMetric, unit: e.target.value })}
                        placeholder="%, झाडे"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricTarget">लक्ष्य</Label>
                      <Input
                        id="metricTarget"
                        type="number"
                        value={editingMetric.target}
                        onChange={(e) => setEditingMetric({ ...editingMetric, target: parseFloat(e.target.value) || 0 })}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricIcon">Icon</Label>
                      <Input
                        id="metricIcon"
                        value={editingMetric.icon}
                        onChange={(e) => setEditingMetric({ ...editingMetric, icon: e.target.value })}
                        placeholder="CheckCircle, Zap, Droplets, TreePine"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricColor">रंग</Label>
                      <Input
                        id="metricColor"
                        value={editingMetric.color}
                        onChange={(e) => setEditingMetric({ ...editingMetric, color: e.target.value })}
                        placeholder="green, blue, yellow"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricOrder">क्रम</Label>
                      <Input
                        id="metricOrder"
                        type="number"
                        value={editingMetric.order}
                        onChange={(e) => setEditingMetric({ ...editingMetric, order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingMetric.isActive}
                        onChange={(e) => setEditingMetric({ ...editingMetric, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">सक्रिय</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingMetric(null)}
                    >
                      रद्द करा
                    </Button>
                    <Button
                      onClick={handleSaveMetric}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      सेव्ह करा
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metrics Grid */}
            <div>
              {isLoadingMetrics ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-600">लोड होत आहे...</span>
                </div>
              ) : progressMetrics.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">अजून कोणतेही मेट्रिक्स जोडलेले नाहीत</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {progressMetrics.map((metric) => (
                    <Card key={metric.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            variant={metric.isActive ? "default" : "secondary"}
                            className={metric.isActive ? "bg-green-500" : "bg-gray-500"}
                          >
                            {metric.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                          </Badge>
                          <span className="text-xs text-gray-500">क्रम: {metric.order}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{metric.label}</h4>
                        <p className="text-sm text-gray-500 mb-2">{metric.labelEn}</p>
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {metric.value}{metric.unit}
                        </div>
                        <p className="text-xs text-gray-500 mb-4">लक्ष्य: {metric.target}{metric.unit}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingMetric(metric)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            संपादित
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteMetric(metric.id!)}
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

