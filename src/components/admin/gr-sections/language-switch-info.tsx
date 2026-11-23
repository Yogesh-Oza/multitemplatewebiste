'use client';

import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LanguageSwitchInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-teal-600" />
          भाषा बदल
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-700">
        <p>
          मराठी, हिंदी आणि इंग्रजी भाषांतर वेबसाइटच्या हेडरमधील भाषा बटणातून स्वयंचलितपणे उपलब्ध आहे
          (Google Translate).
        </p>
        <p className="text-gray-500">येथे फॉर्म भरण्याची गरज नाही. ही सुविधा आधीच सक्रिय आहे.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>मराठी (मुख्य भाषा)</li>
          <li>हिंदी</li>
          <li>English</li>
        </ul>
      </CardContent>
    </Card>
  );
}
