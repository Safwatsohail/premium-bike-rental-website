// Settings Page JavaScript
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.originalSettings = { ...this.settings };
        this.correctPassword = 'alphaacademy';
        this.translations = {
            en: {
                'profile-picture': 'Profile Picture',
                'profile-picture-desc': 'Upload your profile image',
                'upload': 'Upload',
                'admin-profile-desc': 'Manage your admin account settings',
                'admin-name': 'Admin Name',
                'admin-name-desc': 'Your display name in the system',
                'admin-email': 'Admin Email',
                'admin-email-desc': 'Your login email address',
                'current-password': 'Current Password',
                'current-password-desc': 'Enter your current password',
                'new-password': 'New Password',
                'new-password-desc': 'Choose a new password',
                'confirm-password': 'Confirm Password',
                'confirm-password-desc': 'Confirm your new password',
                'change-password': 'Change Password',
                'change-password-desc': 'Update your account password',
                'update-password': 'Update Password',
                'password-changed': 'Password changed successfully!',
                'password-mismatch': 'New passwords do not match!',
                'invalid-current-password': 'Current password is incorrect!',
                'general-settings': 'General Settings',
                'general-settings-desc': 'Basic application configuration',
                'appearance': 'Appearance',
                'appearance-desc': 'Customize the look and feel',
                'notifications': 'Notifications',
                'notifications-desc': 'Manage your notification preferences',
                'privacy-security': 'Privacy & Security',
                'privacy-security-desc': 'Manage your privacy and security settings',
                'business': 'Business Settings',
                'business-desc': 'Configure your business preferences',
                'api-integrations': 'API & Integrations',
                'api-integrations-desc': 'Connect with third-party services',
                'data-backup': 'Data & Backup',
                'data-backup-desc': 'Manage your data and backups'
            },
            ar: {
                'profile-picture': 'الصورة الشخصية',
                'profile-picture-desc': 'ارفع صورتك الشخصية',
                'upload': 'رفع',
                'admin-profile': 'ملف المشرف',
                'admin-profile-desc': 'إدارة إعدادات حساب المشرف',
                'admin-name': 'اسم المشرف',
                'admin-name-desc': 'اسمك المعروض في النظام',
                'admin-email': 'بريد المشرف',
                'admin-email-desc': 'عنوان بريدك الإلكتروني لتسجيل الدخول',
                'current-password': 'كلمة المرور الحالية',
                'current-password-desc': 'أدخل كلمة المرور الحالية',
                'new-password': 'كلمة المرور الجديدة',
                'new-password-desc': 'اختر كلمة مرور جديدة',
                'confirm-password': 'تأكيد كلمة المرور',
                'confirm-password-desc': 'أكد كلمة المرور الجديدة',
                'change-password': 'تغيير كلمة المرور',
                'change-password-desc': 'تحديث كلمة مرور حسابك',
                'update-password': 'تحديث كلمة المرور',
                'password-changed': 'تم تغيير كلمة المرور بنجاح!',
                'password-mismatch': 'كلمات المرور الجديدة لا تتطابق!',
                'invalid-current-password': 'كلمة المرور الحالية غير صحيحة!',
                'general-settings': 'الإعدادات العامة',
                'general-settings-desc': 'التكوين الأساسي للتطبيق',
                'appearance': 'المظهر',
                'appearance-desc': 'تخصيص المظهر والشعور',
                'notifications': 'الإشعارات',
                'notifications-desc': 'إدارة تفضيلات الإشعارات',
                'privacy-security': 'الخصوصية والأمان',
                'privacy-security-desc': 'إدارة إعدادات الخصوصية والأمان',
                'business': 'إعدادات العمل',
                'business-desc': 'تكوين تفضيلات عملك',
                'api-integrations': 'واجهة برمجة التطبيقات والتكاملات',
                'api-integrations-desc': 'التواصل مع خدمات الطرف الثالث',
                'data-backup': 'البيانات والنسخ الاحتياطي',
                'data-backup-desc': 'إدارة بياناتك والنسخ الاحتياطية'
            }
        };
        this.currentLang = localStorage.getItem('bikerent_language') || 'en';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applySettings();
        this.setupSearch();
        this.setupTooltips();
        this.loadAdminProfile();
        this.setupProfilePicture();
        this.applyLanguage();
    }

    // Load settings from localStorage
    loadSettings() {
        const defaultSettings = {
            // General Settings
            language: 'en',
            timezone: 'UTC',
            currency: 'AED',
            
            // Appearance
            theme: 'dark',
            compactMode: false,
            animations: true,
            
            // Notifications
            emailNotifications: true,
            pushNotifications: false,
            bookingAlerts: true,
            maintenanceAlerts: true,
            
            // Security
            twoFactor: false,
            sessionTimeout: '30',
            loginAlerts: true,
            
            // Business
            businessName: 'BikeRent Pro',
            businessEmail: '',
            businessPhone: '',
            autoApprove: false,
            depositRequired: true,
            
            // Integrations
            googleMaps: true,
            stripePayment: true,
            emailService: 'sendgrid',
            
            // Data & Backup
            autoBackup: true,
            backupFrequency: 'weekly'
        };

        const saved = localStorage.getItem('bikerent_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    // Load admin profile
    loadAdminProfile() {
        const adminProfile = localStorage.getItem('bikerent_admin_profile');
        if (adminProfile) {
            try {
                const profile = JSON.parse(adminProfile);
                document.getElementById('admin-name').value = profile.name || '';
                document.getElementById('admin-email').value = profile.email || '';
                
                // Load profile picture
                if (profile.picture) {
                    document.getElementById('profileImage').src = profile.picture;
                }
            } catch (e) {
                // Ignore errors
            }
        }
    }

    // Setup profile picture upload
    setupProfilePicture() {
        const profilePictureInput = document.getElementById('profilePicture');
        const profilePreview = document.getElementById('profilePreview');
        
        if (profilePictureInput && profilePreview) {
            profilePictureInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const imageUrl = e.target.result;
                        document.getElementById('profileImage').src = imageUrl;
                        this.saveProfilePicture(imageUrl);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Click on preview to open file selector
            profilePreview.addEventListener('click', () => {
                profilePictureInput.click();
            });
        }
    }

    // Save profile picture
    saveProfilePicture(imageUrl) {
        const adminProfile = localStorage.getItem('bikerent_admin_profile');
        let profile = {};
        
        if (adminProfile) {
            try {
                profile = JSON.parse(adminProfile);
            } catch (e) {
                // Use empty profile
            }
        }
        
        profile.picture = imageUrl;
        localStorage.setItem('bikerent_admin_profile', JSON.stringify(profile));
        
        // Update profile pictures across the site
        this.updateProfilePictures(imageUrl);
    }

    // Update profile pictures across the site
    updateProfilePictures(imageUrl) {
        // Update in settings page
        const settingsProfileImg = document.getElementById('profileImage');
        if (settingsProfileImg) {
            settingsProfileImg.src = imageUrl;
        }
        
        // Update in top bar user profile
        const userProfileImgs = document.querySelectorAll('.user-profile img');
        userProfileImgs.forEach(img => {
            img.src = imageUrl;
        });
    }

    // Save admin profile
    saveAdminProfile() {
        const profile = {
            name: document.getElementById('admin-name').value,
            email: document.getElementById('admin-email').value
        };
        localStorage.setItem('bikerent_admin_profile', JSON.stringify(profile));
    }

    // Change password
    changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate current password
        if (currentPassword !== this.correctPassword) {
            this.showToast(this.translations[this.currentLang]['invalid-current-password'], 'error');
            return;
        }

        // Validate new passwords match
        if (newPassword !== confirmPassword) {
            this.showToast(this.translations[this.currentLang]['password-mismatch'], 'error');
            return;
        }

        // Update password
        this.correctPassword = newPassword;
        localStorage.setItem('bikerent_admin_password', newPassword);
        
        // Clear password fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        this.showToast(this.translations[this.currentLang]['password-changed'], 'success');
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

        // Update HTML attributes
        if (this.currentLang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', this.currentLang);
        }
    }

    // Save settings to localStorage
    saveSettings() {
        // Save admin profile
        this.saveAdminProfile();
        
        // Save settings
        localStorage.setItem('bikerent_settings', JSON.stringify(this.settings));
        this.originalSettings = { ...this.settings };
        this.updateSaveButton();
        this.showToast('Settings saved successfully!');
    }

    // Apply settings to the UI
    applySettings() {
        // Apply language
        if (this.settings.language === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', this.settings.language);
        }

        // Update current language
        this.currentLang = this.settings.language;

        // Apply theme
        if (this.settings.theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }

        // Apply compact mode
        if (this.settings.compactMode) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }

        // Apply animations
        if (!this.settings.animations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }

        // Update form controls
        this.updateFormControls();
        
        // Apply language to all elements
        this.applyLanguage();
    }

    // Update form controls with current settings
    updateFormControls() {
        // Selects
        document.getElementById('language').value = this.settings.language;
        document.getElementById('timezone').value = this.settings.timezone;
        document.getElementById('currency').value = this.settings.currency;
        document.getElementById('theme').value = this.settings.theme;
        document.getElementById('session-timeout').value = this.settings.sessionTimeout;
        document.getElementById('email-service').value = this.settings.emailService;
        document.getElementById('backup-frequency').value = this.settings.backupFrequency;

        // Checkboxes
        document.getElementById('compact-mode').checked = this.settings.compactMode;
        document.getElementById('animations').checked = this.settings.animations;
        document.getElementById('email-notifications').checked = this.settings.emailNotifications;
        document.getElementById('push-notifications').checked = this.settings.pushNotifications;
        document.getElementById('booking-alerts').checked = this.settings.bookingAlerts;
        document.getElementById('maintenance-alerts').checked = this.settings.maintenanceAlerts;
        document.getElementById('two-factor').checked = this.settings.twoFactor;
        document.getElementById('login-alerts').checked = this.settings.loginAlerts;
        document.getElementById('auto-approve').checked = this.settings.autoApprove;
        document.getElementById('deposit-required').checked = this.settings.depositRequired;
        document.getElementById('google-maps').checked = this.settings.googleMaps;
        document.getElementById('stripe-payment').checked = this.settings.stripePayment;
        document.getElementById('auto-backup').checked = this.settings.autoBackup;

        // Text inputs
        document.getElementById('business-name').value = this.settings.businessName;
        document.getElementById('business-email').value = this.settings.businessEmail;
        document.getElementById('business-phone').value = this.settings.businessPhone;
    }

    // Setup event listeners
    setupEventListeners() {
        // Language change
        document.getElementById('language').addEventListener('change', (e) => {
            this.settings.language = e.target.value;
            this.applySettings();
            this.updateSaveButton();
        });

        // Theme change
        document.getElementById('theme').addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.applySettings();
            this.updateSaveButton();
        });

        // Compact mode
        document.getElementById('compact-mode').addEventListener('change', (e) => {
            this.settings.compactMode = e.target.checked;
            this.applySettings();
            this.updateSaveButton();
        });

        // Animations
        document.getElementById('animations').addEventListener('change', (e) => {
            this.settings.animations = e.target.checked;
            this.applySettings();
            this.updateSaveButton();
        });

        // Setup all other inputs
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.addEventListener('change', (e) => {
                    const settingName = this.camelCase(input.id);
                    this.settings[settingName] = e.target.checked;
                    this.updateSaveButton();
                });
            } else if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
                input.addEventListener('input', (e) => {
                    const settingName = this.camelCase(input.id);
                    this.settings[settingName] = e.target.value;
                    this.updateSaveButton();
                });
            } else {
                input.addEventListener('change', (e) => {
                    const settingName = this.camelCase(input.id);
                    this.settings[settingName] = e.target.value;
                    this.updateSaveButton();
                });
            }
        });
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const sections = document.querySelectorAll('.settings-section');
            
            sections.forEach(section => {
                const title = section.querySelector('h2').textContent.toLowerCase();
                const labels = section.querySelectorAll('label');
                const descriptions = section.querySelectorAll('.setting-info p');
                
                let hasMatch = title.includes(searchTerm);
                
                labels.forEach(label => {
                    if (label.textContent.toLowerCase().includes(searchTerm)) {
                        hasMatch = true;
                    }
                });
                
                descriptions.forEach(desc => {
                    if (desc.textContent.toLowerCase().includes(searchTerm)) {
                        hasMatch = true;
                    }
                });
                
                section.style.display = hasMatch ? 'block' : 'none';
            });
        });
    }

    // Setup tooltips
    setupTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            });
            
            element.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) tooltip.remove();
            });
        });
    }

    // Update save button state
    updateSaveButton() {
        const saveBtn = document.querySelector('.btn-primary');
        const hasChanges = JSON.stringify(this.settings) !== JSON.stringify(this.originalSettings);
        
        if (hasChanges) {
            saveBtn.classList.add('btn-success');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        } else {
            saveBtn.classList.remove('btn-success');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        }
    }

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'settings-toast show';
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        if (type === 'error') {
            toast.style.background = 'rgba(239, 68, 68, 0.9)';
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Convert kebab-case to camelCase
    camelCase(str) {
        return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }

    // Export data
    exportData() {
        const data = {
            settings: this.settings,
            bikes: JSON.parse(localStorage.getItem('bikerent_bikes') || '[]'),
            bookings: JSON.parse(localStorage.getItem('bikerent_bookings') || '[]'),
            users: JSON.parse(localStorage.getItem('bikerent_users') || '[]')
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bikerent-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Data exported successfully!');
    }

    // Reset to defaults
    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
            this.settings = this.loadSettings();
            localStorage.removeItem('bikerent_settings');
            this.applySettings();
            this.updateSaveButton();
            this.showToast('Settings reset to defaults!');
        }
    }
}

// Global functions for button clicks
function saveAllSettings() {
    settingsManager.saveSettings();
}

function resetToDefaults() {
    settingsManager.resetToDefaults();
}

function exportData() {
    settingsManager.exportData();
}

function changePassword() {
    settingsManager.changePassword();
}

// Initialize settings manager when DOM is loaded
let settingsManager;
document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
    
    // Load custom password if set
    const customPassword = localStorage.getItem('bikerent_admin_password');
    if (customPassword) {
        settingsManager.correctPassword = customPassword;
    }
});

// Handle unsaved changes warning
window.addEventListener('beforeunload', (e) => {
    if (settingsManager && JSON.stringify(settingsManager.settings) !== JSON.stringify(settingsManager.originalSettings)) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAllSettings();
    }
    
    // Ctrl/Cmd + R to reset (with confirmation)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetToDefaults();
    }
    
    // Ctrl/Cmd + E to export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});
