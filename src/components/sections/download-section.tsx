'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileText, 
  File, 
  Image, 
  Archive,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  User,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface DownloadableFile {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: 'form' | 'document' | 'pdf' | 'image' | 'archive';
  type: string;
  size: string;
  url: string;
  downloads: number;
  lastUpdated: string;
  required: boolean;
  tags: string[] | any;
}

interface DownloadSectionProps {
  files?: DownloadableFile[];
}

export default function DownloadSection({ files: propFiles = [] }: DownloadSectionProps) {
  const [files, setFiles] = useState<DownloadableFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (propFiles.length > 0) {
      setFiles(propFiles);
      setIsLoading(false);
    } else {
      fetchFiles();
    }
  }, [propFiles]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/downloadable-files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo data for when no files are available
  const demoFiles: DownloadableFile[] = [
    {
      id: 'file-1',
      name: 'संपत्ती कर फॉर्म',
      nameEn: 'Property Tax Form',
      description: 'संपत्ती कर भरण्यासाठी आवश्यक फॉर्म',
      descriptionEn: 'Required form for property tax payment',
      category: 'form',
      type: 'PDF',
      size: '245 KB',
      url: '/documents/property-tax-form.pdf',
      downloads: 156,
      lastUpdated: '2024-12-01',
      required: true,
      tags: ['कर', 'फॉर्म', 'संपत्ती']
    },
    {
      id: 'file-2',
      name: 'आधार कार्ड फॉर्म',
      nameEn: 'Aadhaar Card Form',
      description: 'आधार कार्डसाठी अर्ज फॉर्म',
      descriptionEn: 'Application form for Aadhaar card',
      category: 'form',
      type: 'PDF',
      size: '180 KB',
      url: '/documents/aadhaar-form.pdf',
      downloads: 89,
      lastUpdated: '2024-11-28',
      required: true,
      tags: ['आधार', 'फॉर्म', 'अर्ज']
    },
    {
      id: 'file-3',
      name: 'ग्रामसभा अजेंडा',
      nameEn: 'Gram Sabha Agenda',
      description: 'ग्रामसभा बैठकीचा अजेंडा',
      descriptionEn: 'Agenda for Gram Sabha meeting',
      category: 'document',
      type: 'PDF',
      size: '320 KB',
      url: '/documents/gram-sabha-agenda.pdf',
      downloads: 234,
      lastUpdated: '2024-12-01',
      required: false,
      tags: ['ग्रामसभा', 'अजेंडा', 'बैठक']
    },
    {
      id: 'file-4',
      name: 'योजना मार्गदर्शिका',
      nameEn: 'Scheme Guidelines',
      description: 'सरकारी योजनांची मार्गदर्शिका',
      descriptionEn: 'Guidelines for government schemes',
      category: 'pdf',
      type: 'PDF',
      size: '2.1 MB',
      url: '/documents/scheme-guidelines.pdf',
      downloads: 445,
      lastUpdated: '2024-11-25',
      required: false,
      tags: ['योजना', 'मार्गदर्शिका', 'सरकारी']
    },
    {
      id: 'file-5',
      name: 'गाव नकाशा',
      nameEn: 'Village Map',
      description: 'गावाचा विस्तृत नकाशा',
      descriptionEn: 'Detailed map of the village',
      category: 'image',
      type: 'JPG',
      size: '1.8 MB',
      url: '/documents/village-map.jpg',
      downloads: 123,
      lastUpdated: '2024-11-20',
      required: false,
      tags: ['नकाशा', 'गाव', 'स्थान']
    },
    {
      id: 'file-6',
      name: 'निवडणूक नियम',
      nameEn: 'Election Rules',
      description: 'ग्रामपंचायत निवडणुकीचे नियम',
      descriptionEn: 'Rules for Gram Panchayat elections',
      category: 'document',
      type: 'PDF',
      size: '1.5 MB',
      url: '/documents/election-rules.pdf',
      downloads: 67,
      lastUpdated: '2024-11-15',
      required: false,
      tags: ['निवडणुका', 'नियम', 'ग्रामपंचायत']
    },
    {
      id: 'file-7',
      name: 'स्वच्छता अभियान साहित्य',
      nameEn: 'Sanitation Campaign Material',
      description: 'स्वच्छता अभियानासाठी साहित्य',
      descriptionEn: 'Material for sanitation campaign',
      category: 'archive',
      type: 'ZIP',
      size: '5.2 MB',
      url: '/documents/sanitation-campaign.zip',
      downloads: 78,
      lastUpdated: '2024-11-10',
      required: false,
      tags: ['स्वच्छता', 'अभियान', 'साहित्य']
    },
    {
      id: 'file-8',
      name: 'बजेट अंदाजपत्रक',
      nameEn: 'Budget Estimates',
      description: 'वर्ष २०२४-२५ चे बजेट अंदाजपत्रक',
      descriptionEn: 'Budget estimates for year 2024-25',
      category: 'pdf',
      type: 'PDF',
      size: '3.4 MB',
      url: '/documents/budget-estimates.pdf',
      downloads: 189,
      lastUpdated: '2024-11-05',
      required: false,
      tags: ['बजेट', 'अंदाजपत्रक', 'आर्थिक']
    }
  ];

  // Normalize tags from JSON if needed
  const normalizeFiles = (filesData: DownloadableFile[]) => {
    return filesData.map(file => ({
      ...file,
      tags: Array.isArray(file.tags) ? file.tags : (typeof file.tags === 'string' ? JSON.parse(file.tags) : [])
    }));
  };

  const normalizedFiles = normalizeFiles(files);
  const displayFiles = normalizedFiles.length > 0 ? normalizedFiles : demoFiles;

  const categories = [
    { value: 'all', label: 'सर्व', labelEn: 'All', icon: FileText },
    { value: 'form', label: 'फॉर्म', labelEn: 'Forms', icon: FileText },
    { value: 'document', label: 'दस्तावेज', labelEn: 'Documents', icon: File },
    { value: 'pdf', label: 'पीडीएफ', labelEn: 'PDFs', icon: FileText },
    { value: 'image', label: 'चित्रे', labelEn: 'Images', icon: Image },
    { value: 'archive', label: 'आर्काइव्ह', labelEn: 'Archives', icon: Archive }
  ];

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'form':
        return FileText;
      case 'document':
        return File;
      case 'pdf':
        return FileText;
      case 'image':
        return Image;
      case 'archive':
        return Archive;
      default:
        return FileText;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'text-red-600 bg-red-100';
      case 'DOC':
      case 'DOCX':
        return 'text-blue-600 bg-blue-100';
      case 'JPG':
      case 'PNG':
        return 'text-green-600 bg-green-100';
      case 'ZIP':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredFiles = displayFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-purple-100">
            <Download className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            डाउनलोड विभाग
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Download Section
        </p>
        <p className="text-gray-500 max-w-3xl mx-auto">
          फॉर्म, कागदपत्रे, पीडीएफ आणि इतर महत्त्वाचे दस्तावेज डाउनलोड करा
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="फाइल शोधा... (Search files...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.value)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => {
          const categoryInfo = getCategoryInfo(file.category);
          const FileIcon = getFileIcon(file.category);

          return (
            <Card key={file.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      <FileIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                        {file.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{file.nameEn}</p>
                    </div>
                  </div>
                  {file.required && (
                    <Badge className="bg-red-100 text-red-700">
                      आवश्यक
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="line-clamp-2">{file.description}</p>
                  <p className="text-xs text-gray-500">{file.descriptionEn}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* File Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">प्रकार:</span>
                    <Badge className={`${getFileTypeColor(file.type)}`}>
                      {file.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">आकार:</span>
                    <span className="font-medium">{file.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">डाउनलोड:</span>
                    <span className="font-medium">{file.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">अद्यतन:</span>
                    <span className="font-medium">
                      {new Date(file.lastUpdated).toLocaleDateString('mr-IN')}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 text-sm">टॅग</h4>
                  <div className="flex flex-wrap gap-1">
                    {file.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    डाउनलोड
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredFiles.length === 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              कोणतीही फाइल सापडली नाही
            </h3>
            <p className="text-gray-500 mb-4">
              आपल्या शोध निकषांशी जुळणारी कोणतीही फाइल उपलब्ध नाही
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              फिल्टर रीसेट करा
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <div className="text-center">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Download className="h-8 w-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                सर्व फाइल्स डाउनलोड करा
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              सर्व फॉर्म, दस्तावेज आणि पीडीएफ एकाच ठिकाणी उपलब्ध
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Archive className="h-4 w-4 mr-2" />
                सर्व डाउनलोड करा
              </Button>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                <ExternalLink className="h-4 w-4 mr-2" />
                अर्काइव्ह पहा
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
