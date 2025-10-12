'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  nameMarathi?: string;
}

interface InfiniteSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  disabled?: boolean;
}

export function InfiniteSelect({
  options,
  value,
  onChange,
  placeholder,
  loading,
  hasMore,
  onLoadMore,
  searchTerm,
  onSearchChange,
  disabled = false
}: InfiniteSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchTerm);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll to load more
  const handleScroll = useCallback(() => {
    if (!listRef.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  // Handle search
  const handleSearchChange = (term: string) => {
    setSearchInput(term);
    onSearchChange(term);
  };

  // Handle option selection
  const handleOptionClick = (option: Option) => {
    onChange(option.id);
    setIsOpen(false);
  };

  // Get selected option
  const selectedOption = options.find(option => option.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption 
            ? `${selectedOption.name}${selectedOption.nameMarathi ? ` (${selectedOption.nameMarathi})` : ''}`
            : placeholder
          }
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              autoFocus
            />
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-48 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                  value === option.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{option.name}</span>
                  {option.nameMarathi && (
                    <span className="text-sm text-gray-500">{option.nameMarathi}</span>
                  )}
                </div>
              </button>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-500">Loading more...</span>
              </div>
            )}

            {/* No more data indicator */}
            {!hasMore && options.length > 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No more items
              </div>
            )}

            {/* No results */}
            {options.length === 0 && !loading && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
