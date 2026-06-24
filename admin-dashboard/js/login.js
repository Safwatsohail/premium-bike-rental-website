// Login Page JavaScript
class LoginManager {
    constructor() {
        this.correctPassword = localStorage.getItem('bikerent_admin_password') || 'alphaacademy';
        this.sessionDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
        this.translations = {
            en: {
                'login-title': 'Admin Login',
                'login-subtitle': 'Enter your password to access the dashboard',
                'password-label': 'Password',
                'login-button': 'Login',
                'invalid-password': 'Invalid password. Please try again.',
                'default-password-info': 'Default password: '
            },
            ar: {
                'login-title': 'تسجيل دخول المشرف',
                'login-subtitle': 'أدخل كلمة المرور للوصول إلى لوحة التحكم',
                'password-label': 'كلمة المرور',
                'login-button': 'دخول',
                'invalid-password': 'كلمة مرور غير صحيحة. حاول مرة أخرى.',
                'default-password-info': 'كلمة المرور الافتراضية: '
            }
        };
        this.currentLang = localStorage.getItem('bikerent_language') || 'en';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyLanguage();
        this.checkExistingSession();
    }

    setupEventListeners() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Password input event listeners
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            // Ensure input is fully enabled and accessible
            passwordInput.disabled = false;
            passwordInput.readOnly = false;
            passwordInput.style.pointerEvents = 'auto';
            passwordInput.style.userSelect = 'text';
            passwordInput.style.position = 'relative';
            passwordInput.style.zIndex = '10';

            // Prevent any parent elements from blocking interaction
            const passwordContainer = passwordInput.closest('.password-input');
            if (passwordContainer) {
                passwordContainer.style.pointerEvents = 'auto';
                passwordContainer.style.position = 'relative';
                passwordContainer.style.zIndex = '10';
            }

            const formGroup = passwordInput.closest('.form-group');
            if (formGroup) {
                formGroup.style.pointerEvents = 'auto';
                formGroup.style.position = 'relative';
                formGroup.style.zIndex = '10';
            }

            // Add click event to ensure focus
            passwordInput.addEventListener('click', (e) => {
                e.stopPropagation();
                passwordInput.focus();
            });

            // Add input event listener to detect typing
            passwordInput.addEventListener('input', (e) => {
                console.log('Password input:', e.target.value); // Debug log
            });

            // Add focus event
            passwordInput.addEventListener('focus', () => {
                console.log('Password input focused'); // Debug log
            });

            // Enter key submission
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    console.log('Enter key pressed, submitting login...'); // Debug log
                    e.preventDefault(); // Prevent any default form behavior
                    this.handleLogin();
                }
            });

            // Also add keydown for better detection
            passwordInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    console.log('Enter key down detected'); // Debug log
                }
            });

            // Ensure input is visible and clickable
            setTimeout(() => {
                passwordInput.focus();
            }, 100);
        }

        // Global Enter key listener as backup
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.id === 'password') {
                    console.log('Global Enter key detected on password field'); // Debug log
                    e.preventDefault();
                    this.handleLogin();
                }
            }
        });

        // Prevent background elements from stealing focus
        const backgroundElements = document.querySelector('.background-elements');
        if (backgroundElements) {
            backgroundElements.style.pointerEvents = 'none';
        }
    }

    handleLogin() {
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        if (password === this.correctPassword) {
            // Hide error message
            errorMessage.classList.remove('show');

            // Create session (always 30 minutes)
            const sessionData = {
                loggedIn: true,
                loginTime: Date.now(),
                expires: Date.now() + this.sessionDuration,
                language: this.currentLang
            };

            localStorage.setItem('bikerent_session', JSON.stringify(sessionData));
            localStorage.setItem('bikerent_language', this.currentLang);

            // Show success animation
            this.showSuccessAnimation(() => {
                console.log('Redirecting to dashboard...'); // Debug log
                // Force redirect to dashboard
                window.location.replace('main_admin.html');
            });

            // Fallback redirect in case callback fails
            setTimeout(() => {
                console.log('Fallback redirect...');
                window.location.replace('main_admin.html');
            }, 2000);
        } else {
            // Show error message
            errorMessage.classList.add('show');

            // Shake animation on input
            const passwordContainer = document.querySelector('.password-input');
            passwordContainer.classList.add('error-shake');
            setTimeout(() => {
                passwordContainer.classList.remove('error-shake');
            }, 500);

            // Clear password field
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    }

    showSuccessAnimation(callback) {
        const loginBtn = document.querySelector('.login-btn');
        const originalContent = loginBtn.innerHTML;

        // Show success state
        loginBtn.innerHTML = '<i class="fas fa-check-circle"></i> Success!';
        loginBtn.style.background = 'var(--success)';
        loginBtn.style.transform = 'scale(1.05)';

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Login successful! Redirecting to dashboard...';
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 500;
            z-index: 10000;
            animation: slideDown 0.5s ease-out;
        `;
        document.body.appendChild(successMsg);

        setTimeout(() => {
            callback();
        }, 1500);
    }

    checkExistingSession() {
        const sessionData = localStorage.getItem('bikerent_session');

        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);

                if (session.loggedIn && session.expires > Date.now()) {
                    // Valid session exists
                    window.location.href = 'main_admin.html';
                } else {
                    // Session expired
                    localStorage.removeItem('bikerent_session');
                }
            } catch (e) {
                // Invalid session data
                localStorage.removeItem('bikerent_session');
            }
        }
    }

    changeLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('bikerent_language', lang);
        this.applyLanguage();

        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Update HTML attributes
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', lang);
        }
    }

    applyLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update placeholders
        const passwordInput = document.getElementById('password');
        if (this.currentLang === 'ar') {
            passwordInput.placeholder = 'أدخل كلمة المرور';
        } else {
            passwordInput.placeholder = 'Enter your password';
        }

        // Update HTML attributes
        if (this.currentLang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', this.currentLang);
        }

        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes('English') && this.currentLang === 'en') {
                btn.classList.add('active');
            } else if (btn.textContent.includes('العربية') && this.currentLang === 'ar') {
                btn.classList.add('active');
            }
        });
    }
}

// Password visibility toggle
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Language change function
function changeLanguage(lang) {
    loginManager.changeLanguage(lang);
}

// Add slideDown animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
`;
document.head.appendChild(style);

// Initialize login manager
let loginManager;
document.addEventListener('DOMContentLoaded', () => {
    loginManager = new LoginManager();
});
