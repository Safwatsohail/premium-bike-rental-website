// Firebase Bikes Management for BikeRent Pro
let bikes = [];
let unsubscribe = null;
let isEditMode = false;
let currentBikeId = null;
let deleteBikeId = null;
let isDeleteInProgress = false; // Flag to prevent re-renders during delete

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
const bikeTypeSelect = document.getElementById('bikeType');
const bikePriceInput = document.getElementById('bikePrice');
const bikeStatusSelect = document.getElementById('bikeStatus');
const bikeFeaturesInput = document.getElementById('bikeFeatures');
const bikeDescriptionInput = document.getElementById('bikeDescription');
const bikeImageInput = document.getElementById('bikeImage');
const imagePreview = document.getElementById('imagePreview');
const bikeImagesInput = document.getElementById('bikeImages');
const bikeVideoInput = document.getElementById('bikeVideo');

// Storage for additional images and video
let additionalImagesFiles = [];
let videoFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to load
    if (window.db) {
        initBikes();
    } else {
        // Retry a few times if firebase isn't ready immediately (rare with correct script order)
        let retryCount = 0;
        const checkFirebase = setInterval(() => {
            retryCount++;
            if (window.db) {
                clearInterval(checkFirebase);
                initBikes();
            } else if (retryCount > 10) {
                console.error("Firebase not loaded after retries");
                clearInterval(checkFirebase);
                showNotification("Error: Database connection failed", "error");
            }
        }, 500);
    }

    setupEventListeners();
});

function initBikes() {
    // Load from cache first for instant display, then fetch fresh data
    loadBikesWithCache();
}

// Load bikes with caching for faster display
async function loadBikesWithCache() {
    try {
        // Try to load from sessionStorage cache first for instant display
        const cachedBikes = sessionStorage.getItem('admin_bikes_cache');
        if (cachedBikes) {
            try {
                bikes = JSON.parse(cachedBikes);
                console.log('⚡ Admin: Loaded bikes from cache instantly');
                renderBikes(bikes);
            } catch(e) {}
        }
        
        // Then fetch fresh data from Firebase
        await loadBikes();
    } catch (error) {
        console.error("Error in loadBikesWithCache:", error);
    }
}

// Manual fetch function - call this when you need to refresh the list
async function loadBikes() {
    try {
        const snapshot = await window.db.collection('bikes')
            .orderBy('createdAt', 'desc')
            .get();
        
        bikes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Cache for faster subsequent loads
        sessionStorage.setItem('admin_bikes_cache', JSON.stringify(bikes));
        
        renderBikes(bikes);
    } catch (error) {
        console.error("Error fetching bikes:", error);
        showNotification('Error loading bikes', 'error');
    }
}

function setupEventListeners() {
    // Add Bike Button
    if (addBikeBtn) {
        addBikeBtn.addEventListener('click', openAddBikeModal);
    }

    // Form Submit
    if (bikeForm) {
        bikeForm.addEventListener('submit', handleFormSubmit);
    }

    // Image Upload Preview
    if (bikeImageInput) {
        bikeImageInput.addEventListener('change', handleImageUpload);
    }

    // Additional Images Upload
    if (bikeImagesInput) {
        bikeImagesInput.addEventListener('change', handleAdditionalImagesUpload);
    }

    // Video Upload
    if (bikeVideoInput) {
        bikeVideoInput.addEventListener('change', handleVideoUpload);
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Close Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeAllModals);
    }

    // Upload button click trigger (optional if label works, but good for safety)
}

// Render Bikes
function renderBikes(bikesToRender) {
    if (!bikesContainer) return;

    bikesContainer.innerHTML = '';

    if (bikesToRender.length === 0) {
        bikesContainer.innerHTML = '<div class="no-results">No bikes found. Add one to get started!</div>';
        return;
    }

    bikesToRender.forEach(bike => {
        const card = createBikeCard(bike);
        bikesContainer.appendChild(card);
    });

    // Re-apply translations if needed
    if (window.translationManager) {
        window.translationManager.translatePage();
    }
}

// Create Bike Card HTML
function createBikeCard(bike) {
    const div = document.createElement('div');
    div.className = 'bike-card glass';

    const statusClass = bike.status === 'available' ? 'status-available' :
        (bike.status === 'rented' ? 'status-rented' : 'status-maintenance');

    // If bike.image is base64, it might be large, but browsers handle it.
    const imageSrc = bike.image || 'https://via.placeholder.com/300x200?text=No+Image';
    
    // Count additional media
    const additionalImagesCount = (bike.additionalImages || []).length;
    const hasVideo = bike.videoUrl ? true : false;
    
    // Build specs HTML
    const specsHtml = `
        <div class="bike-specs-row">
            ${bike.hp ? `<span><i class="fas fa-horse-head"></i> ${bike.hp} HP</span>` : ''}
            ${bike.topSpeed ? `<span><i class="fas fa-tachometer-alt"></i> ${bike.topSpeed} km/h</span>` : ''}
            ${bike.engine ? `<span><i class="fas fa-cog"></i> ${bike.engine}cc</span>` : ''}
        </div>
    `;
    
    // Build media indicators
    let mediaIndicators = '';
    if (additionalImagesCount > 0 || hasVideo) {
        mediaIndicators = `
            <div class="media-indicators">
                ${additionalImagesCount > 0 ? `<span class="media-badge"><i class="fas fa-images"></i> ${additionalImagesCount}</span>` : ''}
                ${hasVideo ? `<span class="media-badge"><i class="fas fa-video"></i></span>` : ''}
            </div>
        `;
    }

    div.innerHTML = `
        <div class="bike-image">
            <img src="${imageSrc}" alt="${bike.name}" loading="lazy" style="object-fit: contain; background: #111;">
            <div class="bike-status ${statusClass}">${capitalize(bike.status)}</div>
            ${mediaIndicators}
        </div>
        <div class="bike-details">
            <h3>${bike.name}</h3>
            <p class="bike-model">${capitalize(bike.type)}</p>
            ${specsHtml}
            <div class="bike-info">
                <span class="price">AED ${bike.price}/day</span>
            </div>
            <div class="bike-features-list">
                ${(bike.features || []).slice(0, 3).map(f => `<span>${f}</span>`).join('')}
                ${(bike.features || []).length > 3 ? `<span>+${bike.features.length - 3} more</span>` : ''}
            </div>
            <div class="bike-actions" id="actions-${bike.id}">
                <button class="btn-icon" onclick="window.openEditBikeModal('${bike.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="window.showDeleteOptions('${bike.id}')" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="delete-confirm-inline" id="delete-confirm-${bike.id}" style="display: none;">
                <p style="margin: 0 0 10px 0; color: #ff4444; font-size: 0.9rem;">Delete this bike?</p>
                <button class="btn btn-danger btn-sm" onclick="window.executeDelete('${bike.id}')" style="margin-right: 8px;">
                    <i class="fas fa-check"></i> Yes, Delete
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.cancelDelete('${bike.id}')">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    return div;
}

// Open Add Bike Modal
function openAddBikeModal() {
    isEditMode = false;
    currentBikeId = null;
    bikeForm.reset();
    imagePreview.src = 'https://via.placeholder.com/300x200?text=Upload+Image';
    
    // Clear file inputs
    additionalImagesFiles = [];
    videoFile = null;
    if (document.getElementById('imagePreviewContainer')) {
        document.getElementById('imagePreviewContainer').innerHTML = '';
    }
    if (document.getElementById('videoPreviewContainer')) {
        document.getElementById('videoPreviewContainer').innerHTML = '';
    }
    // Clear video URL input
    const videoUrlInput = document.getElementById('bikeVideoUrl');
    if (videoUrlInput) {
        videoUrlInput.value = '';
    }
    
    document.getElementById('modalTitle').textContent = 'Add New Bike';
    bikeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open Edit Bike Modal
window.openEditBikeModal = async function (id) {
    const bike = bikes.find(b => b.id === id);
    if (!bike) return;

    isEditMode = true;
    currentBikeId = id;

    // Fill form
    bikeNameInput.value = bike.name;
    bikeTypeSelect.value = bike.type;
    bikePriceInput.value = bike.price;
    bikeStatusSelect.value = bike.status;
    document.getElementById('bikeHP').value = bike.hp || '';
    document.getElementById('bikeTopSpeed').value = bike.topSpeed || '';
    document.getElementById('bikeEngine').value = bike.engine || '';
    bikeFeaturesInput.value = (bike.features || []).join(', ');
    bikeDescriptionInput.value = bike.description || '';

    // Fill pricing tiers (per-day rates)
    if (bike.pricing) {
        document.getElementById('price1Day').value = bike.pricing.oneDay || bike.price;
        document.getElementById('price3Days').value = bike.pricing.threeDays || '';
        document.getElementById('price1Week').value = bike.pricing.oneWeek || '';
        document.getElementById('price1Month').value = bike.pricing.oneMonth || '';
    } else {
        // Legacy bikes without pricing tiers - use base price for 1-day
        document.getElementById('price1Day').value = bike.price;
        document.getElementById('price3Days').value = '';
        document.getElementById('price1Week').value = '';
        document.getElementById('price1Month').value = '';
    }

    // Main Image
    imagePreview.src = bike.image || 'https://via.placeholder.com/300x200?text=No+Image';
    
    // Video URL
    const videoUrlInput = document.getElementById('bikeVideoUrl');
    if (videoUrlInput) {
        // Only populate if it's a URL (not base64)
        if (bike.videoUrl && !bike.videoUrl.startsWith('data:')) {
            videoUrlInput.value = bike.videoUrl;
        } else {
            videoUrlInput.value = '';
        }
    }
    
    // Clear file inputs
    additionalImagesFiles = [];
    videoFile = null;
    document.getElementById('imagePreviewContainer').innerHTML = '';
    document.getElementById('videoPreviewContainer').innerHTML = '';

    document.getElementById('modalTitle').textContent = 'Edit Bike';
    bikeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submitted. Mode:", isEditMode ? "Edit" : "Add");

    const submitBtn = bikeForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    // Safety check for DB
    if (!window.db) {
        showNotification('Database not initialized. Refresh page.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    // Auth Check
    if (!window.auth || !window.auth.currentUser) {
        console.warn("No user logged in. Write might fail depending on security rules.");
        // Proceeding anyway as some dev modes allow public writes, but warning is good.
    }

    try {
        // Validation Checks
        if (imagePreview.src.startsWith('data:')) {
            // Check size (rough estimate: length * 0.75 / 1024 / 1024 = size in MB)
            const sizeInMB = (imagePreview.src.length * 0.75) / 1024 / 1024;
            if (sizeInMB > 1.0) {
                throw new Error(`Image is too large (${sizeInMB.toFixed(2)}MB). Limit is 1MB. Please pick a smaller image or use a URL.`);
            }
        }

        // Process additional images
        const additionalImagesBase64 = [];
        for (const file of additionalImagesFiles) {
            const base64 = await fileToBase64(file);
            additionalImagesBase64.push(base64);
        }

        // Process video - prefer URL input over file upload
        let videoUrl = '';
        const videoUrlInput = document.getElementById('bikeVideoUrl');
        if (videoUrlInput && videoUrlInput.value.trim()) {
            // Use the URL input if provided
            videoUrl = videoUrlInput.value.trim();
        } else if (videoFile) {
            // Fall back to uploaded file as base64
            videoUrl = await fileToBase64(videoFile);
        }

        const bikeData = {
            name: bikeNameInput.value.trim(),
            type: bikeTypeSelect.value,
            price: parseFloat(bikePriceInput.value),
            status: bikeStatusSelect.value,
            hp: parseInt(document.getElementById('bikeHP').value) || 0,
            topSpeed: parseInt(document.getElementById('bikeTopSpeed').value) || 0,
            engine: parseInt(document.getElementById('bikeEngine').value) || 0,
            features: bikeFeaturesInput.value.split(',').map(f => f.trim()).filter(f => f !== ''),
            description: bikeDescriptionInput.value.trim(),
            image: imagePreview.src,
            additionalImages: additionalImagesBase64,
            videoUrl: videoUrl,
            // Pricing tiers (per-day rates)
            pricing: {
                oneDay: parseFloat(document.getElementById('price1Day').value) || parseFloat(bikePriceInput.value),
                threeDays: parseFloat(document.getElementById('price3Days').value) || (parseFloat(bikePriceInput.value) * 0.95),
                oneWeek: parseFloat(document.getElementById('price1Week').value) || (parseFloat(bikePriceInput.value) * 0.85),
                oneMonth: parseFloat(document.getElementById('price1Month').value) || (parseFloat(bikePriceInput.value) * 0.75)
            },
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        };

        // Create a timeout promise (30 seconds for large files)
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out. Try using smaller images or check your internet connection.")), 30000)
        );

        // Handle image upload if it's a blob (not implemented fully here, assuming URL or base64 already set in src)
        // Note: Real file upload requires Firebase Storage. Current shim uses data URL from FileReader for preview.
        // For production, you'd upload 'file' to storage and get URL.

        if (isEditMode) {
            console.log("Updating document:", currentBikeId);
            await Promise.race([
                window.db.collection('bikes').doc(currentBikeId).update(bikeData),
                timeout
            ]);
            showNotification('Bike updated successfully!', 'success');
        } else {
            console.log("Adding new document");
            bikeData.createdAt = window.firebase.firestore.FieldValue.serverTimestamp();
            await Promise.race([
                window.db.collection('bikes').add(bikeData),
                timeout
            ]);
            showNotification('Bike added successfully!', 'success');
        }

        closeAllModals();
        
        // Reload bikes list
        await loadBikes();

    } catch (error) {
        console.error('Error saving bike:', error);
        showNotification('Error saving bike: ' + error.message, 'error');
        alert('Failed to save: ' + error.message); // Explicit alert as backup
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle Image Upload Preview
async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
        alert('File is too large (>800KB). Please use a smaller image.');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        imagePreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Handle Additional Images Upload
async function handleAdditionalImagesUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    additionalImagesFiles = files;
    const container = document.getElementById('imagePreviewContainer');
    container.innerHTML = '';

    files.forEach((file, index) => {
        if (file.size > 500 * 1024) {
            showNotification(`Image ${index + 1} is too large (>500KB)`, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const div = document.createElement('div');
            div.style.cssText = 'position: relative; display: inline-block; margin: 5px;';
            div.innerHTML = `
                <img src="${event.target.result}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #333;">
                <button type="button" onclick="removeAdditionalImage(${index})" style="position: absolute; top: -5px; right: -5px; background: #ff0033; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px;">×</button>
            `;
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

// Handle Video Upload
async function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert('Video is too large (>5MB). Please use a smaller video.');
        e.target.value = '';
        return;
    }

    videoFile = file;
    const container = document.getElementById('videoPreviewContainer');
    container.innerHTML = `
        <div style="margin-top: 10px; padding: 10px; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #fff;"><i class="fas fa-video"></i> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)</span>
            <button type="button" onclick="removeVideo()" style="background: #ff0033; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Remove</button>
        </div>
    `;
}

// Remove additional image
window.removeAdditionalImage = function(index) {
    additionalImagesFiles.splice(index, 1);
    // Re-trigger the display
    const event = { target: { files: additionalImagesFiles } };
    handleAdditionalImagesUpload(event);
}

// Remove video
window.removeVideo = function() {
    videoFile = null;
    document.getElementById('videoPreviewContainer').innerHTML = '';
    document.getElementById('bikeVideo').value = '';
}

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Clear Test Data
window.clearTestData = async function () {
    if (!confirm('Are you sure you want to delete ALL test data (Users, Bikes)? This cannot be undone.')) {
        return;
    }

    try {
        const collections = ['bikes', 'users'];
        let totalDeleted = 0;

        for (const collectionName of collections) {
            const snapshot = await window.db.collection(collectionName).get();
            const batch = window.db.batch();

            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
                totalDeleted++;
            });

            await batch.commit();
        }

        showNotification(`Cleared ${totalDeleted} documents.`, 'success');
    } catch (error) {
        console.error('Error clearing data:', error);
        showNotification('Error: ' + error.message, 'error');
    }
};

// Show inline delete confirmation
window.showDeleteOptions = function(id) {
    console.log('Showing delete options for bike:', id);
    
    // Set flag to prevent re-renders
    isDeleteInProgress = true;
    
    // Hide the actions, show the confirm
    const actionsDiv = document.getElementById('actions-' + id);
    const confirmDiv = document.getElementById('delete-confirm-' + id);
    
    if (actionsDiv) actionsDiv.style.display = 'none';
    if (confirmDiv) confirmDiv.style.display = 'block';
};

// Cancel delete - show actions again
window.cancelDelete = function(id) {
    console.log('Cancelling delete for bike:', id);
    
    // Reset flag
    isDeleteInProgress = false;
    
    // Show the actions, hide the confirm
    const actionsDiv = document.getElementById('actions-' + id);
    const confirmDiv = document.getElementById('delete-confirm-' + id);
    
    if (actionsDiv) actionsDiv.style.display = 'flex';
    if (confirmDiv) confirmDiv.style.display = 'none';
};

// Execute the delete
window.executeDelete = function(id) {
    console.log('Executing delete for bike:', id);
    confirmDeleteDirect(id);
};

// Direct delete function
async function confirmDeleteDirect(id) {
    console.log('Deleting bike:', id);
    
    // Show loading notification
    showNotification('Deleting bike...', 'info');
    
    try {
        await window.db.collection('bikes').doc(id).delete();
        showNotification('Bike deleted successfully!', 'success');
        console.log('Bike deleted successfully:', id);
        
        // Reset flag and reload bikes from Firebase
        isDeleteInProgress = false;
        await loadBikes();
    } catch (error) {
        console.error('Error deleting bike:', error);
        showNotification('Error deleting bike: ' + error.message, 'error');
        alert('Failed to delete bike: ' + error.message);
        isDeleteInProgress = false;
    }
}

// Legacy confirmDelete function (kept for compatibility)
async function confirmDelete() {
    if (!deleteBikeId) {
        console.error('No bike ID to delete');
        return;
    }
    await confirmDeleteDirect(deleteBikeId);
    closeConfirmModal();
}

// Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();

    if (!searchTerm) {
        renderBikes(bikes);
        return;
    }

    const filtered = bikes.filter(bike =>
        (bike.name || '').toLowerCase().includes(searchTerm) ||
        (bike.model || '').toLowerCase().includes(searchTerm) ||
        (bike.type || '').toLowerCase().includes(searchTerm) ||
        (bike.features && bike.features.some(f => f.toLowerCase().includes(searchTerm)))
    );
    renderBikes(filtered);
}

function closeAllModals() {
    bikeModal.classList.remove('active');
    closeConfirmModal();
    document.body.style.overflow = 'auto';
}

function closeConfirmModal() {
    if (confirmModal) {
        confirmModal.classList.remove('active');
    }
    deleteBikeId = null;
    document.body.style.overflow = 'auto';
    
    // Reset delete button state
    const deleteBtn = document.getElementById('confirmDelete');
    if (deleteBtn) {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = 'Delete';
    }
    
    // Re-render bikes after modal closes (in case updates were blocked)
    setTimeout(() => {
        renderBikes(bikes);
    }, 100);
}

// Notification Helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Styles for notification if not in CSS
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white; padding: 15px 25px; border-radius: 8px;
        display: flex; align-items: center; gap: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Cleanup - not needed since we're using manual fetch instead of real-time listener
// window.addEventListener('beforeunload', () => {
//     if (unsubscribe) unsubscribe();
// });

// DEBUG: Verify functions are exposed
console.log('🔧 bikes-firebase.js loaded');
console.log('🔧 openEditBikeModal type:', typeof window.openEditBikeModal);
console.log('🔧 openDeleteConfirm type:', typeof window.openDeleteConfirm);

// Debug handler removed to prevent interference

// Calculate suggested pricing tiers based on base price (per-day rates)
window.calculateSuggestedPrices = function() {
    const basePrice = parseFloat(bikePriceInput.value);
    if (!basePrice || basePrice <= 0) {
        showNotification('Please enter a base price first', 'error');
        return;
    }

    // Auto-fill pricing tiers with suggested per-day discounts
    document.getElementById('price1Day').value = basePrice.toFixed(2);
    document.getElementById('price3Days').value = (basePrice * 0.95).toFixed(2); // 5% discount per day
    document.getElementById('price1Week').value = (basePrice * 0.85).toFixed(2); // 15% discount per day
    document.getElementById('price1Month').value = (basePrice * 0.75).toFixed(2); // 25% discount per day

    showNotification('Suggested per-day rates calculated with discounts!', 'success');
};

// Auto-sync base price with 1-day price
if (bikePriceInput) {
    bikePriceInput.addEventListener('input', function() {
        const price1DayInput = document.getElementById('price1Day');
        if (price1DayInput && this.value) {
            price1DayInput.value = parseFloat(this.value).toFixed(2);
        }
    });
}