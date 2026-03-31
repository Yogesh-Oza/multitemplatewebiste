'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import {
  UPLOAD_ACCEPT_ATTR,
  UPLOAD_MAX_FILE_SIZE_MB,
  validateUploadFile,
} from '@/lib/upload-policy';
import { uploadFileFromBrowser } from '@/lib/browser-upload';

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ 
  onUpload, 
  currentImage, 
  accept = UPLOAD_ACCEPT_ATTR,
  maxSize = UPLOAD_MAX_FILE_SIZE_MB,
  className = ''
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateUploadFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUploading(true);

    try {
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }

      const data = await uploadFileFromBrowser(file);
      onUpload(data.url || data.imageUrl);
      toast.success('फाइल यशस्वीरित्या अपलोड केली');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'फाइल अपलोड करताना त्रुटी आली');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={handleClick}
        >
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isUploading ? 'अपलोड होत आहे...' : 'फाइल अपलोड करा'}
              </p>
              <p className="text-xs text-gray-500">
                Supported by upload policy (max {maxSize}MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {!preview && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full"
        >
          <Paperclip className="h-4 w-4 mr-2" />
          {isUploading ? 'अपलोड होत आहे...' : 'फाइल निवडा'}
        </Button>
      )}
    </div>
  );
}
