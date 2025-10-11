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
  fetchSubDistricts: (districtId: string) => Promise<void>;
  fetchVillages: (subDistrictId: string, search?: string) => Promise<void>;
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

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(prev => ({ ...prev, districts: true }));
      setError(null);

      try {
        const response = await fetch('/api/villages/districts');
        if (!response.ok) {
          throw new Error('Failed to fetch districts');
        }
        const data = await response.json();
        setDistricts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch districts');
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, []);

  // Fetch sub-districts
  const fetchSubDistricts = useCallback(async (districtId: string) => {
    if (!districtId) return;

    setLoading(prev => ({ ...prev, subDistricts: true }));
    setError(null);

    try {
      const response = await fetch(`/api/villages/subdistricts?districtId=${encodeURIComponent(districtId)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sub-districts');
      }
      const data = await response.json();
      setSubDistricts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sub-districts');
    } finally {
      setLoading(prev => ({ ...prev, subDistricts: false }));
    }
  }, []);

  // Fetch villages
  const fetchVillages = useCallback(async (subDistrictId: string, search?: string) => {
    if (!subDistrictId) return;

    setLoading(prev => ({ ...prev, villages: true }));
    setError(null);

    try {
      const url = new URL('/api/villages/villages', window.location.origin);
      url.searchParams.set('subDistrictId', subDistrictId);
      if (search) {
        url.searchParams.set('search', search);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch villages');
      }
      const data = await response.json();
      setVillages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch villages');
    } finally {
      setLoading(prev => ({ ...prev, villages: false }));
    }
  }, []);

  // Clear functions
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
    fetchSubDistricts,
    fetchVillages,
    clearSubDistricts,
    clearVillages
  };
}
