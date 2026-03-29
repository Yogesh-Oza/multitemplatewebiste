'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, FileText, Building, Users, Calendar, MapPin } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  titleEn: string;
  content?: string;
  contentEn?: string;
  description?: string;
  descriptionEn?: string;
  type: string;
  typeLabel: string;
  typeLabelEn: string;
  createdAt: string;
  category?: string;
  status?: string;
  number?: string;
  /** Deep link override for governance modules */
  navPath?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
}

export function SearchModal({ isOpen, onClose, subdomain }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const recent = localStorage.getItem(`recent-searches-${subdomain}`);
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, [subdomain]);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
      
      // Save to recent searches
      if (searchQuery.trim()) {
        const newRecent = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem(`recent-searches-${subdomain}`, JSON.stringify(newRecent));
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const timeoutId = setTimeout(() => handleSearch(value), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'project':
        return <Building className="h-4 w-4 text-green-600" />;
      case 'government-resolution':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'cultural-heritage':
        return <Users className="h-4 w-4 text-orange-600" />;
      case 'program':
        return <Calendar className="h-4 w-4 text-indigo-600" />;
      case 'facility':
        return <MapPin className="h-4 w-4 text-red-600" />;
      case 'department':
        return <Building className="h-4 w-4 text-gray-600" />;
      case 'government-scheme':
        return <FileText className="h-4 w-4 text-teal-600" />;
      case 'communication-post':
        return <FileText className="h-4 w-4 text-cyan-600" />;
      case 'gram-sabha':
        return <Users className="h-4 w-4 text-amber-600" />;
      case 'rti-disclosure':
        return <FileText className="h-4 w-4 text-slate-700" />;
      case 'village-statistics':
        return <MapPin className="h-4 w-4 text-emerald-600" />;
      case 'citizen-service':
        return <FileText className="h-4 w-4 text-green-700" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResultUrl = (result: SearchResult) => {
    if (result.navPath) return result.navPath;
    switch (result.type) {
      case 'announcement':
        return '/announcements';
      case 'project':
        return '/projects';
      case 'government-resolution':
        return '/gr';
      case 'cultural-heritage':
        return '/cultural-heritage';
      case 'program':
        return '/programs';
      case 'facility':
        return '/amenities';
      case 'department':
        return '/departments';
      case 'government-scheme':
        return '/gov-programs';
      default:
        return '/';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('mr-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center px-4 pt-16 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          {/* Search Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-white" />
              <input
                ref={inputRef}
                type="text"
                placeholder="माहिती शोधा... (Search information...)"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/80 focus:outline-none text-lg"
              />
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">शोधत आहे...</span>
              </div>
            ) : query.trim().length > 0 ? (
              results.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {results.map((result) => (
                    <a
                      key={result.id}
                      href={getResultUrl(result)}
                      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex items-start gap-3">
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {result.title}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {result.typeLabel}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {result.content || result.description || result.titleEn}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatDate(result.createdAt)}</span>
                            {result.category && (
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {result.category}
                              </span>
                            )}
                            {result.status && (
                              <span className={`px-2 py-1 rounded ${
                                result.status === 'completed' ? 'bg-green-100 text-green-800' :
                                result.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {result.status === 'completed' ? 'पूर्ण' :
                                 result.status === 'ongoing' ? 'चालू' : 'आगामी'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    काहीही सापडले नाही
                  </h3>
                  <p className="text-gray-600">
                    "{query}" साठी कोणतीही माहिती सापडली नाही. कृपया वेगळे शब्द वापरून पुन्हा प्रयत्न करा.
                  </p>
                </div>
              )
            ) : recentSearches.length > 0 ? (
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">अलीकडील शोध</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  माहिती शोधा
                </h3>
                <p className="text-gray-600">
                  घोषणा, प्रकल्प, योजना, सुविधा आणि इतर माहिती शोधण्यासाठी वरील बॉक्समध्ये टाइप करा.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
