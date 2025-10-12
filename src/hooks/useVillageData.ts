'use client';

import { useState, useEffect, useCallback } from 'react';

interface District {
  id: string;
  name: string;
  nameMarathi: string;
}

interface SubDistrict {
  id: string;
  name: string;
  nameMarathi: string;
  districtId: string;
}

interface Village {
  id: string;
  name: string;
  nameMarathi: string;
  subDistrictId: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

interface UseVillageDataReturn {
  districts: District[];
  subDistricts: SubDistrict[];
  villages: Village[];
  loading: {
    districts: boolean;
    subDistricts: boolean;
    villages: boolean;
  };
  error: string | null;
  pagination: {
    districts: PaginationInfo | null;
    subDistricts: PaginationInfo | null;
    villages: PaginationInfo | null;
  };
  fetchDistricts: (page?: number, append?: boolean, search?: string) => Promise<void>;
  fetchSubDistricts: (districtId: string, page?: number, append?: boolean) => Promise<void>;
  fetchVillages: (subDistrictId: string, search?: string, page?: number, append?: boolean) => Promise<void>;
  clearDistricts: () => void;
  clearSubDistricts: () => void;
  clearVillages: () => void;
}

export function useVillageData(): UseVillageDataReturn {
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState({
    districts: false,
    subDistricts: false,
    villages: false
  });
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    districts: null as PaginationInfo | null,
    subDistricts: null as PaginationInfo | null,
    villages: null as PaginationInfo | null
  });

  // Fetch districts on mount
  useEffect(() => {
    fetchDistricts();
  }, []);

  // Fetch districts function
  const fetchDistricts = useCallback(async (page: number = 1, append: boolean = false, search?: string) => {
    setLoading(prev => ({ ...prev, districts: true }));
    setError(null);

    try {
      const url = new URL('/api/villages/districts', window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', '20');
      if (search) {
        url.searchParams.set('search', search);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      const data = await response.json();
      
      if (append && page > 1) {
        setDistricts(prev => [...prev, ...data.data]);
      } else {
        setDistricts(data.data);
      }
      
      setPagination(prev => ({
        ...prev,
        districts: data.pagination
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch districts');
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  }, []);

  // Fetch sub-districts
  const fetchSubDistricts = useCallback(async (districtId: string, page: number = 1, append: boolean = false) => {
    if (!districtId) return;

    setLoading(prev => ({ ...prev, subDistricts: true }));
    setError(null);

    try {
      const response = await fetch(`/api/villages/subdistricts?districtId=${encodeURIComponent(districtId)}&page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch sub-districts');
      }
      const data = await response.json();
      
      if (append && page > 1) {
        setSubDistricts(prev => [...prev, ...data.data]);
      } else {
        setSubDistricts(data.data);
      }
      
      setPagination(prev => ({
        ...prev,
        subDistricts: data.pagination
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sub-districts');
    } finally {
      setLoading(prev => ({ ...prev, subDistricts: false }));
    }
  }, []);

  // Fetch villages
  const fetchVillages = useCallback(async (subDistrictId: string, search?: string, page: number = 1, append: boolean = false) => {
    if (!subDistrictId) return;

    setLoading(prev => ({ ...prev, villages: true }));
    setError(null);

    try {
      const url = new URL('/api/villages/villages', window.location.origin);
      url.searchParams.set('subDistrictId', subDistrictId);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('limit', '20');
      if (search) {
        url.searchParams.set('search', search);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch villages');
      }
      const data = await response.json();
      
      if (append && page > 1) {
        setVillages(prev => [...prev, ...data.data]);
      } else {
        setVillages(data.data);
      }
      
      setPagination(prev => ({
        ...prev,
        villages: data.pagination
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch villages');
    } finally {
      setLoading(prev => ({ ...prev, villages: false }));
    }
  }, []);

  // Clear functions
  const clearDistricts = useCallback(() => {
    setDistricts([]);
  }, []);

  const clearSubDistricts = useCallback(() => {
    setSubDistricts([]);
  }, []);

  const clearVillages = useCallback(() => {
    setVillages([]);
  }, []);

  return {
    districts,
    subDistricts,
    villages,
    loading,
    error,
    pagination,
    fetchDistricts,
    fetchSubDistricts,
    fetchVillages,
    clearDistricts,
    clearSubDistricts,
    clearVillages
  };
}
