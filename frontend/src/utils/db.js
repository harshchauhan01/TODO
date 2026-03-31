// IndexedDB utility for offline storage
const DB_NAME = "TodoAppDB";
const DB_VERSION = 1;
const STORE_NAME = "tasks";
const SYNC_STORE = "syncQueue";

let db = null;
let dbReady = false;

export const isDBReady = () => dbReady;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      dbReady = true;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // Create tasks store
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        objectStore.createIndex("user", "user", { unique: false });
        objectStore.createIndex("completed", "completed", { unique: false });
      }

      // Create sync queue store
      if (!database.objectStoreNames.contains(SYNC_STORE)) {
        database.createObjectStore(SYNC_STORE, { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

// Get all tasks for a user
export const getAllTasks = async (userId) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }
    
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    
    // If no user ID, get all tasks
    const request = userId ? store.index("user").getAll(userId) : store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

// Add/update a task
export const saveTask = (task) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(task);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Delete a task
export const deleteTask = (taskId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(taskId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Add to sync queue
export const addToSyncQueue = (action, taskData) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_STORE], "readwrite");
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.add({
      action, // 'create', 'update', 'delete'
      taskData,
      timestamp: Date.now(),
      synced: false,
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

// Get sync queue
export const getSyncQueue = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_STORE], "readonly");
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

// Remove from sync queue
export const removeSyncQueueItem = (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_STORE], "readwrite");
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Clear sync queue
export const clearSyncQueue = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_STORE], "readwrite");
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export default { 
  initDB, 
  getAllTasks, 
  saveTask, 
  deleteTask, 
  addToSyncQueue, 
  getSyncQueue, 
  removeSyncQueueItem, 
  clearSyncQueue,
  isDBReady
};
