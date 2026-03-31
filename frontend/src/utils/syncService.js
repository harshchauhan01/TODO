// Offline sync service
import api from '../api/axios';
import { getSyncQueue, removeSyncQueueItem, getAllTasks, saveTask, deleteTask } from './db';

let isSyncing = false;

export const syncOfflineChanges = async (userId, onSyncProgress) => {
  if (isSyncing) return;
  
  isSyncing = true;
  try {
    const queue = await getSyncQueue();
    
    for (const item of queue) {
      try {
        if (item.action === 'create') {
          const response = await api.post('/api/todo/', item.taskData);
          // Update local copy with server ID
          await saveTask(response.data);
        } else if (item.action === 'update') {
          await api.patch(`/api/todo/${item.taskData.id}/`, item.taskData);
        } else if (item.action === 'delete') {
          await api.delete(`/api/todo/${item.taskData.id}/`);
          await deleteTask(item.taskData.id);
        }
        
        // Remove from queue after successful sync
        await removeSyncQueueItem(item.id);
        onSyncProgress && onSyncProgress(`Synced ${queue.indexOf(item) + 1} of ${queue.length}`);
      } catch (error) {
        console.error(`Failed to sync ${item.action} for task ${item.taskData.id}:`, error);
        // Don't remove from queue if sync fails
        throw error;
      }
    }

    // Refresh data from server after sync
    const response = await api.get('/api/todo/');
    response.data.forEach(task => saveTask(task));
    
    isSyncing = false;
    return { success: true, synced: queue.length };
  } catch (error) {
    isSyncing = false;
    console.error('Sync failed:', error);
    throw error;
  }
};

// Check if online and sync
export const setupAutoSync = (userId, onSyncComplete) => {
  const handleOnline = async () => {
    console.log('✓ Back online, syncing changes...');
    try {
      const result = await syncOfflineChanges(userId, (progress) => {
        console.log(progress);
      });
      onSyncComplete && onSyncComplete(result, true);
    } catch (error) {
      onSyncComplete && onSyncComplete(error, false);
    }
  };

  window.addEventListener('online', handleOnline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
  };
};

export const isOnline = () => navigator.onLine;
