import { useState, useEffect, useRef } from 'react';
import { isOnline, setupAutoSync, syncOfflineChanges } from '../utils/syncService';

export const useOfflineStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
};

export const useOfflineSync = (userId) => {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = setupAutoSync(userId, (result, success) => {
      if (success) {
        setSyncError(null);
        setPendingCount(0);
      } else {
        setSyncError(result.message || 'Sync failed');
      }
    });

    return unsubscribe;
  }, [userId]);

  const manualSync = async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const result = await syncOfflineChanges(userId);
      setPendingCount(0);
      setSyncing(false);
      return result;
    } catch (error) {
      setSyncError(error.message || 'Failed to sync');
      setSyncing(false);
      throw error;
    }
  };

  return {
    syncing,
    syncError,
    pendingCount,
    manualSync,
    online: isOnline(),
  };
};
