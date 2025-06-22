import { HardDrive, RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import getAuthToken from "../scripts/auth/getAuthToken";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Props {
  isExpanded: boolean;
  refreshInterval?: number; // Optional auto-refresh interval in ms
  onStorageUpdate?: (data: StorageData) => void; // Callback for storage updates
}

interface StorageData {
  used: number;
  limit: number;
  available: number;
  percentage: number;
}

interface ApiResponse {
  status: string;
  data: StorageData;
  message?: string;
}

const StorageSkeleton = ({ isExpanded }: { isExpanded: boolean }) => (
  <div className={`w-full mb-4 flex flex-col transition-all duration-500 ease-in-out ${!isExpanded && "items-center"}`} role="status" aria-label="Loading storage data">
    <div className={`flex items-center mb-2 transition-all duration-500 ease-in-out ${isExpanded ? "w-full justify-start" : "w-8 justify-center"}`}>
      <div className="flex-shrink-0">
        <HardDrive size={20} className="text-gray-500" aria-hidden="true" />
      </div>
      <div className={`ml-3 flex-1 transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0 ml-0"
      }`}>
        <div className="h-4 bg-gray-600 rounded animate-pulse w-24"></div>
      </div>
    </div>
    <div 
      className={`bg-gray-700 rounded-full h-2 overflow-hidden transition-all duration-500 ease-in-out ${
        isExpanded ? "w-full" : "w-8"
      }`}
    >
      <div className="bg-accent h-full rounded-full animate-pulse w-full"></div>
    </div>
    <div className={`flex justify-between text-xs text-gray-500 mt-1 w-full animate-pulse transition-all duration-500 ease-in-out overflow-hidden ${
      isExpanded ? "opacity-100 max-h-4" : "opacity-0 max-h-0 mt-0"
    }`}>
      <div className="h-3 bg-gray-600 rounded w-16"></div>
      <div className="h-3 bg-gray-600 rounded w-12"></div>
    </div>
  </div>
);

const StorageQuota = ({ 
  isExpanded, 
  refreshInterval,
  onStorageUpdate 
}: Props) => {
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const navigate = useNavigate();

  const fetchStorageData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const authToken = await getAuthToken(navigate);
      const response = await fetch(`${API_BASE}/api/storage`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch storage data: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.status === 'success' && data.data) {
        const newStorageData = {
          ...data.data,
          percentage: Math.min(data.data.percentage, 100)
        };
        setStorageData(newStorageData);
        setLastUpdated(new Date());
        onStorageUpdate?.(newStorageData);
      } else {
        throw new Error(data.message || 'API returned error status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch storage data';
      setError(errorMessage);
      console.error('Error fetching storage data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate, onStorageUpdate]);

  useEffect(() => {
    fetchStorageData();
  }, [fetchStorageData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchStorageData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchStorageData]);

  // Format bytes to human readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    if (bytes < 0) return 'Invalid';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    
    return `${size} ${sizes[i]}`;
  };

  const handleManualRefresh = () => {
    if (!refreshing && !loading) {
      fetchStorageData(true);
    }
  };

  const getStorageStatus = (percentage: number) => {
    if (percentage >= 95) return { color: 'bg-red-500', text: 'Critical', icon: AlertTriangle };
    if (percentage >= 9) return { color: 'bg-red-400', text: 'Very High', icon: AlertTriangle };
    if (percentage >= 75) return { color: 'bg-yellow-500', text: 'High', icon: null };
    if (percentage >= 5) return { color: 'bg-accent', text: 'Medium', icon: null };
    return { color: 'bg-accent', text: 'Good', icon: null };
  };

  if (loading) {
    return <StorageSkeleton isExpanded={isExpanded} />;
  }

  if (error || !storageData) {
    return (
      <div className={`w-full mb-4 flex flex-col transition-all duration-500 ease-in-out ${!isExpanded && "items-center"}`}>
        <div className={`flex items-center mb-2 transition-all duration-500 ease-in-out ${isExpanded ? "w-full justify-start" : "w-8 justify-center"}`}>
          <div className="flex-shrink-0">
            <HardDrive size={20} className="text-red-500" aria-hidden="true" />
          </div>
          <div className={`ml-3 flex-1 transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0 ml-0"
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-500 whitespace-nowrap">Storage Error</span>
              <button
                onClick={handleManualRefresh}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                disabled={refreshing}
                title="Retry loading storage data"
                aria-label="Retry loading storage data"
              >
                <RefreshCw 
                  size={14} 
                  className={`text-red-500 ${refreshing ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>
        <div 
          className={`bg-gray-700 rounded-full h-2 overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "w-full" : "w-8"
          }`}
        >
          <div className="bg-red-500 h-full rounded-full w-full"></div>
        </div>
        <div className={`text-xs text-red-400 mt-1 opacity-75 w-full transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded && error ? "opacity-75 max-h-12" : "opacity-0 max-h-0 mt-0"
        }`}>
          {error}
        </div>
      </div>
    );
  }

  const percentage = storageData.percentage;
  const status = getStorageStatus(storageData.percentage);
  const StatusIcon = status.icon;
  
  return (
    <div className={`w-full mb-4 flex flex-col transition-all duration-500 ease-in-out ${!isExpanded && "items-center"}`}>
      <div className={`flex items-center mb-2 transition-all duration-500 ease-in-out ${isExpanded ? "w-full justify-start" : "w-8 justify-center"}`}>
        <div className="flex-shrink-0">
          <HardDrive 
            size={20} 
            className={`transition-colors duration-500 ease-in-out ${status.icon ? "text-yellow-500" : "text-gray-300"}`} 
            aria-hidden="true" 
          />
        </div>
        
        <div className={`flex-1 flex items-center justify-between transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "opacity-100 max-w-full ml-3" : "opacity-0 max-w-0 ml-0"
        }`}>
          <div className="flex items-center gap-2">
            <span
              className="text-sm whitespace-nowrap"
              title={`${formatBytes(storageData.used)} / ${formatBytes(storageData.limit)} used (${formatBytes(storageData.available)} available)`}
            >
              Storage ({percentage}%)
            </span>
            {StatusIcon && (
              <StatusIcon size={14} className="text-yellow-500 transition-all duration-500 ease-in-out" aria-hidden="true" />
            )}
          </div>
          
          <button
            onClick={handleManualRefresh}
            className="p-1 hover:bg-gray-700 rounded transition-colors duration-200 ml-2 flex-shrink-0"
            disabled={refreshing}
            title={`Refresh storage data${lastUpdated ? ` (last updated: ${lastUpdated.toLocaleTimeString()})` : ''}`}
            aria-label="Refresh storage data"
          >
            <RefreshCw 
              size={14} 
              className={`text-gray-400 hover:text-gray-200 transition-all duration-200 ${refreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
      </div>
      
      <div 
        className={`bg-gray-700 rounded-full h-2 overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? "w-full" : "w-8"
        }`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Storage usage: ${percentage}% used`}
      >
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${status.color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      <div className={`flex justify-between text-xs text-gray-400 mt-1 w-full transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? "opacity-100 max-h-4" : "opacity-0 max-h-0 mt-0"
      }`}>
        <span>{formatBytes(storageData.used)} used</span>
        <span>{formatBytes(storageData.available)} free</span>
      </div>
    </div>
  );
};

export default StorageQuota;