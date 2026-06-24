// Bookings Page JavaScript
class BookingsManager {
    constructor() {
        this.bookings = this.generateMockBookings();
        this.filteredBookings = [...this.bookings];
        this.currentPage = 1;
        this.itemsPerPage = 7;
        this.translations = {
            en: {
                'bookings': 'Bookings',
                'filter': 'Filter',
                'export': 'Export',
                'status': 'Status',
                'date-range': 'Date Range',
                'apply': 'Apply',
                'total-bookings': 'Total Bookings',
                'active-bookings': 'Active Rentals',
                'today-revenue': "Today's Revenue",
                'avg-rating': 'Average Rating',
                'booking-details': 'Booking Details',
                'close': 'Close',
                'print': 'Print',
                'start-date': 'Start Date',
                'end-date': 'End Date',
                'duration': 'Duration',
                'helmet': 'Helmet',
                'damage': 'Damage',
                'customer': 'Customer',
                'contact': 'Contact',
                'price': 'Price',
                'payment': 'Payment',
                'view-details': 'View Details',
                'edit': 'Edit',
                'cancel': 'Cancel',
                'complete': 'Complete',
                'yes': 'Yes',
                'no': 'No'
            },
            ar: {
                'bookings': 'الحجوزات',
                'filter': 'تصفية',
                'export': 'تصدير',
                'status': 'الحالة',
                'date-range': 'نطاق التاريخ',
                'apply': 'تطبيق',
                'total-bookings': 'إجمالي الحجوزات',
                'active-bookings': 'التأجيرات النشطة',
                'today-revenue': 'إيرادات اليوم',
                'avg-rating': 'متوسط التقييم',
                'booking-details': 'تفاصيل الحجز',
                'close': 'إغلاق',
                'print': 'طباعة',
                'start-date': 'تاريخ البدء',
                'end-date': 'تاريخ الانتهاء',
                'duration': 'المدة',
                'helmet': 'خوذة',
                'damage': 'ضرر',
                'customer': 'العميل',
                'contact': 'التواصل',
                'price': 'السعر',
                'payment': 'الدفع',
                'view-details': 'عرض التفاصيل',
                'edit': 'تعديل',
                'cancel': 'إلغاء',
                'complete': 'إكمال',
                'yes': 'نعم',
                'no': 'لا'
            }
        };
        this.currentLang = localStorage.getItem('bikerent_language') || 'en';
        this.init();
    }

    init() {
        this.loadBookingsFromFirebase();
        this.setupEventListeners();
        this.applyLanguage();
    }

    // Load bookings from Firebase
    async loadBookingsFromFirebase() {
        try {
            const bookingsSnapshot = await db.collection('bookings').orderBy('createdAt', 'desc').get();
            this.bookings = [];

            bookingsSnapshot.forEach(doc => {
                const data = doc.data();

                // Convert Firestore timestamps to Date objects
                const startDate = data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate || Date.now());
                const endDate = data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate || Date.now());
                const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now());

                this.bookings.push({
                    id: data.id || doc.id,
                    customerName: data.customerName || 'Unknown Customer',
                    customerEmail: data.email || data.customerEmail || 'N/A',
                    customerPhone: data.phone || data.customerPhone || 'N/A',
                    bikeName: data.bikeName || 'Unknown Bike',
                    bikeImage: data.bikeImage || 'https://via.placeholder.com/100',
                    startDate: startDate,
                    endDate: endDate,
                    createdAt: createdAt,
                    status: data.status || 'confirmed',
                    price: parseFloat(data.amount || data.totalAmount || data.price || 0),
                    paymentMethod: data.paymentMethod || data.paymentStatus || 'Paid',
                    hasHelmet: data.hasHelmet || false,
                    hasDamage: data.hasDamage || false,
                    damageDescription: data.damageDescription || '',
                    rating: data.rating || null,
                    notes: data.notes || ''
                });
            });

            this.filteredBookings = [...this.bookings];
            this.renderBookings();
            this.updateStats();

        } catch (error) {
            console.error('Error loading bookings from Firebase:', error);
            this.showToast('Failed to load bookings. Please refresh the page.', 'error');
            this.bookings = [];
            this.filteredBookings = [];
            this.renderBookings();
            this.updateStats();
        }
    }

    // Generate mock booking data (deprecated - kept for fallback)
    generateMockBookings() {
        return [];
    }

    // Render booking cards
    renderBookings() {
        const bookingsGrid = document.getElementById('bookingsGrid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageBookings = this.filteredBookings.slice(startIndex, endIndex);

        bookingsGrid.innerHTML = pageBookings.map(booking => this.createBookingCard(booking)).join('');
        this.updatePagination();
    }

    // Create booking card HTML
    createBookingCard(booking) {
        const duration = this.calculateDuration(booking.startDate, booking.endDate);
        const statusClass = `status-${booking.status}`;
        const helmetClass = booking.hasHelmet ? 'helmet-yes' : 'helmet-no';
        const damageClass = booking.hasDamage ? 'damage-yes' : 'damage-no';

        return `
            <div class="booking-card glass">
                <div class="booking-header">
                    <div class="booking-info">
                        <div class="booking-id">${booking.id}</div>
                        <div class="customer-name">${booking.customerName}</div>
                    </div>
                    <div class="booking-status ${statusClass}">${booking.status}</div>
                </div>
                
                <div class="bike-info">
                    <img src="${booking.bikeImage}" alt="${booking.bikeName}" class="bike-image">
                    <div class="bike-details">
                        <h4>${booking.bikeName}</h4>
                        <p>ID: ${booking.id}</p>
                    </div>
                </div>
                
                <div class="booking-calendar">
                    <div class="calendar-header">
                        <h4><i class="fas fa-calendar"></i> <span data-translate="duration">Duration</span></h4>
                        <span>${duration}</span>
                    </div>
                    <div class="calendar-dates">
                        <div class="date-item">
                            <div class="date-label" data-translate="start-date">Start Date</div>
                            <div class="date-value">${this.formatDate(booking.startDate)}</div>
                            <div class="date-value">${this.formatTime(booking.startDate)}</div>
                        </div>
                        <div class="date-item">
                            <div class="date-label" data-translate="end-date">End Date</div>
                            <div class="date-value">${this.formatDate(booking.endDate)}</div>
                            <div class="date-value">${this.formatTime(booking.endDate)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="booking-details-grid">
                    <div class="detail-item">
                        <div class="detail-label">
                            <i class="fas fa-hard-hat"></i>
                            <span data-translate="helmet">Helmet</span>
                        </div>
                        <div class="detail-value ${helmetClass}">
                            <i class="fas fa-${booking.hasHelmet ? 'check' : 'times'}"></i>
                            ${booking.hasHelmet ? this.translations[this.currentLang]['yes'] : this.translations[this.currentLang]['no']}
                        </div>
                    </div>
                    <div class="detail-item ${damageClass}">
                        <div class="detail-label">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span data-translate="damage">Damage</span>
                        </div>
                        <div class="detail-value">
                            <i class="fas fa-${booking.hasDamage ? 'exclamation' : 'check'}"></i>
                            ${booking.hasDamage ? this.translations[this.currentLang]['yes'] : this.translations[this.currentLang]['no']}
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">
                            <i class="fas fa-money-bill-wave"></i>
                            <span data-translate="price">Price</span>
                        </div>
                        <div class="detail-value">AED ${booking.price}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">
                            <i class="fas fa-credit-card"></i>
                            <span data-translate="payment">Payment</span>
                        </div>
                        <div class="detail-value">${booking.paymentMethod}</div>
                    </div>
                </div>
                
                <div class="booking-actions">
                    <button class="btn btn-primary" onclick="viewBookingDetails('${booking.id}')">
                        <i class="fas fa-eye"></i> <span>View Details</span>
                    </button>
                    <button class="btn btn-secondary" onclick="editBooking('${booking.id}')">
                        <i class="fas fa-edit"></i> <span>Edit</span>
                    </button>
                    ${booking.status === 'active' ? `
                        <button class="btn btn-success" onclick="completeBooking('${booking.id}')">
                            <i class="fas fa-check"></i> <span>Complete</span>
                        </button>
                    ` : ''}
                    ${booking.status === 'active' || booking.status === 'confirmed' ? `
                        <button class="btn btn-danger" onclick="cancelBooking('${booking.id}')">
                            <i class="fas fa-times"></i> <span>Cancel</span>
                        </button>
                    ` : ''}
                    <button class="btn btn-danger" onclick="deleteBooking('${booking.id}')">
                        <i class="fas fa-trash"></i> <span>Delete</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Calculate duration between dates
    calculateDuration(startDate, endDate) {
        const diff = endDate - startDate;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;

        if (days > 0) {
            return `${days}d ${remainingHours}h`;
        }
        return `${hours}h`;
    }

    // Format date
    formatDate(date) {
        return date.toLocaleDateString(this.currentLang === 'ar' ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Format time
    formatTime(date) {
        return date.toLocaleTimeString(this.currentLang === 'ar' ? 'ar-SA' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Update statistics
    updateStats() {
        const totalBookings = this.bookings.length;
        const activeBookings = this.bookings.filter(b => b.status === 'active').length;
        const todayBookings = this.bookings.filter(b => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const status = (b.status || '').toLowerCase();
            const isPaid = status === 'confirmed' || status === 'paid' || status === 'completed' || status === 'active';
            const bookingDate = new Date(b.createdAt);

            return bookingDate >= today && bookingDate < tomorrow && isPaid;
        });
        const todayRevenue = todayBookings.reduce((sum, b) => sum + b.price, 0);
        const completedBookings = this.bookings.filter(b => b.status === 'completed' && b.rating);
        const avgRating = completedBookings.length > 0
            ? (completedBookings.reduce((sum, b) => sum + parseFloat(b.rating), 0) / completedBookings.length).toFixed(1)
            : '0.0';

        document.getElementById('totalBookings').textContent = totalBookings;
        document.getElementById('activeBookings').textContent = activeBookings;
        document.getElementById('todayRevenue').textContent = `AED ${todayRevenue}`;
        document.getElementById('avgRating').textContent = avgRating;
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBookings').addEventListener('input', (e) => {
            this.searchBookings(e.target.value);
        });

        // Close modal when clicking outside
        document.getElementById('bookingModal').addEventListener('click', (e) => {
            if (e.target.id === 'bookingModal') {
                this.closeBookingModal();
            }
        });
    }

    // Search bookings
    searchBookings(query) {
        const searchTerm = query.toLowerCase();
        this.filteredBookings = this.bookings.filter(booking =>
            booking.customerName.toLowerCase().includes(searchTerm) ||
            booking.bikeName.toLowerCase().includes(searchTerm) ||
            booking.id.toLowerCase().includes(searchTerm)
        );
        this.currentPage = 1;
        this.renderBookings();
    }

    // View booking details
    viewBookingDetails(bookingId) {
        console.log('View booking details clicked:', bookingId); // Debug log
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) {
            console.error('Booking not found:', bookingId);
            return;
        }

        const modalBody = document.getElementById('bookingModalBody');
        modalBody.innerHTML = this.createBookingDetailsHTML(booking);

        document.getElementById('bookingModal').classList.add('show');
        console.log('Modal opened'); // Debug log
    }

    // Create booking details HTML
    createBookingDetailsHTML(booking) {
        return `
            <div class="booking-detail-modal">
                <div class="detail-section">
                    <h3><i class="fas fa-user"></i> <span data-translate="customer">Customer</span></h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label data-translate="customer">Customer Name</label>
                            <value>${booking.customerName}</value>
                        </div>
                        <div class="detail-item">
                            <label data-translate="contact">Contact</label>
                            <value>${booking.customerPhone}</value>
                        </div>
                        <div class="detail-item">
                            <label>Email</label>
                            <value>${booking.customerEmail}</value>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-bicycle"></i> Bike</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label data-translate="bike">Bike Name</label>
                            <value>${booking.bikeName}</value>
                        </div>
                        <div class="detail-item">
                            <label data-translate="booking-id">Booking ID</label>
                            <value>${booking.id}</value>
                        </div>
                        <div class="detail-item">
                            <label>Bike Image</label>
                            <value><img src="${booking.bikeImage}" alt="${booking.bikeName}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;"></value>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-calendar"></i> <span data-translate="duration">Duration</span></h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label data-translate="start-date">Start Date</label>
                            <value>${this.formatDate(booking.startDate)} ${this.formatTime(booking.startDate)}</value>
                        </div>
                        <div class="detail-item">
                            <label data-translate="end-date">End Date</label>
                            <value>${this.formatDate(booking.endDate)} ${this.formatTime(booking.endDate)}</value>
                        </div>
                        <div class="detail-item">
                            <label data-translate="duration">Total Duration</label>
                            <value>${this.calculateDuration(booking.startDate, booking.endDate)}</value>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> <span data-translate="details">Details</span></h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label data-translate="helmet">Helmet</label>
                            <value>${booking.hasHelmet ? '✅ Yes' : '❌ No'}</value>
                        </div>
                        <div class="detail-item">
                            <label data-translate="damage">Damage</label>
                            <value>${booking.hasDamage ? '⚠️ Yes - ' + (booking.damageDescription || 'Minor damage') : '✅ No'}</value>
                        </div>
                        <div class="detail-item">
                            <label data-translate="price">Price</label>
                            <value>AED ${booking.price}</value>
                        </div>
                        <div class="detail-item">
                            <label data-translate="payment">Payment Method</label>
                            <value>${booking.paymentMethod}</value>
                        </div>
                        <div class="detail-item">
                            <label data-translate="status">Status</label>
                            <value><span class="booking-status status-${booking.status}">${booking.status.toUpperCase()}</span></value>
                        </div>
                    </div>
                </div>
                
                ${booking.notes ? `
                    <div class="detail-section">
                        <h3><i class="fas fa-sticky-note"></i> Notes</h3>
                        <div class="detail-item">
                            <value>${booking.notes}</value>
                        </div>
                    </div>
                ` : ''}
                
                ${booking.rating ? `
                    <div class="detail-section">
                        <h3><i class="fas fa-star"></i> Rating</h3>
                        <div class="detail-item">
                            <div class="rating-display">
                                ${this.createStarRating(parseFloat(booking.rating))}
                                <span>${booking.rating}/5.0</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Create star rating HTML
    createStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // Close booking modal
    closeBookingModal() {
        console.log('Close booking modal clicked'); // Debug log
        document.getElementById('bookingModal').classList.remove('show');
    }

    // Complete booking
    completeBooking(bookingId) {
        console.log('Complete booking clicked:', bookingId); // Debug log
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'completed';
            booking.rating = (Math.random() * 2 + 3).toFixed(1);
            this.renderBookings();
            this.updateStats();
            this.showToast('Booking completed successfully!', 'success');
            console.log('Booking completed:', bookingId);
        }
    }

    // Cancel booking
    cancelBooking(bookingId) {
        console.log('Cancel booking clicked:', bookingId); // Debug log
        if (confirm('Are you sure you want to cancel this booking?')) {
            const booking = this.bookings.find(b => b.id === bookingId);
            if (booking) {
                booking.status = 'cancelled';
                this.renderBookings();
                this.updateStats();
                this.showToast('Booking cancelled', 'error');
                console.log('Booking cancelled:', bookingId);
            }
        }
    }

    // Edit booking
    editBooking(bookingId) {
        console.log('Edit booking clicked:', bookingId); // Debug log
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) {
            console.error('Booking not found:', bookingId);
            this.showToast('Booking not found', 'error');
            return;
        }

        // Create edit modal content
        const modalBody = document.getElementById('bookingModalBody');
        modalBody.innerHTML = this.createEditBookingHTML(booking);

        // Update modal title
        document.querySelector('#bookingModal .modal-header h2').textContent = 'Edit Booking';
        
        // Update modal footer buttons
        const modalFooter = document.querySelector('#bookingModal .modal-footer');
        modalFooter.innerHTML = `
            <button class="btn btn-secondary" onclick="closeBookingModal()">
                <i class="fas fa-times"></i> <span>Cancel</span>
            </button>
            <button class="btn btn-primary" onclick="saveBookingChanges('${bookingId}')">
                <i class="fas fa-save"></i> <span>Save Changes</span>
            </button>
        `;

        document.getElementById('bookingModal').classList.add('show');
        console.log('Edit modal opened for booking:', bookingId);
    }

    // Create edit booking HTML
    createEditBookingHTML(booking) {
        return `
            <div class="booking-edit-modal">
                <div class="edit-section">
                    <h3><i class="fas fa-user"></i> Customer Information</h3>
                    <div class="edit-grid">
                        <div class="edit-item">
                            <label>Customer Name</label>
                            <input type="text" id="editCustomerName" value="${booking.customerName}" class="glass-input">
                        </div>
                        <div class="edit-item">
                            <label>Phone</label>
                            <input type="text" id="editCustomerPhone" value="${booking.customerPhone}" class="glass-input">
                        </div>
                        <div class="edit-item">
                            <label>Email</label>
                            <input type="email" id="editCustomerEmail" value="${booking.customerEmail}" class="glass-input">
                        </div>
                    </div>
                </div>
                
                <div class="edit-section">
                    <h3><i class="fas fa-calendar"></i> Booking Details</h3>
                    <div class="edit-grid">
                        <div class="edit-item">
                            <label>Start Date</label>
                            <input type="datetime-local" id="editStartDate" value="${this.formatDateTimeForInput(booking.startDate)}" class="glass-input">
                        </div>
                        <div class="edit-item">
                            <label>End Date</label>
                            <input type="datetime-local" id="editEndDate" value="${this.formatDateTimeForInput(booking.endDate)}" class="glass-input">
                        </div>
                        <div class="edit-item">
                            <label>Status</label>
                            <select id="editStatus" class="glass-select">
                                <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="active" ${booking.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="edit-section">
                    <h3><i class="fas fa-money-bill-wave"></i> Payment & Pricing</h3>
                    <div class="edit-grid">
                        <div class="edit-item">
                            <label>Price (AED)</label>
                            <input type="number" id="editPrice" value="${booking.price}" class="glass-input" step="0.01">
                        </div>
                        <div class="edit-item">
                            <label>Payment Method</label>
                            <select id="editPaymentMethod" class="glass-select">
                                <option value="Paid" ${booking.paymentMethod === 'Paid' ? 'selected' : ''}>Paid</option>
                                <option value="Cash" ${booking.paymentMethod === 'Cash' ? 'selected' : ''}>Cash</option>
                                <option value="Card" ${booking.paymentMethod === 'Card' ? 'selected' : ''}>Card</option>
                                <option value="Bank Transfer" ${booking.paymentMethod === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
                                <option value="Pending" ${booking.paymentMethod === 'Pending' ? 'selected' : ''}>Pending</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="edit-section">
                    <h3><i class="fas fa-info-circle"></i> Additional Details</h3>
                    <div class="edit-grid">
                        <div class="edit-item">
                            <label>
                                <input type="checkbox" id="editHasHelmet" ${booking.hasHelmet ? 'checked' : ''}>
                                Helmet Required
                            </label>
                        </div>
                        <div class="edit-item">
                            <label>
                                <input type="checkbox" id="editHasDamage" ${booking.hasDamage ? 'checked' : ''}>
                                Has Damage
                            </label>
                        </div>
                        <div class="edit-item full-width">
                            <label>Damage Description</label>
                            <textarea id="editDamageDescription" class="glass-input" rows="3" placeholder="Describe any damage...">${booking.damageDescription || ''}</textarea>
                        </div>
                        <div class="edit-item full-width">
                            <label>Notes</label>
                            <textarea id="editNotes" class="glass-input" rows="3" placeholder="Additional notes...">${booking.notes || ''}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Format date for datetime-local input
    formatDateTimeForInput(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Save booking changes
    async saveBookingChanges(bookingId) {
        console.log('Save booking changes clicked:', bookingId); // Debug log
        
        const booking = this.bookings.find(b => b.id === bookingId);
        if (!booking) {
            this.showToast('Booking not found', 'error');
            return;
        }

        try {
            // Get updated values from form
            const updatedBooking = {
                customerName: document.getElementById('editCustomerName').value,
                customerPhone: document.getElementById('editCustomerPhone').value,
                customerEmail: document.getElementById('editCustomerEmail').value,
                startDate: new Date(document.getElementById('editStartDate').value),
                endDate: new Date(document.getElementById('editEndDate').value),
                status: document.getElementById('editStatus').value,
                price: parseFloat(document.getElementById('editPrice').value),
                paymentMethod: document.getElementById('editPaymentMethod').value,
                hasHelmet: document.getElementById('editHasHelmet').checked,
                hasDamage: document.getElementById('editHasDamage').checked,
                damageDescription: document.getElementById('editDamageDescription').value,
                notes: document.getElementById('editNotes').value
            };

            // Validate required fields
            if (!updatedBooking.customerName || !updatedBooking.customerPhone || !updatedBooking.price) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }

            // Update local booking object
            Object.assign(booking, updatedBooking);

            // Update in Firebase if available
            if (window.db) {
                await db.collection('bookings').doc(bookingId).update({
                    customerName: updatedBooking.customerName,
                    customerPhone: updatedBooking.customerPhone,
                    customerEmail: updatedBooking.customerEmail,
                    startDate: updatedBooking.startDate,
                    endDate: updatedBooking.endDate,
                    status: updatedBooking.status,
                    price: updatedBooking.price,
                    paymentMethod: updatedBooking.paymentMethod,
                    hasHelmet: updatedBooking.hasHelmet,
                    hasDamage: updatedBooking.hasDamage,
                    damageDescription: updatedBooking.damageDescription,
                    notes: updatedBooking.notes,
                    updatedAt: new Date()
                });
            }

            // Refresh UI
            this.renderBookings();
            this.updateStats();
            this.closeBookingModal();
            this.showToast('Booking updated successfully!', 'success');
            console.log('Booking updated:', bookingId);

        } catch (error) {
            console.error('Error updating booking:', error);
            this.showToast('Failed to update booking. Please try again.', 'error');
        }
    }

    // Delete booking
    async deleteBooking(bookingId) {
        console.log('Delete booking clicked:', bookingId); // Debug log
        
        if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            return;
        }

        try {
            // Remove from local array
            const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
            if (bookingIndex === -1) {
                this.showToast('Booking not found', 'error');
                return;
            }

            // Delete from Firebase if available
            if (window.db) {
                await db.collection('bookings').doc(bookingId).delete();
            }

            // Remove from local arrays
            this.bookings.splice(bookingIndex, 1);
            this.filteredBookings = this.filteredBookings.filter(b => b.id !== bookingId);

            // Refresh UI
            this.renderBookings();
            this.updateStats();
            this.showToast('Booking deleted successfully!', 'success');
            console.log('Booking deleted:', bookingId);

        } catch (error) {
            console.error('Error deleting booking:', error);
            this.showToast('Failed to delete booking. Please try again.', 'error');
        }
    }

    // Toggle filter dropdown
    toggleFilterDropdown() {
        const dropdown = document.getElementById('filterDropdown');
        dropdown.classList.toggle('show');
    }

    // Apply filters
    applyFilters() {
        const statusFilter = document.getElementById('statusFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        this.filteredBookings = this.bookings.filter(booking => {
            let matchesStatus = !statusFilter || booking.status === statusFilter;
            let matchesStartDate = !startDate || new Date(booking.startDate) >= new Date(startDate);
            let matchesEndDate = !endDate || new Date(booking.endDate) <= new Date(endDate);

            return matchesStatus && matchesStartDate && matchesEndDate;
        });

        this.currentPage = 1;
        this.renderBookings();
        this.toggleFilterDropdown();
    }

    // Export bookings
    exportBookings() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.showToast('Bookings exported successfully!', 'success');
    }

    // Generate CSV content
    generateCSV() {
        const headers = ['Booking ID', 'Customer Name', 'Bike Name', 'Start Date', 'End Date', 'Status', 'Price', 'Payment Method'];
        const rows = this.filteredBookings.map(booking => [
            booking.id,
            booking.customerName,
            booking.bikeName,
            this.formatDate(booking.startDate),
            this.formatDate(booking.endDate),
            booking.status,
            booking.price,
            booking.paymentMethod
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Pagination
    updatePagination() {
        const totalPages = Math.ceil(this.filteredBookings.length / this.itemsPerPage);
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;

        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderBookings();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredBookings.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderBookings();
        }
    }

    // Print booking
    printBooking() {
        window.print();
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Apply language
    applyLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });
    }
}

// Global functions
function toggleFilterDropdown() {
    bookingsManager.toggleFilterDropdown();
}

function applyFilters() {
    bookingsManager.applyFilters();
}

function exportBookings() {
    bookingsManager.exportBookings();
}

function previousPage() {
    bookingsManager.previousPage();
}

function nextPage() {
    bookingsManager.nextPage();
}

function closeBookingModal() {
    bookingsManager.closeBookingModal();
}

function printBooking() {
    bookingsManager.printBooking();
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .detail-section {
        margin-bottom: 2rem;
    }
    
    .detail-section h3 {
        color: var(--white);
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .detail-item label {
        display: block;
        color: var(--text-light);
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }
    
    .detail-item value {
        display: block;
        color: var(--white);
        font-weight: 600;
    }
    
    .rating-display {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .rating-display i {
        color: #f59e0b;
    }
    
    .booking-edit-modal {
        max-height: 70vh;
        overflow-y: auto;
    }
    
    .edit-section {
        margin-bottom: 2rem;
    }
    
    .edit-section h3 {
        color: var(--white);
        margin-bottom: 1rem;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .edit-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    .edit-item {
        display: flex;
        flex-direction: column;
    }
    
    .edit-item.full-width {
        grid-column: 1 / -1;
    }
    
    .edit-item label {
        color: var(--text-light);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .edit-item input[type="checkbox"] {
        width: auto;
        margin-right: 0.5rem;
    }
    
    .glass-input, .glass-select {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 0.75rem;
        color: var(--white);
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .glass-input:focus, .glass-select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    .glass-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
    
    textarea.glass-input {
        resize: vertical;
        min-height: 80px;
    }
`;
document.head.appendChild(style);

// Initialize bookings manager
let bookingsManager;
document.addEventListener('DOMContentLoaded', () => {
    bookingsManager = new BookingsManager();
});

// Global functions for button onclick handlers
function toggleFilterDropdown() {
    console.log('Toggle filter dropdown clicked'); // Debug log
    if (bookingsManager) {
        bookingsManager.toggleFilterDropdown();
    }
}

function applyFilters() {
    console.log('Apply filters clicked'); // Debug log
    if (bookingsManager) {
        bookingsManager.applyFilters();
    }
}

function exportBookings() {
    console.log('Export bookings clicked'); // Debug log
    if (bookingsManager) {
        bookingsManager.exportBookings();
    }
}

function previousPage() {
    console.log('Previous page clicked'); // Debug log
    if (bookingsManager) {
        bookingsManager.previousPage();
    }
}

function nextPage() {
    console.log('Next page clicked'); // Debug log
    if (bookingsManager) {
        bookingsManager.nextPage();
    }
}

function closeBookingModal() {
    console.log('Close booking modal clicked'); // Debug log
    if (bookingsManager) {
        bookingsManager.closeBookingModal();
    }
}

function printBooking() {
    console.log('Print booking clicked'); // Debug log
    if (bookingsManager) {
        bookingsManager.printBooking();
    }
}

function viewBookingDetails(bookingId) {
    console.log('View booking details clicked:', bookingId); // Debug log
    if (bookingsManager) {
        bookingsManager.viewBookingDetails(bookingId);
    }
}

function completeBooking(bookingId) {
    console.log('Complete booking clicked:', bookingId); // Debug log
    if (bookingsManager) {
        bookingsManager.completeBooking(bookingId);
    }
}

function cancelBooking(bookingId) {
    console.log('Cancel booking clicked:', bookingId); // Debug log
    if (bookingsManager) {
        bookingsManager.cancelBooking(bookingId);
    }
}

function editBooking(bookingId) {
    console.log('Edit booking clicked:', bookingId); // Debug log
    if (bookingsManager) {
        bookingsManager.editBooking(bookingId);
    }
}

function deleteBooking(bookingId) {
    console.log('Delete booking clicked:', bookingId); // Debug log
    if (bookingsManager) {
        bookingsManager.deleteBooking(bookingId);
    }
}

function saveBookingChanges(bookingId) {
    console.log('Save booking changes clicked:', bookingId); // Debug log
    if (bookingsManager) {
        bookingsManager.saveBookingChanges(bookingId);
    }
}
