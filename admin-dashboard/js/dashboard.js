// Dashboard JavaScript for BikeRent Pro
let dashboardStats = {};
let unsubscribe = null;

// DOM Elements
// DOM Elements
const ordersTableBody = document.getElementById('orders-table-body');
const totalUsersElement = document.querySelector('.total-users');
const totalBikesElement = document.querySelector('.total-bikes');
const totalBookingsElement = document.querySelector('.total-bookings');
const totalRevenueElement = document.querySelector('.total-revenue');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    if (window.firebaseService) {
        await initializeDashboard();

        // Auto-populate sample data if database is empty
        await autoPopulateSampleData();
    } else {
        console.error('Firebase service not initialized');
        // Fallback to sample data
        loadSampleData();
    }
});

// Initialize dashboard with Firebase
async function initializeDashboard() {
    try {
        // Show loading state
        showLoadingState();

        // Set up real-time listener for dashboard stats
        unsubscribe = window.firebaseService.onDashboardStatsChange((stats) => {
            dashboardStats = stats;
            updateDashboardUI(stats);
        });

        // Get initial stats
        dashboardStats = await window.firebaseService.getDashboardStats();
        updateDashboardUI(dashboardStats);

        // Load recent bookings
        await loadRecentBookings();

    } catch (error) {
        console.error('Error initializing dashboard:', error);
        // Fallback to sample data
        loadSampleData();
    }
}

// Show loading state
function showLoadingState() {
    if (totalUsersElement) totalUsersElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    if (totalBikesElement) totalBikesElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    if (totalBookingsElement) totalBookingsElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    if (totalRevenueElement) totalRevenueElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    if (ordersTableBody) {
        ordersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    }
}

// Update dashboard UI with stats
function updateDashboardUI(stats) {
    if (totalUsersElement) totalUsersElement.textContent = (stats.totalUsers || 0).toLocaleString();
    if (totalBikesElement) {
        // Show total bikes even if zero
        totalBikesElement.textContent = (stats.totalBikes || 0).toLocaleString();
    }
    if (totalBookingsElement) totalBookingsElement.textContent = (stats.totalBookings || 0).toLocaleString();
    if (totalRevenueElement) totalRevenueElement.textContent = formatCurrency(stats.totalRevenue || 0, stats.currency || 'AED');
}

// Load recent bookings
async function loadRecentBookings() {
    try {
        const bookings = await window.firebaseService.getAllBookings();
        const users = await window.firebaseService.getAllUsers();
        const bikes = await window.firebaseService.getAllBikes();

        // Sort bookings by creation date (most recent first)
        const recentBookings = bookings
            .sort((a, b) => (b.createdAt?.toDate?.() || new Date()) - (a.createdAt?.toDate?.() || new Date()))
            .slice(0, 10); // Show last 10 bookings

        renderRecentBookings(recentBookings, users, bikes);

    } catch (error) {
        console.error('Error loading recent bookings:', error);
        renderRecentBookings([], [], []);
    }
}

// Render recent bookings table
function renderRecentBookings(bookings, users, bikes) {
    if (!ordersTableBody) return;

    if (bookings.length === 0) {
        ordersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No bookings found</td></tr>';
        return;
    }

    ordersTableBody.innerHTML = bookings.map(booking => {
        const user = users.find(u => u.id === booking.userId);
        const bike = bikes.find(b => b.id === booking.bikeId);

        // Fallback to booking data if user/bike not found
        const userName = user?.name || booking.customerName || booking.email || 'Unknown User';
        const bikeName = bike?.name || booking.bikeName || 'Unknown Bike';
        const amount = parseFloat(booking.amount || booking.totalAmount || 0);

        return `
            <tr>
                <td>#${booking.id.slice(-6)}</td>
                <td>${userName}</td>
                <td>${bikeName}</td>
                <td>${formatCurrency(amount, 'AED')}</td>
                <td><span class="status status-${booking.status || 'pending'}">${booking.status || 'pending'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewBookingDetails('${booking.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Calculate growth percentage
function calculateGrowth(stats) {
    // Simple growth calculation based on completed vs active bookings
    if (stats.totalBookings === 0) return 0;
    return Math.round((stats.completedBookings / stats.totalBookings) * 100);
}

// Format currency
function formatCurrency(amount, currency = 'AED') {
    return 'AED ' + parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// View booking details
async function viewBookingDetails(bookingId) {
    try {
        const booking = await window.firebaseService.db.collection('bookings').doc(bookingId).get();
        if (!booking.exists) {
            alert('Booking not found');
            return;
        }

        const bookingData = { id: booking.id, ...booking.data() };

        // Show booking details modal (you can implement this)
        alert(`Booking Details:\n\nID: ${bookingData.id}\nStatus: ${bookingData.status}\nTotal: ${formatCurrency(bookingData.totalAmount || 0)}\n\nImplement modal for better UX!`);

    } catch (error) {
        console.error('Error fetching booking details:', error);
        alert('Error loading booking details');
    }
}

// Load sample data (fallback)
function loadSampleData() {
    const sampleStats = {
        totalUsers: 1234,
        totalBookings: 567,
        totalRevenue: 12345,
        completedBookings: 450,
        currency: 'AED'
    };

    updateDashboardUI(sampleStats);

    // Sample bookings
    const sampleBookings = [
        { id: '1', userId: 'user1', bikeId: 'bike1', status: 'completed', totalAmount: 49.99 },
        { id: '2', userId: 'user2', bikeId: 'bike2', status: 'active', totalAmount: 69.99 },
        { id: '3', userId: 'user3', bikeId: 'bike3', status: 'pending', totalAmount: 39.99 }
    ];

    const sampleUsers = [
        { id: 'user1', name: 'John Doe' },
        { id: 'user2', name: 'Jane Smith' },
        { id: 'user3', name: 'Mike Johnson' }
    ];

    const sampleBikes = [
        { id: 'bike1', name: 'Mountain Pro X1' },
        { id: 'bike2', name: 'Roadster 5000' },
        { id: 'bike3', name: 'Urban Commuter' }
    ];

    renderRecentBookings(sampleBookings, sampleUsers, sampleBikes);
}

// Add status styles to the page
const statusStyles = document.createElement('style');
statusStyles.textContent = `
    .status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        display: inline-block;
    }
    
    .status-completed {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .status-active {
        background: rgba(37, 99, 235, 0.1);
        color: #2563eb;
        border: 1px solid rgba(37, 99, 235, 0.3);
    }
    
    .status-pending {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }
    
    .status-cancelled {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
    }
    
    .fa-spinner.fa-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(statusStyles);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (unsubscribe) {
        unsubscribe();
    }
});

// Auto-populate sample data if database is empty
async function autoPopulateSampleData() {
    try {
        // Check if database is empty
        const stats = await window.firebaseService.getDashboardStats();

        if (stats.totalUsers === 0 && stats.totalBikes === 0 && stats.totalBookings === 0) {
            console.log('🚀 Database is empty, populating sample data...');

            // Show loading notification
            showNotification('Setting up your bike rental system...', 'info');

            // Populate sample data
            await window.populateSampleData();

            // Refresh stats after populating
            setTimeout(async () => {
                const newStats = await window.firebaseService.getDashboardStats();
                updateDashboardUI(newStats);
                await loadRecentBookings();

                showNotification('🎉 Sample data loaded successfully!', 'success');
            }, 2000);
        }
    } catch (error) {
        console.error('Error checking database:', error);
    }
}

// Show notification for dashboard
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}
