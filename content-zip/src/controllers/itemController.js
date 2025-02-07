import { clearIndexedDB, deleteItem, fetchItems, getItems, storeAllItems } from '../models/itemModel.js';
import { displayResponse, renderItems, updatePaginationButtons } from '../views/itemView.js';

let currentPage = 1;
let totalPages = 1;

export function setupEventListeners() {
  const fetchItemsButton = document.getElementById("fetchItemsButton");
  fetchItemsButton.addEventListener("click", loadItems);

  const storeItemsButton = document.getElementById("storeItemsButton");
  storeItemsButton.addEventListener("click", async () => {
    const items = await fetchItems(currentPage);
    await storeAllItems(items.items);
    const storedItems = await getItems();
    renderItems(storedItems);
  });

  const clearIndexedDBButton = document.getElementById("clearIndexedDBButton");
  clearIndexedDBButton.addEventListener("click", async () => {
    await clearIndexedDB();
    renderItems([]);
  });

  // Add event listener for reloading IndexedDB content
  const reloadIndexedDBButton = document.getElementById("reloadIndexedDBButton");
  reloadIndexedDBButton.addEventListener("click", async () => {
    const storedItems = await getItems(); // Get items from IndexedDB
    renderItems(storedItems); // Render items from IndexedDB
  });

  // Add event listener for item removal
  document.getElementById("itemList").addEventListener("click", async (event) => {
    if (event.target.classList.contains("removeItemButton")) {
      const itemId = event.target.getAttribute("data-id");
      await deleteItem(itemId); // Call the delete function
      const storedItems = await getItems(); // Refresh the list
      renderItems(storedItems); // Render updated items
    }
  });

  const prevPageButton = document.getElementById("prevPageButton");
  prevPageButton.addEventListener("click", async () => {
    if (currentPage > 1) {
      currentPage--;
      await loadItems();
    }
  });

  const nextPageButton = document.getElementById("nextPageButton");
  nextPageButton.addEventListener("click", async () => {
    if (currentPage < totalPages) {
      currentPage++;
      await loadItems();
    }
  });
}

// Function to load items and update the view
export async function loadItems() {
  const items = await fetchItems(currentPage);
  console.log("Fetched items:", items);
  displayResponse(items);
  totalPages = items.totalPages || 1;
  updatePaginationButtons(currentPage, totalPages);

  const storedItems = await getItems();
  renderItems(storedItems);
} 