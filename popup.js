document.addEventListener('DOMContentLoaded', function () {
  const categorySelect = document.getElementById('category');
  const addBtn = document.getElementById('add-btn');
  const productivityList = document.getElementById('productivity-list');

  // Load saved items from storage on extension startup
  loadSavedItems();

  // Function to load saved items from Chrome storage
  function loadSavedItems() {
    chrome.storage.sync.get('productivityItems', function (result) {
      const savedItems = result.productivityItems || [];
      savedItems.forEach(item => renderProductivityItem(item));
    });
  }

  // Function to render a productivity item on the list
  function renderProductivityItem(item) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${item.category}:</strong> <a href="${item.url}" target="_blank">${item.title}</a>`;
    productivityList.appendChild(listItem);
  }

  addBtn.addEventListener('click', function () {
    const selectedCategory = categorySelect.value;

    // Use Chrome API to get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      const currentTabUrl = currentTab.url;
      const currentTabTitle = currentTab.title;

      // Truncate item name to 50 characters
      const truncatedTitle = currentTabTitle.substring(0, 50);

      if (currentTabUrl) {
        // Render preview before saving
        alert(`Preview: ${selectedCategory}: ${truncatedTitle}`);

        // Save the item to Chrome storage
        saveItemToStorage({
          category: selectedCategory,
          url: currentTabUrl,
          title: truncatedTitle
        });

        // Render the item on the productivity list
        renderProductivityItem({
          category: selectedCategory,
          url: currentTabUrl,
          title: truncatedTitle
        });
      }
    });
  });

  // Function to save item to Chrome storage
  function saveItemToStorage(item) {
    chrome.storage.sync.get('productivityItems', function (result) {
      const savedItems = result.productivityItems || [];
      savedItems.push(item);

      chrome.storage.sync.set({ 'productivityItems': savedItems });
    });
  }
});
