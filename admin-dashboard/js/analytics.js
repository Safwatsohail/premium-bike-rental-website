// Analytics Page JavaScript
class AnalyticsManager {
    constructor() {
        this.charts = {};
        this.currentTimeRange = 30;
        this.translations = {
            en: {
                'analytics': 'Analytics',
                'refresh': 'Refresh',
                'export': 'Export',
                'total-revenue': 'Total Revenue',
                'new-users': 'New Users',
                'growth-rate': 'Growth Rate',
                'total-bookings': 'Total Bookings',
                'revenue-trend': 'Revenue Trend',
                'user-growth': 'User Growth',
                'growth-analysis': 'Growth Analysis',
                'booking-distribution': 'Booking Distribution',
                'performance-summary': 'Performance Summary',
                'period': 'Period',
                'revenue': 'Revenue',
                'users': 'Users',
                'bookings': 'Bookings',
                'growth': 'Growth',
                'performance': 'Performance'
            },
            ar: {
                'analytics': 'التحليلات',
                'refresh': 'تحديث',
                'export': 'تصدير',
                'total-revenue': 'إجمالي الإيرادات',
                'new-users': 'المستخدمون الجدد',
                'growth-rate': 'معدل النمو',
                'total-bookings': 'إجمالي الحجوزات',
                'revenue-trend': 'اتجاه الإيرادات',
                'user-growth': 'نمو المستخدمين',
                'growth-analysis': 'تحليل النمو',
                'booking-distribution': 'توزيع الحجوزات',
                'performance-summary': 'ملخص الأداء',
                'period': 'الفترة',
                'revenue': 'الإيرادات',
                'users': 'المستخدمون',
                'bookings': 'الحجوزات',
                'growth': 'النمو',
                'performance': 'الأداء'
            }
        };
        this.currentLang = localStorage.getItem('bikerent_language') || 'en';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAnalyticsFromFirebase();
        this.applyLanguage();
    }

    setupEventListeners() {
        // Time range selector
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.currentTimeRange = parseInt(e.target.value);
            this.loadAnalyticsFromFirebase();
        });

        // Chart type buttons
        document.querySelectorAll('.chart-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartName = e.currentTarget.dataset.chart;
                const chartType = e.currentTarget.dataset.type;
                this.switchChartType(chartName, chartType);
            });
        });
    }

    // Load analytics data from Firebase
    async loadAnalyticsFromFirebase() {
        try {
            const bookingsSnapshot = await db.collection('bookings').get();
            const bookings = [];

            bookingsSnapshot.forEach(doc => {
                const data = doc.data();
                bookings.push({
                    id: doc.id,
                    amount: parseFloat(data.amount || data.totalAmount || data.price || 0),
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
                    status: data.status || 'confirmed'
                });
            });

            // Generate analytics based on real data
            const analyticsData = this.generateAnalyticsFromBookings(bookings);

            // Update metrics
            this.updateMetricsFromData(bookings);

            // Initialize or update charts
            if (Object.keys(this.charts).length === 0) {
                this.initializeCharts(analyticsData);
            } else {
                this.updateChartsWithData(analyticsData);
            }

            this.populateAnalyticsTable(bookings);

        } catch (error) {
            console.error('Error loading analytics from Firebase:', error);
            this.showToast('Failed to load analytics data', 'error');
            // Fallback to empty data
            const emptyData = this.generateAnalyticsData();
            this.initializeCharts(emptyData);
            this.updateMetrics();
            this.populateAnalyticsTable();
        }
    }

    // Generate analytics data from bookings
    generateAnalyticsFromBookings(bookings) {
        const days = this.currentTimeRange;
        const data = {
            revenue: [],
            users: [],
            growth: [],
            labels: []
        };

        // Filter only paid/confirmed bookings
        console.log('📊 Analytics: Total bookings received:', bookings.length);
        const paidBookings = bookings.filter(b => {
            const status = (b.status || '').toLowerCase();
            const isPaid = status === 'confirmed' || status === 'paid' || status === 'completed' || status === 'active';
            if (isPaid) {
                console.log(`✅ Analytics counting: ${b.id?.slice(-6)} - $${b.amount} (${status})`);
            } else {
                console.log(`❌ Analytics excluding: ${b.id?.slice(-6)} - $${b.amount} (${status})`);
            }
            return isPaid;
        });
        console.log('💰 Analytics: Paid bookings count:', paidBookings.length);
        console.log('💰 Analytics: Total revenue:', paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0));

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            data.labels.push(date.toLocaleDateString(this.currentLang === 'ar' ? 'ar-SA' : 'en-US', {
                month: 'short',
                day: 'numeric'
            }));

            // Calculate revenue for this day (only paid bookings)
            const dayRevenue = paidBookings
                .filter(b => {
                    const bookingDate = new Date(b.createdAt);
                    return bookingDate >= date && bookingDate < nextDate;
                })
                .reduce((sum, b) => sum + b.amount, 0);

            data.revenue.push(dayRevenue);

            // Count unique users (bookings) for this day
            const dayUsers = paidBookings.filter(b => {
                const bookingDate = new Date(b.createdAt);
                return bookingDate >= date && bookingDate < nextDate;
            }).length;

            data.users.push(dayUsers);

            // Calculate growth rate (simplified)
            const prevDayRevenue = i < days - 1 ? data.revenue[data.revenue.length - 2] || 0 : 0;
            const growth = prevDayRevenue > 0 ? ((dayRevenue - prevDayRevenue) / prevDayRevenue * 100) : 0;
            data.growth.push(Math.round(growth * 10) / 10);
        }

        return data;
    }

    // Update metrics from real booking data
    updateMetricsFromData(bookings) {
        // Filter only paid/confirmed bookings
        const paidBookings = bookings.filter(b => {
            const status = (b.status || '').toLowerCase();
            return status === 'confirmed' || status === 'paid' || status === 'completed' || status === 'active';
        });

        const totalRevenue = paidBookings.reduce((sum, b) => sum + b.amount, 0);
        const totalBookings = paidBookings.length;
        const newUsers = paidBookings.length; // Simplified - each booking is a user

        // Calculate growth rate (only from paid bookings)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const last30DaysRevenue = paidBookings
            .filter(b => new Date(b.createdAt) >= thirtyDaysAgo)
            .reduce((sum, b) => sum + b.amount, 0);

        const previous30DaysRevenue = paidBookings
            .filter(b => {
                const date = new Date(b.createdAt);
                return date >= sixtyDaysAgo && date < thirtyDaysAgo;
            })
            .reduce((sum, b) => sum + b.amount, 0);

        const growthRate = previous30DaysRevenue > 0
            ? ((last30DaysRevenue - previous30DaysRevenue) / previous30DaysRevenue * 100)
            : 0;

        this.animateValue('totalRevenue', 0, totalRevenue, 1500, 'AED ');
        this.animateValue('newUsers', 0, newUsers, 1500, '');
        this.animateValue('growthRate', 0, growthRate, 1500, '', '%');
        this.animateValue('totalBookings', 0, totalBookings, 1500, '');
    }

    // Update charts with new data
    updateChartsWithData(data) {
        if (this.charts.revenueChart) {
            this.charts.revenueChart.data.labels = data.labels;
            this.charts.revenueChart.data.datasets[0].data = data.revenue;
            this.charts.revenueChart.update();
        }

        if (this.charts.usersChart) {
            this.charts.usersChart.data.labels = data.labels;
            this.charts.usersChart.data.datasets[0].data = data.users;
            this.charts.usersChart.update();
        }

        if (this.charts.growthChart) {
            this.charts.growthChart.data.labels = data.labels;
            this.charts.growthChart.data.datasets[0].data = data.growth;
            this.charts.growthChart.update();
        }
    }

    // Generate mock analytics data (fallback)
    generateAnalyticsData() {
        const days = this.currentTimeRange;
        const data = {
            revenue: [],
            users: [],
            growth: [],
            labels: []
        };

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.labels.push(date.toLocaleDateString(this.currentLang === 'ar' ? 'ar-SA' : 'en-US', {
                month: 'short',
                day: 'numeric'
            }));

            // Generate zeroed data
            data.revenue.push(0);
            data.users.push(0);
            data.growth.push(0);
        }

        return data;
    }

    // Initialize all charts
    initializeCharts(data = null) {
        if (!data) {
            data = this.generateAnalyticsData();
        }

        // Revenue Chart
        this.createChart('revenueChart', {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue (AED)',
                    data: data.revenue,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: this.getChartOptions('Revenue', ' AED')
        });

        // Users Chart
        this.createChart('usersChart', {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'New Users',
                    data: data.users,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: this.getChartOptions('Users', '')
        });

        // Growth Chart
        this.createChart('growthChart', {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Growth Rate (%)',
                    data: data.growth,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: this.getChartOptions('Growth Rate', '%')
        });

        // Distribution Chart
        this.createChart('distributionChart', {
            type: 'doughnut',
            data: {
                labels: ['Mountain Bikes', 'City Bikes', 'Electric Bikes', 'Sport Bikes', 'Touring Bikes'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#8b5cf6',
                        '#ef4444'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e2e8f0',
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#e2e8f0',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Create individual chart
    createChart(canvasId, config) {
        const ctx = document.getElementById(canvasId);
        if (ctx) {
            this.charts[canvasId] = new Chart(ctx, config);
        }
    }

    // Get common chart options
    getChartOptions(label, suffix) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return label + ': ' + context.parsed.y + suffix;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        },
                        callback: function (value) {
                            return value + suffix;
                        }
                    }
                }
            }
        };
    }

    // Switch chart type
    switchChartType(chartName, newType) {
        const chartMap = {
            'revenue': 'revenueChart',
            'users': 'usersChart',
            'growth': 'growthChart',
            'distribution': 'distributionChart'
        };

        const chartId = chartMap[chartName];
        const chart = this.charts[chartId];

        if (chart && chartName !== 'distribution') {
            // Update button states
            document.querySelectorAll(`[data-chart="${chartName}"]`).forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === newType);
            });

            // Update chart type
            chart.config.type = newType;
            chart.update();
        }
    }

    // Update metrics cards
    updateMetrics() {
        // Reset all metrics to 0
        this.animateValue('totalRevenue', 0, 0, 1500, 'AED ');
        this.animateValue('newUsers', 0, 0, 1500, '');
        this.animateValue('growthRate', 0, 0, 1500, '', '%');
        this.animateValue('totalBookings', 0, 0, 1500, '');
    }

    // Animate number changes
    animateValue(id, start, end, duration, prefix = '', suffix = '') {
        const element = document.getElementById(id);
        if (!element) return;

        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }

            if (suffix === '%') {
                element.textContent = prefix + current.toFixed(1) + suffix;
            } else {
                element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }
        }, 16);
    }

    // Populate analytics table
    populateAnalyticsTable(bookings = []) {
        const tableBody = document.getElementById('analyticsTableBody');
        if (!tableBody) return;

        const calculatePeriodStats = (days) => {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const periodBookings = bookings.filter(b => new Date(b.createdAt) >= cutoffDate);
            const revenue = periodBookings.reduce((sum, b) => sum + b.amount, 0);
            const users = periodBookings.length;
            const bookingCount = periodBookings.length;

            // Calculate growth (compare to previous period)
            const previousCutoff = new Date();
            previousCutoff.setDate(previousCutoff.getDate() - (days * 2));
            const previousPeriodBookings = bookings.filter(b => {
                const date = new Date(b.createdAt);
                return date >= previousCutoff && date < cutoffDate;
            });
            const previousRevenue = previousPeriodBookings.reduce((sum, b) => sum + b.amount, 0);
            const growth = previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue * 100) : 0;

            return { revenue, users, bookings: bookingCount, growth: Math.round(growth * 10) / 10 };
        };

        const periods = [
            { name: 'Last 7 days', ...calculatePeriodStats(7) },
            { name: 'Last 30 days', ...calculatePeriodStats(30) },
            { name: 'Last 3 months', ...calculatePeriodStats(90) },
            { name: 'Last year', ...calculatePeriodStats(365) }
        ];

        tableBody.innerHTML = periods.map(period => {
            const performance = this.getPerformanceLevel(period.growth);
            const growthClass = period.growth >= 0 ? 'positive' : 'negative';
            const growthIcon = period.growth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            return `
                <tr>
                    <td>${period.name}</td>
                    <td>AED ${Math.round(period.revenue).toLocaleString()}</td>
                    <td>${period.users.toLocaleString()}</td>
                    <td>${period.bookings.toLocaleString()}</td>
                    <td>
                        <span class="metric-change ${growthClass}">
                            <i class="fas ${growthIcon}"></i> ${Math.abs(period.growth)}%
                        </span>
                    </td>
                    <td>
                        <span class="performance-badge ${performance.class}">${performance.label}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Get performance level based on growth
    getPerformanceLevel(growth) {
        if (growth >= 30) return { class: 'excellent', label: 'Excellent' };
        if (growth >= 20) return { class: 'good', label: 'Good' };
        if (growth >= 10) return { class: 'average', label: 'Average' };
        return { class: 'poor', label: 'Poor' };
    }

    // Refresh all analytics
    refreshAnalytics() {
        // Show loading state
        this.showLoadingState();

        // Reload from Firebase
        setTimeout(() => {
            this.loadAnalyticsFromFirebase();
            this.hideLoadingState();
            this.showToast('Analytics refreshed successfully!', 'success');
        }, 500);
    }

    // Update charts with new data
    updateCharts() {
        const data = this.generateAnalyticsData();

        // Update existing charts
        if (this.charts.revenueChart) {
            this.charts.revenueChart.data.labels = data.labels;
            this.charts.revenueChart.data.datasets[0].data = data.revenue;
            this.charts.revenueChart.update();
        }

        if (this.charts.usersChart) {
            this.charts.usersChart.data.labels = data.labels;
            this.charts.usersChart.data.datasets[0].data = data.users;
            this.charts.usersChart.update();
        }

        if (this.charts.growthChart) {
            this.charts.growthChart.data.labels = data.labels;
            this.charts.growthChart.data.datasets[0].data = data.growth;
            this.charts.growthChart.update();
        }
    }

    // Show loading state
    showLoadingState() {
        document.querySelectorAll('.chart-body').forEach(body => {
            body.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Loading data...</div>';
        });
    }

    // Hide loading state
    hideLoadingState() {
        // Recreate charts after loading
        this.initializeCharts();
    }

    // Export analytics data
    exportAnalytics() {
        const data = this.generateAnalyticsData();
        const csvContent = this.generateAnalyticsCSV(data);

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showToast('Analytics exported successfully!', 'success');
    }

    // Generate CSV content for analytics
    generateAnalyticsCSV(data) {
        const headers = ['Date', 'Revenue', 'New Users', 'Growth Rate'];
        const rows = data.labels.map((label, index) => [
            label,
            data.revenue[index],
            data.users[index],
            data.growth[index] + '%'
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Toggle table columns (placeholder function)
    toggleTableColumns() {
        this.showToast('Column customization coming soon!', 'info');
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
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
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
function refreshAnalytics() {
    analyticsManager.refreshAnalytics();
}

function exportAnalytics() {
    analyticsManager.exportAnalytics();
}

function toggleTableColumns() {
    analyticsManager.toggleTableColumns();
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
`;
document.head.appendChild(style);

// Initialize analytics manager
let analyticsManager;
document.addEventListener('DOMContentLoaded', () => {
    analyticsManager = new AnalyticsManager();
});
