'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  X, 
  AlertTriangle,
  Trash2,
  User,
  Globe
} from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'user' | 'subdomain';
  title: string;
  description: string;
  itemName: string;
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  description,
  itemName,
  loading = false
}: ConfirmationModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (confirmationText !== 'DELETE') {
      setError('You must type "DELETE" exactly to confirm.');
      return;
    }
    onConfirm();
  };

  const handleClose = () => {
    setConfirmationText('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-900">{title}</CardTitle>
              <CardDescription className="text-red-700">{description}</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warning Content */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-red-900">
                  {type === 'subdomain' ? (
                    <>
                      This will permanently delete <strong>{itemName}</strong> and ALL associated data including:
                    </>
                  ) : (
                    <>
                      This will permanently delete user <strong>{itemName}</strong> and:
                    </>
                  )}
                </p>
                
                {type === 'subdomain' ? (
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• Village Information (गाव माहिती)</li>
                    <li>• Announcements (सूचना)</li>
                    <li>• Cultural Heritage (सांस्कृतिक वारसा)</li>
                    <li>• Hero Images (मुख्य प्रतिमा)</li>
                    <li>• History Cards (इतिहास)</li>
                    <li>• Programs (कार्यक्रम)</li>
                    <li>• Gallery (गॅलरी)</li>
                    <li>• Facilities (सुविधा)</li>
                    <li>• Contacts (संपर्क)</li>
                    <li>• Team Members (ग्राम पंचायत कार्यकारणी)</li>
                    <li>• Income/Expense (जमा-खर्च)</li>
                    <li>• Departments (विभाग)</li>
                    <li>• Government Schemes (सरकारी योजना)</li>
                    <li>• And all other associated data</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• Remove the user from the system</li>
                    <li>• Revoke all admin access</li>
                    <li>• Delete user account permanently</li>
                  </ul>
                )}
                
                <p className="font-semibold text-red-900 mt-3">
                  ⚠️ This action CANNOT be undone!
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <strong>"DELETE"</strong> to confirm permanent deletion:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                setError('');
              }}
              placeholder="Type DELETE here"
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirm}
              disabled={loading || confirmationText !== 'DELETE'}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  {type === 'subdomain' ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <Trash2 className="h-4 w-4" />
                </>
              )}
              <span>
                {loading ? 'Deleting...' : `Delete ${type === 'subdomain' ? 'Subdomain' : 'User'}`}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
