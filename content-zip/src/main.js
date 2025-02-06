// This file sets up a simple CRUD app using IndexedDB and utilizes UI elements defined in index.html

import { setupEventListeners } from './controllers/itemController.js';
import { loadItems } from './controllers/itemController.js'; // Import loadItems function

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners(); // Set up event listeners
  loadItems(); // Load items on page load
});