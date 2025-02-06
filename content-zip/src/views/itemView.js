export function displayResponse(data) {
  const responseOutput = document.getElementById("responseOutput");
  responseOutput.textContent = JSON.stringify(data, null, 2); // Format JSON with indentation
}

export function updatePaginationButtons(currentPage, totalPages) {
  const prevPageButton = document.getElementById("prevPageButton");
  const nextPageButton = document.getElementById("nextPageButton");

  prevPageButton.style.display = currentPage > 1 ? "inline-block" : "none";
  nextPageButton.style.display = currentPage < totalPages ? "inline-block" : "none";
}

// Function to render items from IndexedDB
export function renderItems(items) {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = ""; // Clear current list

  if (items.length === 0) {
    itemList.innerHTML = "<li class='text-gray-500'>No items found.</li>";
  } else {
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "mb-2 flex items-center justify-between"; // Added justify-between for spacing
      li.innerHTML = `
        <span class="flex-1">${item.name}</span>
        <button class="removeItemButton bg-red-500 text-white p-1 rounded ml-2" data-id="${item.id}">
          Remove
        </button>
      `;
      itemList.appendChild(li);
    });
  }
}

// Other UI rendering functions can be added here 