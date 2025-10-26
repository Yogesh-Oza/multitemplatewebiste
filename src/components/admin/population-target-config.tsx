'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Save,
  Edit,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface PopulationTargets {
  below2000: string;
  between2000_5000: string;
  above5000: string;
}

interface PopulationTargetConfigProps {
  itemId: string;
  fieldName: string;
  currentTargets?: PopulationTargets;
  onSave: (itemId: string, targets: PopulationTargets) => void;
}

export default function PopulationTargetConfig({ 
  itemId, 
  fieldName, 
  currentTargets, 
  onSave 
}: PopulationTargetConfigProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [targets, setTargets] = useState<PopulationTargets>(
    currentTargets || {
      below2000: "100%",
      between2000_5000: "100%",
      above5000: "100%"
    }
  );

  const handleSave = () => {
    onSave(itemId, targets);
    setIsEditing(false);
    toast.success('Population targets updated successfully');
  };

  const handleCancel = () => {
    setTargets(currentTargets || {
      below2000: "100%",
      between2000_5000: "100%",
      above5000: "100%"
    });
    setIsEditing(false);
  };

  const getPopulationCategoryInfo = (category: keyof PopulationTargets) => {
    switch (category) {
      case 'below2000':
        return { label: 'Below 2000', description: 'Villages with population < 2000', color: 'bg-blue-100 text-blue-800' };
      case 'between2000_5000':
        return { label: '2000-5000', description: 'Villages with population 2000-5000', color: 'bg-green-100 text-green-800' };
      case 'above5000':
        return { label: 'Above 5000', description: 'Villages with population > 5000', color: 'bg-purple-100 text-purple-800' };
    }
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            <div>
              <CardTitle className="text-lg">Population-based Targets</CardTitle>
              <CardDescription>{fieldName}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Targets
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(targets).map(([category, value]) => {
            const info = getPopulationCategoryInfo(category as keyof PopulationTargets);
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{info.label}</span>
                    <Badge variant="outline" className={info.color}>
                      {info.description}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Target</span>
                  </div>
                </div>
                {isEditing ? (
                  <Input
                    value={value}
                    onChange={(e) => setTargets(prev => ({ ...prev, [category]: e.target.value }))}
                    placeholder="e.g., 100%, 90%, 80%"
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-mono text-lg">{value}</span>
                    <Badge variant="secondary">Target</Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {!isEditing && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Target className="h-4 w-4" />
              <span className="font-medium">Target Configuration</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              These targets will be automatically applied based on the village's population category when village admins fill the form.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
