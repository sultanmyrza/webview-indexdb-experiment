function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("crudDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("items")) {
        // Create the "items" store with keyPath "id" (auto-increment enabled)
        const store = db.createObjectStore("items", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("name", "name", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function fetchItems(page) {
  try {
    const response = await fetch(`http://localhost:3000/api/items?page=${page}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data; // Return the entire data object
  } catch (error) {
    console.error("Error fetching items:", error);
    return { items: [], totalPages: 1, currentPage: 1 }; // Default return
  }
}

export async function addItem(name) {
  const db = await openDatabase();
  const transaction = db.transaction("items", "readwrite");
  const store = transaction.objectStore("items");
  const newItem = { name };
  return new Promise((resolve, reject) => {
    const request = store.add(newItem);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Function to store all items in IndexedDB
export async function storeAllItems(items) {
  const db = await openDatabase();
  const transaction = db.transaction("items", "readwrite");
  const store = transaction.objectStore("items");
  const promises = items.map(item => {
    return new Promise((resolve, reject) => {
      const request = store.add(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
  return Promise.all(promises);
}

// Function to retrieve all items from IndexedDB
export async function getItems() {
  const db = await openDatabase();
  const transaction = db.transaction("items", "readonly");
  const store = transaction.objectStore("items");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Function to clear all items from IndexedDB
export async function clearIndexedDB() {
  const db = await openDatabase();
  const transaction = db.transaction("items", "readwrite");
  const store = transaction.objectStore("items");
  return new Promise((resolve, reject) => {
    const request = store.clear(); // Clear all items
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Function to delete an item from IndexedDB
export async function deleteItem(id) {
  const db = await openDatabase();
  const transaction = db.transaction("items", "readwrite");
  const store = transaction.objectStore("items");
  return new Promise((resolve, reject) => {
    const request = store.delete(Number(id)); // Ensure id is a number
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Other CRUD functions (getItems, deleteItem, etc.) can be added here 