// Session Manager - Protects all admin pages
class SessionManager {
    constructor() {
        this.sessionDuration = 30 * 60 * 1000; // 30 minutes
        this.warningTime = 5 * 60 * 1000; // 5 minutes before expiry
        this.translations = {
            en: {
                'session-expired': 'Session Expired',
                'session-expired-msg': 'Your session has expired. Please login again.',
                'session-expiring': 'Session Expiring Soon',
                'session-expiring-msg': 'Your session will expire in 5 minutes. Would you like to extend it?',
                'extend-session': 'Extend Session',
                'logout': 'Logout',
                'dashboard': 'Dashboard',
                'bikes': 'Bikes',
                'settings': 'Settings',
                'users': 'Users',
                'bookings': 'Bookings',
                'analytics': 'Analytics'
            },
            ar: {
                'session-expired': 'انتهت الجلسة',
                'session-expired-msg': 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.',
                'session-expiring': 'الجلسة ستنتهي قريباً',
                'session-expiring-msg': 'ستنتهي جلستك خلال 5 دقائق. هل تريد تمديدها؟',
                'extend-session': 'تمديد الجلسة',
                'logout': 'تسجيل الخروج',
                'dashboard': 'لوحة التحكم',
                'bikes': 'الدراجات',
                'settings': 'الإعدادات',
                'users': 'المستخدمون',
                'bookings': 'الحجوزات',
                'analytics': 'التحليلات'
            }
        };
        this.currentLang = localStorage.getItem('bikerent_language') || 'en';
        this.init();
    }

    init() {
        this.checkSession();
        this.setupSessionTimer();
        this.setupActivityListeners();
        this.setupLogout();
        this.applyLanguage();
        this.loadProfilePicture();
    }

    checkSession() {
        const sessionData = localStorage.getItem('bikerent_session');
        
        if (!sessionData) {
            this.redirectToLogin();
            return;
        }

        try {
            const session = JSON.parse(sessionData);
            
            if (!session.loggedIn || session.expires < Date.now()) {
                this.clearSession();
                this.redirectToLogin();
                return;
            }

            // Update language from session
            if (session.language) {
                this.currentLang = session.language;
                localStorage.setItem('bikerent_language', session.language);
            }

        } catch (e) {
            this.clearSession();
            this.redirectToLogin();
        }
    }

    setupSessionTimer() {
        // Check session every minute
        setInterval(() => {
            const sessionData = localStorage.getItem('bikerent_session');
            if (sessionData) {
                try {
                    const session = JSON.parse(sessionData);
                    const timeRemaining = session.expires - Date.now();
                    
                    if (timeRemaining <= 0) {
                        this.showSessionExpired();
                    } else if (timeRemaining <= this.warningTime && !session.warningShown) {
                        this.showSessionWarning();
                        session.warningShown = true;
                        localStorage.setItem('bikerent_session', JSON.stringify(session));
                    }
                } catch (e) {
                    this.clearSession();
                    this.redirectToLogin();
                }
            }
        }, 60000); // Check every minute
    }

    setupActivityListeners() {
        // Extend session on user activity
        const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        activities.forEach(event => {
            document.addEventListener(event, () => this.extendSession(), true);
        });
    }

    extendSession() {
        const sessionData = localStorage.getItem('bikerent_session');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                if (session.loggedIn) {
                    session.expires = Date.now() + this.sessionDuration;
                    session.warningShown = false;
                    localStorage.setItem('bikerent_session', JSON.stringify(session));
                }
            } catch (e) {
                // Ignore errors
            }
        }
    }

    setupLogout() {
        // Add logout button to user profile
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.style.cursor = 'pointer';
            userProfile.addEventListener('click', () => this.showLogoutMenu());
        }

        // Create logout dropdown
        this.createLogoutDropdown();
    }

    createLogoutDropdown() {
        const dropdown = document.createElement('div');
        dropdown.id = 'logout-dropdown';
        dropdown.className = 'logout-dropdown glass';
        dropdown.innerHTML = `
            <button onclick="sessionManager.logout()" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span data-translate="logout">Logout</span>
            </button>
        `;
        dropdown.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            display: none;
            z-index: 1000;
            min-width: 150px;
        `;
        document.body.appendChild(dropdown);

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const userProfile = document.querySelector('.user-profile');
            if (!userProfile.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    showLogoutMenu() {
        const dropdown = document.getElementById('logout-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }

    logout() {
        this.clearSession();
        this.redirectToLogin();
    }

    clearSession() {
        localStorage.removeItem('bikerent_session');
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    showSessionExpired() {
        this.clearSession();
        this.showModal(
            this.translations[this.currentLang]['session-expired'],
            this.translations[this.currentLang]['session-expired-msg'],
            () => this.redirectToLogin()
        );
    }

    showSessionWarning() {
        this.showModal(
            this.translations[this.currentLang]['session-expiring'],
            this.translations[this.currentLang]['session-expiring-msg'],
            () => {
                this.extendSession();
                this.hideModal();
            },
            () => {
                this.logout();
            },
            this.translations[this.currentLang]['extend-session'],
            this.translations[this.currentLang]['logout']
        );
    }

    showModal(title, message, onConfirm, onCancel = null, confirmText = 'OK', cancelText = 'Cancel') {
        // Remove existing modal
        const existingModal = document.getElementById('session-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'session-modal';
        modal.className = 'session-modal glass';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-actions">
                    ${onCancel ? `<button class="btn btn-secondary" onclick="sessionManager.hideModal()">${cancelText}</button>` : ''}
                    <button class="btn btn-primary" onclick="sessionManager.modalConfirm()">${confirmText}</button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.5);
        `;

        document.body.appendChild(modal);
        this.modalConfirm = onConfirm;
        this.modalCancel = onCancel;
    }

    hideModal() {
        const modal = document.getElementById('session-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Load profile picture
    loadProfilePicture() {
        const adminProfile = localStorage.getItem('bikerent_admin_profile');
        if (adminProfile) {
            try {
                const profile = JSON.parse(adminProfile);
                if (profile.picture) {
                    // Update all profile images
                    const userProfileImgs = document.querySelectorAll('.user-profile img');
                    userProfileImgs.forEach(img => {
                        img.src = profile.picture;
                    });
                }
            } catch (e) {
                // Ignore errors
            }
        }
    }

    applyLanguage() {
        // Update navigation
        const navLinks = {
            'main_admin.html': 'dashboard',
            'bikes.html': 'bikes',
            'settings.html': 'settings',
            'users.html': 'users',
            'bookings.html': 'bookings',
            'analytics.html': 'analytics'
        };

        Object.keys(navLinks).forEach(page => {
            const link = document.querySelector(`a[href="${page}"]`);
            if (link) {
                const key = navLinks[page];
                const span = link.querySelector('span') || link;
                const text = span.textContent.trim();
                if (this.translations[this.currentLang][key] && !text.includes(this.translations[this.currentLang][key])) {
                    if (link.querySelector('span')) {
                        link.querySelector('span').textContent = this.translations[this.currentLang][key];
                    } else {
                        link.innerHTML = `<i class="${link.querySelector('i').className}"></i> <span>${this.translations[this.currentLang][key]}</span>`;
                    }
                }
            }
        });

        // Update page title
        const title = document.querySelector('title');
        if (title) {
            const currentPage = window.location.pathname.split('/').pop();
            const pageMap = {
                'main_admin.html': 'dashboard',
                'bikes.html': 'bikes',
                'settings.html': 'settings'
            };
            
            if (pageMap[currentPage]) {
                title.textContent = `${this.translations[this.currentLang][pageMap[currentPage]]} - BikeRent Pro Admin`;
            }
        }

        // Update HTML attributes
        if (this.currentLang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', this.currentLang);
        }
    }
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .session-modal .modal-content {
        background: rgba(30, 41, 59, 0.9);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 2rem;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }

    .session-modal h3 {
        color: var(--white);
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    .session-modal p {
        color: var(--text-light);
        margin-bottom: 2rem;
        line-height: 1.5;
    }

    .session-modal .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .logout-dropdown {
        border-radius: 12px;
        padding: 0.5rem;
        min-width: 150px;
    }

    .logout-btn {
        width: 100%;
        padding: 0.75rem 1rem;
        background: rgba(239, 68, 68, 0.1);
        color: #fecaca;
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .logout-btn:hover {
        background: rgba(239, 68, 68, 0.2);
    }

    [dir="rtl"] .session-modal .modal-actions {
        flex-direction: row-reverse;
    }

    [dir="rtl"] .logout-btn {
        flex-direction: row-reverse;
    }
`;
document.head.appendChild(modalStyles);

// Initialize session manager
let sessionManager;
document.addEventListener('DOMContentLoaded', () => {
    // Don't initialize on login page
    if (!window.location.pathname.includes('login.html')) {
        sessionManager = new SessionManager();
    }
});
