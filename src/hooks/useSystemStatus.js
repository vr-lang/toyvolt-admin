import { useState, useEffect, useCallback } from 'react';
import { healthService } from '../services/adminService';

export const useSystemStatus = () => {
  const [healthData, setHealthData] = useState(null);
  const [isOnline, setIsOnline] = useState(null); // null = unknown/checking, true = online, false = disconnected
  const [isChecking, setIsChecking] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      const data = await healthService.getHealth();
      if (data && (data.success || data.status === 'healthy')) {
        setHealthData(data);
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
      setHealthData(null);
    } finally {
      setIsChecking(false);
      setLastCheckTime(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Heartbeat every 45 seconds
    const interval = setInterval(checkHealth, 45000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isOnline,
    healthData,
    isChecking,
    lastCheckTime,
    refreshHealth: checkHealth
  };
};

export default useSystemStatus;
