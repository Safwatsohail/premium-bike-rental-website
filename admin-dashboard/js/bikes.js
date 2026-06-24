// Sample bike data
let bikes = [
    {
        id: 1,
        name: 'Mountain Pro X1',
        model: '2023',
        type: 'mountain',
        year: 2023,
        price: 49.99,
        status: 'available',
        features: ['21 Gears', 'Disc Brakes', 'Front Suspension'],
        description: 'Perfect for off-road adventures with its durable frame and smooth suspension system.',
        image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
        id: 2,
        name: 'Roadster 5000',
        model: '2023',
        type: 'road',
        year: 2023,
        price: 39.99,
        status: 'rented',
        features: ['18 Gears', 'Lightweight Frame', 'Aero Design'],
        description: 'Designed for speed and efficiency on paved roads with its aerodynamic frame.',
        image: 'https://images.unsplash.com/photo-1507030585642-3a6c3f8e3f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
        id: 3,
        name: 'Urban Commuter',
        model: 'E-500',
        type: 'electric',
        year: 2023,
        price: 69.99,
        status: 'available',
        features: ['Electric Assist', '50km Range', 'LED Display'],
        description: 'Eco-friendly commuting with powerful electric assist for easy riding.',
        image: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    }
];

// DOM Elements
const bikesContainer = document.getElementById('bikesContainer');
const addBikeBtn = document.getElementById('addNewBike');
const bikeForm = document.getElementById('bikeForm');
const bikeModal = document.getElementById('bikeModal');
const confirmModal = document.getElementById('confirmModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const cancelBtn = document.getElementById('cancelBike');
const searchInput = document.getElementById('searchBikes');

// Form Elements
const bikeIdInput = document.getElementById('bikeId');
const bikeNameInput = document.getElementById('bikeName');
const bikeModelInput = document.getElementById('bikeModel');
const bikeTypeSelect = document.getElementById('bikeType');
const bikeYearInput = document.getElementById('bikeYear');
const bikePriceInput = document.getElementById('bikePrice');
const bikeStatusSelect = document.getElementById('bikeStatus');
const bikeFeaturesInput = document.getElementById('bikeFeatures');
const bikeDescriptionInput = document.getElementById('bikeDescription');
const bikeImageInput = document.getElementById('bikeImage');
const imagePreview = document.getElementById('imagePreview');

// State
let isEditMode = false;
let currentBikeId = null;
let deleteBikeId = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderBikes();
    
    // Add Bike Button
    addBikeBtn.addEventListener('click', openAddBikeModal);
    
    // Form Submission
    bikeForm.addEventListener('submit', handleFormSubmit);
    
    // Close Modal Buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Cancel Button
    cancelBtn.addEventListener('click', closeAllModals);
    
    // Search Functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Image Upload Preview
    bikeImageInput.addEventListener('change', handleImageUpload);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bikeModal) {
            closeAllModals();
        }
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });
});

// Render Bikes
function renderBikes(bikesToRender = bikes) {
    bikesContainer.innerHTML = '';
    
    if (bikesToRender.length === 0) {
        bikesContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-bicycle"></i>
                <p>No bikes found</p>
            </div>
        `;
        return;
    }
    
    bikesToRender.forEach(bike => {
        const bikeCard = document.createElement('div');
        bikeCard.className = 'bike-card glass';
        bikeCard.innerHTML = `
            <img src="${bike.image}" alt="${bike.name}" class="bike-image">
            <span class="bike-status status-${bike.status}">${bike.status}</span>
            <div class="bike-details">
                <div class="bike-header">
                    <div class="bike-title">
                        <h3>${bike.name}</h3>
                        <p class="bike-model">${bike.model} • ${bike.type.charAt(0).toUpperCase() + bike.type.slice(1)}</p>
                    </div>
                    <div class="bike-price">AED ${bike.price}<span>/day</span></div>
                </div>
                <div class="bike-meta">
                    <span>${bike.year}</span>
                    ${bike.features.map(feature => `<span>${feature}</span>`).join('')}
                </div>
                <p class="bike-description">${bike.description}</p>
                <div class="bike-actions">
                    <button class="btn btn-edit" data-id="${bike.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete" data-id="${bike.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        bikesContainer.appendChild(bikeCard);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => openEditBikeModal(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => openDeleteConfirm(parseInt(btn.dataset.id)));
    });
}

// Open Add Bike Modal
function openAddBikeModal() {
    isEditMode = false;
    currentBikeId = null;
    bikeForm.reset();
    imagePreview.src = 'https://via.placeholder.com/300x200?text=Upload+Image';
    document.getElementById('modalTitle').textContent = 'Add New Bike';
    bikeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open Edit Bike Modal
function openEditBikeModal(id) {
    const bike = bikes.find(b => b.id === id);
    if (!bike) return;
    
    isEditMode = true;
    currentBikeId = id;
    
    // Fill form with bike data
    bikeIdInput.value = bike.id;
    bikeNameInput.value = bike.name;
    bikeModelInput.value = bike.model;
    bikeTypeSelect.value = bike.type;
    bikeYearInput.value = bike.year;
    bikePriceInput.value = bike.price;
    bikeStatusSelect.value = bike.status;
    bikeFeaturesInput.value = bike.features.join(', ');
    bikeDescriptionInput.value = bike.description;
    imagePreview.src = bike.image;
    
    document.getElementById('modalTitle').textContent = 'Edit Bike';
    bikeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Handle Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const bikeData = {
        name: bikeNameInput.value.trim(),
        model: bikeModelInput.value.trim(),
        type: bikeTypeSelect.value,
        year: parseInt(bikeYearInput.value),
        price: parseFloat(bikePriceInput.value),
        status: bikeStatusSelect.value,
        features: bikeFeaturesInput.value.split(',').map(f => f.trim()).filter(f => f !== ''),
        description: bikeDescriptionInput.value.trim(),
        image: imagePreview.src
    };
    
    if (isEditMode) {
        // Update existing bike
        const index = bikes.findIndex(b => b.id === currentBikeId);
        if (index !== -1) {
            bikes[index] = { ...bikes[index], ...bikeData };
        }
    } else {
        // Add new bike
        const newId = bikes.length > 0 ? Math.max(...bikes.map(b => b.id)) + 1 : 1;
        bikes.unshift({
            id: newId,
            ...bikeData
        });
    }
    
    // Save to localStorage (in a real app, this would be an API call)
    saveBikes();
    renderBikes();
    closeAllModals();
}

// Handle Image Upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        imagePreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Open Delete Confirmation
function openDeleteConfirm(id) {
    deleteBikeId = id;
    confirmModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to confirm and cancel buttons
    document.getElementById('confirmDelete').onclick = confirmDelete;
    document.getElementById('cancelDelete').onclick = closeConfirmModal;
}

// Confirm Delete
function confirmDelete() {
    bikes = bikes.filter(bike => bike.id !== deleteBikeId);
    saveBikes();
    renderBikes();
    closeConfirmModal();
}

// Close Confirm Modal
function closeConfirmModal() {
    confirmModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    deleteBikeId = null;
}

// Close All Modals
function closeAllModals() {
    bikeModal.classList.remove('active');
    closeConfirmModal();
    document.body.style.overflow = 'auto';
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
        renderBikes(bikes);
        return;
    }
    
    const filteredBikes = bikes.filter(bike => 
        bike.name.toLowerCase().includes(searchTerm) ||
        bike.model.toLowerCase().includes(searchTerm) ||
        bike.type.toLowerCase().includes(searchTerm) ||
        bike.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
    
    renderBikes(filteredBikes);
}

// Save Bikes to LocalStorage
function saveBikes() {
    localStorage.setItem('bikes', JSON.stringify(bikes));
}

// Load Bikes from LocalStorage
function loadBikes() {
    const savedBikes = localStorage.getItem('bikes');
    if (savedBikes) {
        bikes = JSON.parse(savedBikes);
    }
}

// Initialize
loadBikes();
renderBikes();
