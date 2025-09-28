import { useState, useEffect } from 'react';

interface VillageInfo {
  id: string;
  title: string;
  description: string;
  titleEn: string;
  descriptionEn: string;
  families: number;
  population: number;
  gramPanchayatCount: number;
  area: number;
}

export function useVillageInfo() {
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVillageInfo = async () => {
    try {
      setError(null);
      const timestamp = Date.now();
      const response = await fetch(`/api/village-info?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVillageInfo(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch village information');
      }
    } catch (err) {
      setError('Error fetching village information');
      console.error('Error fetching village info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillageInfo();
    
    // Refresh data every 10 seconds for more real-time updates
    const interval = setInterval(fetchVillageInfo, 10000);
    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    setLoading(true);
    fetchVillageInfo();
  };

  return {
    villageInfo,
    loading,
    error,
    refresh
  };
}
