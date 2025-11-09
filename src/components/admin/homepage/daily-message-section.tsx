'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageSquare, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { DailyMessage } from './types';

export function DailyMessageSection() {
  const [dailyMessage, setDailyMessage] = useState<DailyMessage | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(true);
  const [editingMessage, setEditingMessage] = useState<DailyMessage | null>(null);

  useEffect(() => {
    fetchDailyMessage();
  }, []);

  const fetchDailyMessage = async () => {
    try {
      const response = await fetch('/api/daily-messages');
      if (response.ok) {
        const data = await response.json();
        setDailyMessage(data);
      }
    } catch (error) {
      console.error('Error fetching daily message:', error);
      toast.error('संदेश लोड करताना त्रुटी');
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const handleSaveMessage = async () => {
    if (!editingMessage) return;
    if (!editingMessage.message || !editingMessage.authorTitle) {
      toast.error('कृपया सर्व फील्ड भरा');
      return;
    }

    try {
      const url = '/api/daily-messages';
      const method = editingMessage.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMessage),
      });

      if (response.ok) {
        toast.success(editingMessage.id ? 'संदेश अपडेट केला' : 'संदेश जोडला');
        setEditingMessage(null);
        fetchDailyMessage();
      } else {
        throw new Error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('संदेश सेव्ह करताना त्रुटी');
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="daily-message">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">आजचा सुविचार / पंचायत संदेश</h2>
                <p className="text-sm text-gray-600">ग्रामपंचायत नेतृत्वाकडून नागरिकांसाठी प्रेरणादायी संदेश</p>
              </div>
            </div>
            {dailyMessage && (
              <Badge variant={dailyMessage.isActive ? "default" : "secondary"} className={dailyMessage.isActive ? "bg-green-500" : "bg-gray-500"}>
                {dailyMessage.isActive ? 'सक्रिय' : 'निष्क्रिय'}
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 pt-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setEditingMessage(dailyMessage || {
                  message: '',
                  authorTitle: 'सरपंच',
                  date: new Date().toLocaleDateString('mr-IN'),
                  category: 'governance',
                  icon: 'User',
                  color: 'from-blue-500 to-indigo-600',
                  isActive: true
                })}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {dailyMessage ? 'संदेश संपादित करा' : 'नवीन संदेश जोडा'}
              </Button>
            </div>

            {/* Current Message Display */}
            {dailyMessage && !editingMessage && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-lg text-gray-800 mb-4 italic">"{dailyMessage.message}"</p>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">{dailyMessage.authorTitle}</span>
                        <span className="text-sm text-gray-500">{dailyMessage.date}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={dailyMessage.isActive ? "default" : "secondary"}
                      className={dailyMessage.isActive ? "bg-green-500" : "bg-gray-500"}
                    >
                      {dailyMessage.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add/Edit Message Form */}
            {editingMessage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      {editingMessage.id ? 'संदेश संपादित करा' : 'नवीन संदेश जोडा'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMessage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="messageText">संदेश</Label>
                    <textarea
                      id="messageText"
                      value={editingMessage.message}
                      onChange={(e) => setEditingMessage({ ...editingMessage, message: e.target.value })}
                      placeholder="एकत्रित विकास, सामाजिक न्याय..."
                      className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="messageAuthor">लेखक पद</Label>
                      <Input
                        id="messageAuthor"
                        value={editingMessage.authorTitle}
                        onChange={(e) => setEditingMessage({ ...editingMessage, authorTitle: e.target.value })}
                        placeholder="सरपंच"
                      />
                    </div>
                    <div>
                      <Label htmlFor="messageDate">दिनांक</Label>
                      <Input
                        id="messageDate"
                        value={editingMessage.date}
                        onChange={(e) => setEditingMessage({ ...editingMessage, date: e.target.value })}
                        placeholder={new Date().toLocaleDateString('mr-IN')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="messageCategory">श्रेणी</Label>
                      <Input
                        id="messageCategory"
                        value={editingMessage.category}
                        onChange={(e) => setEditingMessage({ ...editingMessage, category: e.target.value })}
                        placeholder="governance"
                      />
                    </div>
                    <div>
                      <Label htmlFor="messageIcon">Icon</Label>
                      <Input
                        id="messageIcon"
                        value={editingMessage.icon}
                        onChange={(e) => setEditingMessage({ ...editingMessage, icon: e.target.value })}
                        placeholder="User, Lightbulb, Heart"
                      />
                    </div>
                    <div>
                      <Label htmlFor="messageColor">रंग</Label>
                      <Input
                        id="messageColor"
                        value={editingMessage.color}
                        onChange={(e) => setEditingMessage({ ...editingMessage, color: e.target.value })}
                        placeholder="from-blue-500 to-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingMessage.isActive}
                        onChange={(e) => setEditingMessage({ ...editingMessage, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">सक्रिय</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingMessage(null)}
                    >
                      रद्द करा
                    </Button>
                    <Button
                      onClick={handleSaveMessage}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      सेव्ह करा
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

