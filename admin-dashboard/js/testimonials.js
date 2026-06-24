// Testimonials Management for BikeRent Pro
let testimonials = [];
let unsubscribe = null;
let isEditMode = false;
let currentTestimonialId = null;
let deleteTestimonialId = null;

// DOM Elements
const testimonialsContainer = document.getElementById('testimonialsContainer');
const addTestimonialBtn = document.getElementById('addNewTestimonial');
const testimonialForm = document.getElementById('testimonialForm');
const testimonialModal = document.getElementById('testimonialModal');
const confirmModal = document.getElementById('confirmModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const cancelBtn = document.getElementById('cancelTestimonial');
const searchInput = document.getElementById('searchTestimonials');

// Form Elements
const testimonialIdInput = document.getElementById('testimonialId');
const customerNameInput = document.getElementById('customerName');
const customerTitleInput = document.getElementById('customerTitle');
const ratingSelect = document.getElementById('rating');
const testimonialTextInput = document.getElementById('testimonialText');
const displayOrderInput = document.getElementById('displayOrder');
const isActiveSelect = document.getElementById('isActive');
const customerAvatarInput = document.getElementById('customerAvatar');
const avatarPreview = document.getElementById('avatarPreview');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (window.db) {
        initTestimonials();
    } else {
        let retryCount = 0;
        const checkFirebase = setInterval(() => {
            retryCount++;
            if (window.db) {
                clearInterval(checkFirebase);
                initTestimonials();
            } else if (retryCount > 10) {
                console.error("Firebase not loaded after retries");
                clearInterval(checkFirebase);
                showNotification("Error: Database connection failed", "error");
            }
        }, 500);
    }

    setupEventListeners();
});

function initTestimonials() {
    // Try to load from cache first for instant display
    const cachedTestimonials = sessionStorage.getItem('admin_testimonials_cache');
    if (cachedTestimonials) {
        try {
            testimonials = JSON.parse(cachedTestimonials);
            console.log('⚡ Testimonials: Loaded from cache instantly');
            renderTestimonials(testimonials);
        } catch(e) {}
    }
    
    // Real-time listener
    unsubscribe = window.db.collection('testimonials')
        .orderBy('displayOrder', 'asc')
        .onSnapshot((snapshot) => {
            testimonials = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Cache for faster subsequent loads
            sessionStorage.setItem('admin_testimonials_cache', JSON.stringify(testimonials));
            
            renderTestimonials(testimonials);
        }, (error) => {
            console.error("Error fetching testimonials:", error);
            showNotification('Error loading testimonials', 'error');
        });
}

function setupEventListeners() {
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', openAddTestimonialModal);
    }

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', handleFormSubmit);
    }

    if (customerAvatarInput) {
        customerAvatarInput.addEventListener('change', handleAvatarUpload);
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeAllModals);
    }
}

// Render Testimonials
function renderTestimonials(testimonialsToRender) {
    if (!testimonialsContainer) return;

    testimonialsContainer.innerHTML = '';

    if (testimonialsToRender.length === 0) {
        testimonialsContainer.innerHTML = '<div class="no-results">No testimonials found. Add one to get started!</div>';
        return;
    }

    testimonialsToRender.forEach(testimonial => {
        const card = createTestimonialCard(testimonial);
        testimonialsContainer.appendChild(card);
    });
}

// Create Testimonial Card HTML
function createTestimonialCard(testimonial) {
    const div = document.createElement('div');
    div.className = 'bike-card glass';

    const statusClass = testimonial.isActive ? 'status-available' : 'status-maintenance';
    const statusText = testimonial.isActive ? 'Active' : 'Inactive';
    const avatarSrc = testimonial.avatar || 'https://via.placeholder.com/150?text=No+Photo';

    // Generate stars
    const fullStars = Math.floor(testimonial.rating || 5);
    const emptyStars = 5 - fullStars;
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star" style="color: #ffd700;"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star" style="color: #ffd700;"></i>';
    }

    div.innerHTML = `
        <div class="bike-image" style="height: 200px; display: flex; align-items: center; justify-content: center; background: #1a1a1a;">
            <img src="${avatarSrc}" alt="${testimonial.customerName}" 
                 style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-color);">
        </div>
        <div class="bike-status ${statusClass}">${statusText}</div>
        <div class="bike-details">
            <h3>${testimonial.customerName}</h3>
            <p class="bike-model">${testimonial.customerTitle}</p>
            <div class="bike-info" style="margin: 10px 0;">
                ${starsHtml}
            </div>
            <p style="color: #ddd; font-size: 0.9rem; line-height: 1.5; margin: 10px 0;">
                "${testimonial.text.substring(0, 120)}${testimonial.text.length > 120 ? '...' : ''}"
            </p>
            <div class="bike-meta">
                <span>Order: ${testimonial.displayOrder || 1}</span>
            </div>
            <div class="bike-actions">
                <button class="btn-icon" onclick="openEditTestimonialModal('${testimonial.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="openDeleteConfirm('${testimonial.id}')" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
    return div;
}

// Open Add Testimonial Modal
function openAddTestimonialModal() {
    isEditMode = false;
    currentTestimonialId = null;
    testimonialForm.reset();
    avatarPreview.src = 'https://via.placeholder.com/150?text=Upload+Photo';
    document.getElementById('modalTitle').textContent = 'Add New Testimonial';
    testimonialModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open Edit Testimonial Modal
window.openEditTestimonialModal = async function (id) {
    const testimonial = testimonials.find(t => t.id === id);
    if (!testimonial) return;

    isEditMode = true;
    currentTestimonialId = id;

    customerNameInput.value = testimonial.customerName;
    customerTitleInput.value = testimonial.customerTitle;
    ratingSelect.value = testimonial.rating || 5;
    testimonialTextInput.value = testimonial.text;
    displayOrderInput.value = testimonial.displayOrder || 1;
    isActiveSelect.value = testimonial.isActive ? 'true' : 'false';
    avatarPreview.src = testimonial.avatar || 'https://via.placeholder.com/150?text=No+Photo';

    document.getElementById('modalTitle').textContent = 'Edit Testimonial';
    testimonialModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = testimonialForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    if (!window.db) {
        showNotification('Database not initialized. Refresh page.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }

    try {
        const testimonialData = {
            customerName: customerNameInput.value.trim(),
            customerTitle: customerTitleInput.value.trim(),
            rating: parseInt(ratingSelect.value),
            text: testimonialTextInput.value.trim(),
            displayOrder: parseInt(displayOrderInput.value) || 1,
            isActive: isActiveSelect.value === 'true',
            avatar: avatarPreview.src,
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        };

        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), 10000)
        );

        if (isEditMode) {
            await Promise.race([
                window.db.collection('testimonials').doc(currentTestimonialId).update(testimonialData),
                timeout
            ]);
            showNotification('Testimonial updated successfully!', 'success');
        } else {
            testimonialData.createdAt = window.firebase.firestore.FieldValue.serverTimestamp();
            await Promise.race([
                window.db.collection('testimonials').add(testimonialData),
                timeout
            ]);
            showNotification('Testimonial added successfully!', 'success');
        }

        closeAllModals();

    } catch (error) {
        console.error('Error saving testimonial:', error);
        showNotification('Error saving testimonial: ' + error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle Avatar Upload
async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
        alert('File is too large (>500KB). Please use a smaller image.');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        avatarPreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Delete Functions
window.openDeleteConfirm = function (id) {
    deleteTestimonialId = id;
    confirmModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.getElementById('confirmDelete').onclick = confirmDelete;
    document.getElementById('cancelDelete').onclick = closeConfirmModal;
};

async function confirmDelete() {
    if (!deleteTestimonialId) return;
    try {
        await window.db.collection('testimonials').doc(deleteTestimonialId).delete();
        showNotification('Testimonial deleted successfully!', 'success');
        closeConfirmModal();
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        showNotification('Error: ' + error.message, 'error');
    }
}

// Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();

    if (!searchTerm) {
        renderTestimonials(testimonials);
        return;
    }

    const filtered = testimonials.filter(testimonial =>
        (testimonial.customerName || '').toLowerCase().includes(searchTerm) ||
        (testimonial.customerTitle || '').toLowerCase().includes(searchTerm) ||
        (testimonial.text || '').toLowerCase().includes(searchTerm)
    );
    renderTestimonials(filtered);
}

function closeAllModals() {
    testimonialModal.classList.remove('active');
    closeConfirmModal();
    document.body.style.overflow = 'auto';
}

function closeConfirmModal() {
    confirmModal.classList.remove('active');
    deleteTestimonialId = null;
    document.body.style.overflow = 'auto';
}

// Notification Helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

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

// Cleanup
window.addEventListener('beforeunload', () => {
    if (unsubscribe) unsubscribe();
});
