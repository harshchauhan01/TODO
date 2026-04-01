// IndexedDB utility for offline storage
const DB_NAME = "TodoAppDB";
const DB_VERSION = 1;
const STORE_NAME = "tasks";
const SYNC_STORE = "syncQueue";

let db = null;
let dbReady = false;
let dbInitPromise = null;

export const isDBReady = () => dbReady;

export const initDB = () => {
  if (dbReady && db) {
    return Promise.resolve(db);
  }

  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      dbInitPromise = null;
      reject(request.error);
    };

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

  return dbInitPromise;
};

const ensureDB = async () => {
  if (dbReady && db) {
    return db;
  }
  return initDB();
};

// Get all tasks for a user
export const getAllTasks = async (userId) => {
  const database = await ensureDB();
  return new Promise((resolve, reject) => {
    const store = database.transaction([STORE_NAME], "readonly").objectStore(STORE_NAME);
    
    // If no user ID, get all tasks
    const request = userId ? store.index("user").getAll(userId) : store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

// Add/update a task
export const saveTask = (task) => {
  return ensureDB().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(task);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  }));
};

// Delete a task
export const deleteTask = (taskId) => {
  return ensureDB().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(taskId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  }));
};

// Add to sync queue
export const addToSyncQueue = (action, taskData) => {
  return ensureDB().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_STORE], "readwrite");
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.add({
      action, // 'create', 'update', 'delete'
      taskData,
      timestamp: Date.now(),
      synced: false,
    });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  }));
};

// Get sync queue
export const getSyncQueue = () => {
  return ensureDB().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_STORE], "readonly");
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  }));
};

// Remove from sync queue
export const removeSyncQueueItem = (id) => {
  return ensureDB().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_STORE], "readwrite");
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  }));
};

// Clear sync queue
export const clearSyncQueue = () => {
  return ensureDB().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction([SYNC_STORE], "readwrite");
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  }));
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
