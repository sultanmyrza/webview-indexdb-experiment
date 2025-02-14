import { useState } from "react";

// Custom hook to handle IndexedDB operations
export const useIndexedDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  // Open IndexedDB database
  const openDatabase = () => {
    const request = indexedDB.open("myDatabase", 1);

    request.onsuccess = () => {
      setDb(request.result);
    };

    request.onerror = (e) => {
      console.error("Error opening database:", e);
    };

    // Set up the database schema (stores)
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBRequest).result;
      if (!db.objectStoreNames.contains("timestamps")) {
        db.createObjectStore("timestamps", { keyPath: "id" });
      }
    };
  };

  // Store data in IndexedDB
  const storeTimestampData = (data: { id: number; value: string; timestamp: string }) => {
    if (!db) {
      console.error("Database not initialized.");
      return;
    }

    const transaction = db.transaction("timestamps", "readwrite");
    const store = transaction.objectStore("timestamps");
    store.put(data);

    transaction.onerror = (e) => {
      console.error("Error storing data:", e);
    };
  };

  // Get data from IndexedDB
  const getTimestampData = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized.");
        return;
      }

      const transaction = db.transaction("timestamps", "readonly");
      const store = transaction.objectStore("timestamps");
      const request = store.get(1); // Change to the specific ID you want to retrieve

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          resolve("No data found.");
        }
      };

      request.onerror = (e) => {
        reject("Error retrieving data: " + e);
      };
    });
  };

  // Open the database when the hook is used
  if (!db) {
    openDatabase();
  }

  return {
    storeTimestampData,
    getTimestampData,
  };
};