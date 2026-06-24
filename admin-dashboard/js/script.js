// Sample data for recent orders
const orders = [
    { id: '#ORD-001', customer: 'John Doe', product: 'Premium Plan', amount: 'AED 99.99', status: 'completed' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'Basic Plan', amount: 'AED 49.99', status: 'pending' },
    { id: '#ORD-003', customer: 'Robert Johnson', product: 'Pro Plan', amount: 'AED 149.99', status: 'completed' },
    { id: '#ORD-004', customer: 'Emily Davis', product: 'Basic Plan', amount: 'AED 49.99', status: 'cancelled' },
    { id: '#ORD-005', customer: 'Michael Wilson', product: 'Premium Plan', amount: 'AED 99.99', status: 'completed' },
];

// Function to populate orders table
function populateOrdersTable() {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = ''; // Clear existing rows

    orders.forEach(order => {
        const row = document.createElement('tr');
        
        // Format status with appropriate class
        const statusClass = order.status.toLowerCase();
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.amount}</td>
            <td><span class="status ${statusClass}">${order.status}</span></td>
            <td><button class="btn btn-view">View</button></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Function to handle sidebar toggle on mobile
function setupMobileMenu() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.top-bar').prepend(menuToggle);

    menuToggle.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#orders-table-body tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    populateOrdersTable();
    setupMobileMenu();
    setupSearch();
    
    // Add click event to sidebar menu items
    const menuItems = document.querySelectorAll('.sidebar nav ul li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
        });
    });
    
    // Simulate real-time updates (just for demo)
    setInterval(() => {
        const stats = document.querySelectorAll('.stat-card h3');
        stats.forEach(stat => {
            const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
            const increment = Math.floor(Math.random() * 10) + 1;
            stat.textContent = stat.textContent.replace(/\d+/, currentValue + increment);
        });
    }, 5000);
});
