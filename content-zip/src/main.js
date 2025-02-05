// This file sets up a simple CRUD app using IndexedDB and utilizes UI elements defined in index.html

document.addEventListener("DOMContentLoaded", () => {
  // Attach event listener to the Fetch Items button
  const fetchItemsButton = document.getElementById("fetchItemsButton");
  fetchItemsButton.addEventListener("click", async () => {
    const items = await fetchItems();
    console.log("Fetched items:", items);
    displayResponse(items); // Display the fetched items in the pre tag
  });

  // Attach event listener to the Store Items button
  const storeItemsButton = document.getElementById("storeItemsButton");
  storeItemsButton.addEventListener("click", async () => {
    const items = await fetchItems();
    for (const item of items) {
      await addItem(item.name); // Assuming you want to store only the name
    }
    await renderItems();
  });

  // Debug Buttons

  // Log all items in the console
  const debugShowItemsBtn = document.getElementById("debugShowItemsBtn");
  if (debugShowItemsBtn) {
    debugShowItemsBtn.addEventListener("click", async () => {
      const items = await getItems();
      console.log("Items in IndexedDB:", items);
    });
  }

  // Delete all items in the DB
  const debugClearDBBtn = document.getElementById("debugClearDBBtn");
  if (debugClearDBBtn) {
    debugClearDBBtn.addEventListener("click", async () => {
      const items = await getItems();
      for (const item of items) {
        await deleteItem(item.id);
      }
      await renderItems();
    });
  }

  // Log database information
  const debugLogDBInfoBtn = document.getElementById("debugLogDBInfoBtn");
  if (debugLogDBInfoBtn) {
    debugLogDBInfoBtn.addEventListener("click", async () => {
      try {
        const db = await openDatabase();
        console.log("IndexedDB 'crudDB' info:");
        console.log("Object stores:", db.objectStoreNames);
      } catch (error) {
        console.error("Error logging DB info:", error);
      }
    });
  }

  // Render initial items for UI list
  renderItems();
});

// Function to display the fetched response in the pre tag
function displayResponse(data) {
  const responseOutput = document.getElementById("responseOutput");
  responseOutput.textContent = JSON.stringify(data, null, 2); // Format JSON with indentation
}

/*-------------------------------
  IndexedDB CRUD Functions
-------------------------------*/

// Opens (and if not existing, creates/upgrades) an IndexedDB named "crudDB" with an "items" object store.
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

// Adds a new item with { name } to the "items" store.
async function addItem(name) {
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

// Fetch items from the API
async function fetchItems() {
  try {
    const response = await fetch("http://localhost:3000/api/items");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.items; // Return the items array
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

// Retrieves all items from the "items" store.
async function getItems() {
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

// Updates an existing item (item object must have its "id" field).
async function updateItem(item) {
  const db = await openDatabase();
  const transaction = db.transaction("items", "readwrite");
  const store = transaction.objectStore("items");
  return new Promise((resolve, reject) => {
    const request = store.put(item);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Deletes an item by its "id".
async function deleteItem(id) {
  const db = await openDatabase();
  const transaction = db.transaction("items", "readwrite");
  const store = transaction.objectStore("items");
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => {
      resolve();
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

/*-------------------------------
  Render UI List of Items
-------------------------------*/

// Renders the list of items from IndexedDB into the UI.
// For each item, it presents "Update" and "Delete" buttons.
async function renderItems() {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = ""; // Clear current list

  try {
    const items = await getItems();
    if (items.length === 0) {
      itemList.innerHTML = "<li class='text-gray-500'>No items found.</li>";
    } else {
      items.forEach((item) => {
        const li = document.createElement("li");
        li.className = "mb-2 flex items-center";
        li.innerHTML = `<span class="flex-1">${item.name}</span>`;

        // Create Update button
        const updateBtn = document.createElement("button");
        updateBtn.className = "bg-yellow-500 text-white px-2 py-1 mr-2 rounded";
        updateBtn.textContent = "Update";
        updateBtn.addEventListener("click", async () => {
          const newName = prompt("Enter new name", item.name);
          if (newName && newName.trim() && newName.trim() !== item.name) {
            const updatedItem = { ...item, name: newName.trim() };
            await updateItem(updatedItem);
            await renderItems();
          }
        });

        // Create Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "bg-red-500 text-white px-2 py-1 rounded";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async () => {
          await deleteItem(item.id);
          await renderItems();
        });

        li.appendChild(updateBtn);
        li.appendChild(deleteBtn);
        itemList.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Error retrieving items:", error);
  }
}
