'use client';

import { useState, useMemo } from 'react';
import { Download, Calendar, Building, Search, Filter, Eye, CheckCircle, Info } from 'lucide-react';

interface Resolution {
  id: string;
  number: string;
  title: string;
  titleEn: string;
  department: string;
  departmentEn: string;
  date: string;
  category: string;
  categoryEn: string;
  priority: string;
  priorityEn: string;
  description: string;
  descriptionEn: string;
  fileUrl: string;
  isActive: boolean;
}

interface GRContentProps {
  initialResolutions: Resolution[];
  isDemoData?: boolean;
}

export function GRContent({ initialResolutions, isDemoData = false }: GRContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  // Get unique categories from resolutions
  const categories = useMemo(() => {
    const uniqueCategories = new Set(initialResolutions.map(r => r.category));
    const categoryList = Array.from(uniqueCategories).map(cat => {
      const resolution = initialResolutions.find(r => r.category === cat);
      return {
        value: cat,
        label: cat,
        labelEn: resolution?.categoryEn || cat
      };
    });
    return [
      { value: 'all', label: 'सर्व', labelEn: 'All' },
      ...categoryList
    ];
  }, [initialResolutions]);

  const priorities = [
    { value: 'all', label: 'सर्व', labelEn: 'All' },
    { value: 'उच्च', label: 'उच्च', labelEn: 'High' },
    { value: 'मध्यम', label: 'मध्यम', labelEn: 'Medium' },
    { value: 'कमी', label: 'कमी', labelEn: 'Low' }
  ];

  // Filter resolutions
  const filteredResolutions = useMemo(() => {
    return initialResolutions.filter(resolution => {
      // Category filter
      if (selectedCategory !== 'all' && resolution.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && resolution.priority !== selectedPriority) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          resolution.title,
          resolution.titleEn,
          resolution.number,
          resolution.department,
          resolution.departmentEn,
          resolution.description,
          resolution.descriptionEn
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [initialResolutions, selectedCategory, selectedPriority, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = initialResolutions.length;
    const active = initialResolutions.filter(r => r.isActive).length;
    const highPriority = initialResolutions.filter(r => r.priority === 'उच्च').length;
    const uniqueDepartments = new Set(initialResolutions.map(r => r.department)).size;

    return { total, active, highPriority, uniqueDepartments };
  }, [initialResolutions]);

  return (
    <>
      {isDemoData && (
        <div className="container pt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Info className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Demo Content Preview</p>
              <p className="text-sm text-amber-800">
                Live government resolutions are not available yet for this village. Displaying sample data until
                entries are added from the admin panel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.total}
            </div>
            <div className="text-gray-600">एकूण निर्णय</div>
            <div className="text-sm text-gray-500">Total Resolutions</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.active}
            </div>
            <div className="text-gray-600">सक्रिय</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.highPriority}
            </div>
            <div className="text-gray-600">उच्च प्राधान्य</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.uniqueDepartments}
            </div>
            <div className="text-gray-600">विभाग</div>
            <div className="text-sm text-gray-500">Departments</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            फिल्टर (Filters)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">श्रेणी</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label} ({category.labelEn})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">प्राधान्य</label>
              <select 
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label} ({priority.labelEn})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">शोध</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="निर्णय शोधा..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-8">
        {filteredResolutions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg">कोणतेही निर्णय सापडले नाहीत</p>
            <p className="text-gray-500 text-sm mt-2">No resolutions found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredResolutions.map((resolution) => (
              <div key={resolution.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {resolution.number}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resolution.priority === 'उच्च' ? 'bg-red-100 text-red-800' :
                        resolution.priority === 'मध्यम' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {resolution.priority}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {resolution.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{resolution.titleEn}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{resolution.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(resolution.date).toLocaleDateString('mr-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {resolution.fileUrl && (
                      <>
                        <button 
                          onClick={() => window.open(resolution.fileUrl, '_blank')}
                          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          पहा
                        </button>
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = resolution.fileUrl;
                            link.download = resolution.fileUrl.split('/').pop() || 'document.pdf';
                            link.target = '_blank';
                            link.click();
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          डाउनलोड
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {resolution.description && (
                  <p className="text-gray-700 mb-4">
                    {resolution.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {resolution.category}
                  </span>
                  {resolution.isActive && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      सक्रिय
                    </span>
                  )}
                  {resolution.fileUrl && (
                    <span className="text-gray-500">
                      PDF: {resolution.fileUrl.split('/').pop()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

