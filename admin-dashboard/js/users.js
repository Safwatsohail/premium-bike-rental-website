// Users Page JavaScript - Firebase Integration
class UsersManager {
    constructor() {
        this.users = [];
        this.unsubscribe = null;
        this.currentPage = 1;
        this.usersPerPage = 12;
        this.filteredUsers = [];
        this.currentLang = localStorage.getItem('language') || 'en';

        // Don't initialize immediately - wait for DOMContentLoaded
        // This ensures Firebase is fully loaded
    }

    init() {
        console.log('UsersManager init called, window.db:', window.db ? 'exists' : 'missing');
        if (!window.db) {
            console.error('Firebase not initialized! window.db is undefined');
            const usersGrid = document.getElementById('usersGrid');
            if (usersGrid) {
                usersGrid.innerHTML = '<div class="error">Firebase not initialized. Please refresh the page.</div>';
            }
            return;
        }
        this.setupRealtimeListener();
        this.setupEventListeners();
    }

    setupRealtimeListener() {
        const usersGrid = document.getElementById('usersGrid');
        
        // Try to load from cache first for instant display
        const cachedUsers = sessionStorage.getItem('admin_users_cache');
        if (cachedUsers) {
            try {
                this.users = JSON.parse(cachedUsers);
                this.filteredUsers = [...this.users];
                console.log('⚡ Users: Loaded from cache instantly');
                this.updateStats();
                this.renderUsers();
            } catch(e) {}
        } else if (usersGrid) {
            usersGrid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading users...</div>';
        }

        // Try with orderBy first, fallback to simple query if it fails
        const setupListener = (useOrderBy = true) => {
            try {
                let query = window.db.collection('users');

                if (useOrderBy) {
                    query = query.orderBy('createdAt', 'desc');
                }

                this.unsubscribe = query.onSnapshot(async (snapshot) => {
                    console.log('Users snapshot received:', snapshot.size, 'users');
                    this.users = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // Fetch bookings to calculate user spending
                    try {
                        const bookingsSnapshot = await window.db.collection('bookings').get();
                        const bookingsByUser = {};

                        bookingsSnapshot.forEach(bookingDoc => {
                            const booking = bookingDoc.data();
                            const userEmail = booking.email || booking.customerEmail;

                            // Only count paid/confirmed bookings
                            const status = (booking.status || '').toLowerCase();
                            const isPaid = status === 'confirmed' || status === 'paid' || status === 'completed' || status === 'active';

                            if (userEmail && isPaid) {
                                if (!bookingsByUser[userEmail]) {
                                    bookingsByUser[userEmail] = {
                                        totalSpent: 0,
                                        totalRentals: 0
                                    };
                                }

                                const amount = parseFloat(booking.amount || booking.totalAmount || 0);
                                bookingsByUser[userEmail].totalSpent += amount;
                                bookingsByUser[userEmail].totalRentals += 1;
                            }
                        });

                        // Add booking stats to users
                        this.users = this.users.map(user => {
                            const userStats = bookingsByUser[user.email] || { totalSpent: 0, totalRentals: 0 };
                            return {
                                ...user,
                                totalSpent: userStats.totalSpent,
                                totalRentals: userStats.totalRentals
                            };
                        });

                        console.log('User spending calculated from bookings');
                    } catch (error) {
                        console.error('Error fetching bookings for user stats:', error);
                    }

                    // Cache for faster subsequent loads
                    sessionStorage.setItem('admin_users_cache', JSON.stringify(this.users));
                    
                    this.filteredUsers = [...this.users];
                    this.updateStats();
                    this.renderUsers();
                }, (error) => {
                    console.error("Error fetching users:", error);

                    // If orderBy failed, try without it
                    if (useOrderBy && error.code === 'failed-precondition') {
                        console.log('Retrying without orderBy...');
                        setupListener(false);
                    } else {
                        if (usersGrid) {
                            usersGrid.innerHTML = '<div class="error">Error loading users: ' + error.message + '</div>';
                        }
                    }
                });
            } catch (error) {
                console.error("Error setting up listener:", error);
                if (usersGrid) {
                    usersGrid.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
                }
            }
        };

        setupListener(true);
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        document.getElementById('userSearch').addEventListener('input', (e) => {
            this.searchUsers(e.target.value);
        });

        // Filter functionality
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filterUsers(e.target.value);
        });

        // Modal logic via global clicks or specific bindings
        // Note: Global functions are exposed at bottom
    }

    // Render users grid
    renderUsers() {
        const usersGrid = document.getElementById('usersGrid');
        if (this.filteredUsers.length === 0) {
            usersGrid.innerHTML = '<div class="no-results">No users found</div>';
            return;
        }

        const startIndex = (this.currentPage - 1) * this.usersPerPage;
        const endIndex = startIndex + this.usersPerPage;
        const usersToShow = this.filteredUsers.slice(startIndex, endIndex);

        usersGrid.innerHTML = usersToShow.map(user => this.createUserCard(user)).join('');
        this.updatePagination();

        // Apply translations if needed
        if (window.translationManager) window.translationManager.translatePage();
    }

    // Create user card HTML
    createUserCard(user) {
        // Fallback checks
        const firstName = user.firstName || 'Guest';
        const lastName = user.lastName || '';
        const email = user.email || 'No Email';
        const status = user.status || 'new';
        const avatar = user.avatar || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;

        // Stats fallbacks
        const totalRentals = user.totalRentals || 0;
        const totalSpent = user.totalSpent || 0;

        return `
            <div class="user-card" onclick="viewUserDetails('${user.id}')">
                <div class="user-header">
                    <div class="user-avatar">
                        <img src="${avatar}" alt="${firstName}">
                        <div class="user-status ${status}" title="User status: ${status}"></div>
                    </div>
                    <div class="user-info">
                        <h3>${firstName} ${lastName}</h3>
                        <p><i class="fas fa-envelope"></i> ${email}</p>
                        <p><i class="fas fa-phone"></i> ${user.phone || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="user-stats">
                     <div class="user-stat">
                        <span class="user-stat-value">${totalRentals}</span>
                        <span class="user-stat-label">Rentals</span>
                    </div>
                    <div class="user-stat">
                         <span class="user-stat-value">AED ${totalSpent}</span>
                         <span class="user-stat-label">Spent</span>
                    </div>
                </div>
                
                <div class="user-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); viewUserDetails('${user.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-danger" onclick="event.stopPropagation(); deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    // View user details
    viewUserDetails(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modalBody = document.getElementById('userModalBody');
        modalBody.innerHTML = this.createUserDetailsHTML(user);

        document.getElementById('userModal').classList.add('show');
    }

    createUserDetailsHTML(user) {
        // Similar to before but safe property access
        const joinedDate = user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';

        return `
            <div class="user-detail-modal">
                <div class="detail-section">
                    <h3><i class="fas fa-user"></i> Personal Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item"><label>Name</label> <value>${user.firstName} ${user.lastName}</value></div>
                        <div class="detail-item"><label>Email</label> <value>${user.email}</value></div>
                        <div class="detail-item"><label>Phone</label> <value>${user.phone || 'N/A'}</value></div>
                        <div class="detail-item"><label>ID Type</label> <value>${user.idType || 'N/A'}</value></div>
                        <div class="detail-item"><label>ID Number</label> <value>${user.idNumber || 'N/A'}</value></div>
                    </div>
                </div>
                <div class="detail-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Address</h3>
                    <p>${user.address || 'No address provided'}</p>
                </div>
                <!-- Add Rental History here if linked collection exists -->
            </div>
        `;
    }

    async deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                await window.db.collection('users').doc(userId).delete();
                // Notification handled by UI usually, or simpler alert
                // Toast logic could be re-added here
            } catch (e) {
                console.error("Delete failed", e);
                alert("Failed to delete user: " + e.message);
            }
        }
    }

    // Search users
    searchUsers(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredUsers = this.users.filter(user =>
            (user.firstName || '').toLowerCase().includes(term) ||
            (user.lastName || '').toLowerCase().includes(term) ||
            (user.email || '').toLowerCase().includes(term)
        );
        this.currentPage = 1;
        this.renderUsers();
    }

    // Filter users
    filterUsers(status) {
        if (status === 'all') {
            this.filteredUsers = [...this.users];
        } else {
            this.filteredUsers = this.users.filter(user => user.status === status);
        }
        this.currentPage = 1;
        this.renderUsers();
    }

    // Update statistics
    updateStats() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(u => u.status === 'active').length;
        const newUsers = this.users.filter(u => u.status === 'new' || u.status === 'pending_booking').length;

        const totalEl = document.getElementById('totalUsers');
        if (totalEl) totalEl.textContent = totalUsers.toLocaleString();

        const activeEl = document.getElementById('activeUsers');
        if (activeEl) activeEl.textContent = activeUsers.toLocaleString();

        const newEl = document.getElementById('newUsers');
        if (newEl) newEl.textContent = newUsers.toLocaleString();
    }

    // Update pagination
    updatePagination() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage) || 1;
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderUsers();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderUsers();
        }
    }

    closeUserModal() {
        document.getElementById('userModal').classList.remove('show');
    }
}

// Global Exports for HTML onclick handlers
let usersManager;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired, creating UsersManager');
    usersManager = new UsersManager();
    // Initialize after a short delay to ensure Firebase is ready
    setTimeout(() => {
        if (usersManager) {
            usersManager.init();
        }
    }, 100);
});

function viewUserDetails(id) { usersManager.viewUserDetails(id); }
function deleteUser(id) { usersManager.deleteUser(id); }
function closeUserModal() { usersManager.closeUserModal(); }
function nextPage() { usersManager.nextPage(); }
function previousPage() { usersManager.previousPage(); }
function addNewUser() { alert('Add User not implemented for this demo yet.'); }
function exportUsers() { alert('Export not implemented yet.'); }
function editUser() { alert('Edit not implemented yet.'); }
function sendMessage() { alert('Message not implemented yet.'); }
function printUserDetails() { window.print(); }
