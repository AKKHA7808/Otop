// OTOP Thailand JavaScript Application

let map;
let markers = [];
let otopData = [];
let filteredData = [];
let selectedMarker = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadProvinces();
    loadOtopData();
    setupEventListeners();
});

// Initialize Google Map
function initMap() {
    // Center map on Thailand
    const thailandCenter = { lat: 15.87, lng: 100.9925 };
    
    try {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: thailandCenter,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });
        
        // Add markers once data is loaded
        if (otopData.length > 0) {
            addMarkersToMap(otopData);
        }
    } catch (error) {
        console.error('Google Maps failed to load:', error);
        showMapError();
    }
}

// Show error message if Google Maps fails to load
function showMapError() {
    document.getElementById('map').innerHTML = `
        <div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100%; 
            background-color: #f8f9ff; 
            color: #666; 
            text-align: center;
            flex-direction: column;
        ">
            <h3>Map Currently Unavailable</h3>
            <p>Google Maps requires a valid API key to display.</p>
            <p>Please add your Google Maps API key in the HTML template.</p>
            <small>The application will still work for viewing product details.</small>
        </div>
    `;
}

// Load OTOP data from API
async function loadOtopData() {
    try {
        const response = await fetch('/api/otop');
        if (!response.ok) {
            throw new Error('Failed to fetch OTOP data');
        }
        
        otopData = await response.json();
        filteredData = [...otopData];
        
        updateProductList(filteredData);
        updateProductCount(filteredData.length);
        
        // Add markers to map if map is ready
        if (map) {
            addMarkersToMap(filteredData);
        }
        
    } catch (error) {
        console.error('Error loading OTOP data:', error);
        document.getElementById('productList').innerHTML = 
            '<div class="error">Failed to load OTOP data</div>';
    }
}

// Load categories for filter dropdown
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const categorySelect = document.getElementById('categoryFilter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load provinces for filter dropdown
async function loadProvinces() {
    try {
        const response = await fetch('/api/provinces');
        const provinces = await response.json();
        
        const provinceSelect = document.getElementById('provinceFilter');
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error loading provinces:', error);
    }
}

// Add markers to Google Map
function addMarkersToMap(data) {
    // Check if Google Maps is available
    if (!window.google || !map) {
        console.log('Google Maps not available - skipping marker placement');
        return;
    }
    
    // Clear existing markers
    clearMarkers();
    
    data.forEach(otop => {
        const marker = new google.maps.Marker({
            position: { lat: otop.latitude, lng: otop.longitude },
            map: map,
            title: otop.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.716 0 0 6.716 0 15C0 26.25 15 40 15 40S30 26.25 30 15C30 6.716 23.284 0 15 0Z" fill="#667eea"/>
                        <circle cx="15" cy="15" r="8" fill="white"/>
                        <text x="15" y="19" text-anchor="middle" fill="#667eea" font-size="10" font-weight="bold">฿</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(30, 40),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 40)
            }
        });
        
        // Add click listener to marker
        marker.addListener('click', () => {
            selectOtop(otop, marker);
        });
        
        markers.push(marker);
    });
    
    // Fit map to show all markers
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => {
            bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
    }
}

// Clear all markers from map
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

// Update product list in sidebar
function updateProductList(data) {
    const productList = document.getElementById('productList');
    
    if (data.length === 0) {
        productList.innerHTML = '<div class="loading">No products found</div>';
        return;
    }
    
    const html = data.map(otop => `
        <div class="product-item" data-id="${otop.id}" onclick="selectOtopById(${otop.id})">
            <div class="product-name">${otop.name}</div>
            <div class="product-category">${otop.category}</div>
            <div class="product-location">${otop.province}, ${otop.district}</div>
            <div class="product-price">฿${otop.price.toLocaleString()}</div>
        </div>
    `).join('');
    
    productList.innerHTML = html;
}

// Update product count display
function updateProductCount(count) {
    document.getElementById('productCount').textContent = 
        `${count} product${count !== 1 ? 's' : ''} found`;
}

// Select OTOP product and show details
function selectOtop(otop, marker) {
    // Highlight selected marker
    if (selectedMarker) {
        selectedMarker.setIcon(getDefaultMarkerIcon());
    }
    
    if (marker) {
        marker.setIcon(getSelectedMarkerIcon());
        selectedMarker = marker;
        
        // Center map on selected marker
        map.setCenter(marker.getPosition());
        map.setZoom(10);
    }
    
    // Highlight selected product in list
    document.querySelectorAll('.product-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    const productItem = document.querySelector(`[data-id="${otop.id}"]`);
    if (productItem) {
        productItem.classList.add('selected');
    }
    
    // Show product details
    showProductDetails(otop);
}

// Select OTOP by ID (called from product list)
function selectOtopById(id) {
    const otop = filteredData.find(item => item.id === id);
    const marker = markers.find(marker => marker.getTitle() === otop.name);
    
    if (otop) {
        selectOtop(otop, marker);
    }
}

// Show product details in sidebar
function showProductDetails(otop) {
    const detailsPanel = document.getElementById('detailsPanel');
    const productDetails = document.getElementById('productDetails');
    
    const html = `
        <div class="detail-section">
            <div class="detail-label">Product Name</div>
            <div class="detail-value">${otop.name}</div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Category</div>
            <div class="detail-value">${otop.category}</div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Description</div>
            <div class="detail-value">${otop.description}</div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Location</div>
            <div class="detail-value">
                ${otop.tambon}, ${otop.district}<br>
                ${otop.province}
            </div>
        </div>
        
        <div class="detail-section">
            <div class="detail-label">Price</div>
            <div class="detail-value">฿${otop.price.toLocaleString()}</div>
        </div>
        
        <div class="contact-info">
            <div class="detail-label">Contact Information</div>
            <div class="detail-value">
                Phone: ${otop.contact_phone}<br>
                Email: ${otop.contact_email}
            </div>
        </div>
    `;
    
    productDetails.innerHTML = html;
    detailsPanel.style.display = 'block';
}

// Get default marker icon
function getDefaultMarkerIcon() {
    return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0C6.716 0 0 6.716 0 15C0 26.25 15 40 15 40S30 26.25 30 15C30 6.716 23.284 0 15 0Z" fill="#667eea"/>
                <circle cx="15" cy="15" r="8" fill="white"/>
                <text x="15" y="19" text-anchor="middle" fill="#667eea" font-size="10" font-weight="bold">฿</text>
            </svg>
        `),
        scaledSize: new google.maps.Size(30, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 40)
    };
}

// Get selected marker icon
function getSelectedMarkerIcon() {
    return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0C6.716 0 0 6.716 0 15C0 26.25 15 40 15 40S30 26.25 30 15C30 6.716 23.284 0 15 0Z" fill="#e53e3e"/>
                <circle cx="15" cy="15" r="8" fill="white"/>
                <text x="15" y="19" text-anchor="middle" fill="#e53e3e" font-size="10" font-weight="bold">฿</text>
            </svg>
        `),
        scaledSize: new google.maps.Size(30, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 40)
    };
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Clear functionality
    document.getElementById('clearBtn').addEventListener('click', clearFilters);
    
    // Filter functionality
    document.getElementById('categoryFilter').addEventListener('change', performSearch);
    document.getElementById('provinceFilter').addEventListener('change', performSearch);
}

// Perform search and filtering
async function performSearch() {
    const searchQuery = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const province = document.getElementById('provinceFilter').value;
    
    try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (category) params.append('category', category);
        if (province) params.append('province', province);
        
        const response = await fetch(`/api/otop/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        filteredData = await response.json();
        
        updateProductList(filteredData);
        updateProductCount(filteredData.length);
        addMarkersToMap(filteredData);
        
        // Hide details panel
        document.getElementById('detailsPanel').style.display = 'none';
        selectedMarker = null;
        
    } catch (error) {
        console.error('Error performing search:', error);
        document.getElementById('productList').innerHTML = 
            '<div class="error">Search failed</div>';
    }
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('provinceFilter').value = '';
    
    filteredData = [...otopData];
    updateProductList(filteredData);
    updateProductCount(filteredData.length);
    addMarkersToMap(filteredData);
    
    // Hide details panel
    document.getElementById('detailsPanel').style.display = 'none';
    selectedMarker = null;
}