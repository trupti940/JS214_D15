const apiUrl = 'http://localhost:3000/items'; // Update with your JSON server URL
const searchBox = document.getElementById('searchBox');
const filterCategory = document.getElementById('filterCategory');
const dataContainer = document.getElementById('dataContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let currentPage = 1;
const itemsPerPage = 10; // Number of items per page

let debounceTimeout;
let throttleTimeout;
const debounceDelay = 300; // Debounce delay in milliseconds
const throttleLimit = 200; // Throttle limit in milliseconds

// Throttle function
function throttle(func, limit) {
    return function(...args) {
        if (!throttleTimeout) {
            func(...args);
            throttleTimeout = setTimeout(() => {
                throttleTimeout = null;
            }, limit);
        }
    };
}

// Debounce function
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func(...args), delay);
    };
}

// Fetch data with pagination, search, and filter
async function fetchData(page = 1, search = '', category = '') {
    try {
        const response = await fetch(`${apiUrl}?_page=${page}&_limit=${itemsPerPage}&q=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
        const data = await response.json();
        if (data.length > 0) {
            displayData(data);
            currentPage++;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Display data in the container
function displayData(items) {
    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('data-item');
        div.textContent = `${item.name} (${item.category})`;
        dataContainer.appendChild(div);
    });
}

// Load more data when the button is clicked
loadMoreBtn.addEventListener('click', () => fetchData(currentPage, searchBox.value, filterCategory.value));

// Debounced search input
searchBox.addEventListener('input', debounce(function() {
    currentPage = 1;
    dataContainer.innerHTML = '';
    fetchData(currentPage, searchBox.value, filterCategory.value);
}, debounceDelay));

// Throttled filter change
filterCategory.addEventListener('change', throttle(function() {
    currentPage = 1;
    dataContainer.innerHTML = '';
    fetchData(currentPage, searchBox.value, filterCategory.value);
}, throttleLimit));

// Initial data fetch
fetchData(currentPage);
