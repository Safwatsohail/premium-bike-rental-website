// Complete Translation System for BikeRent Pro
class TranslationManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                nav: {
                    dashboard: 'Dashboard',
                    bikes: 'Bikes',
                    users: 'Users',
                    bookings: 'Bookings',
                    analytics: 'Analytics',
                    settings: 'Settings',
                    accessories: 'Accessories',
                    logout: 'Logout'
                },
                dashboard: {
                    title: 'Dashboard Overview',
                    welcome: 'Welcome to First Season Moto',
                    totalBikes: 'Total Bikes',
                    totalUsers: 'Total Users',
                    totalBookings: 'Total Bookings',
                    totalRevenue: 'Total Revenue',
                    recentBookings: 'Recent Orders',
                    manageBikes: 'Manage Bikes',
                    customerFeedback: 'Customer Feedback'
                },
                bookings: {
                    table: {
                        bookingId: 'Order ID',
                        customer: 'Customer',
                        bike: 'Product',
                        amount: 'Amount',
                        status: 'Status',
                        actions: 'Action'
                    }
                },
                common: {
                    search: 'Search',
                    loading: 'Loading...',
                    noData: 'No data found'
                }
            },
            ar: {
                nav: {
                    dashboard: 'لوحة التحكم',
                    bikes: 'الدراجات',
                    users: 'المستخدمون',
                    bookings: 'الحجوزات',
                    analytics: 'التحليلات',
                    settings: 'الإعدادات',
                    accessories: 'الملحقات',
                    logout: 'تسجيل الخروج'
                },
                dashboard: {
                    title: 'نظرة عامة على لوحة التحكم',
                    welcome: 'مرحباً بك في موسم الأول للدراجات',
                    totalBikes: 'إجمالي الدراجات',
                    totalUsers: 'إجمالي المستخدمين',
                    totalBookings: 'إجمالي الحجوزات',
                    totalRevenue: 'إجمالي الإيرادات',
                    recentBookings: 'الطلبات الأخيرة',
                    manageBikes: 'إدارة الدراجات',
                    customerFeedback: 'آراء العملاء'
                },
                bookings: {
                    table: {
                        bookingId: 'رقم الطلب',
                        customer: 'العميل',
                        bike: 'المنتج',
                        amount: 'المبلغ',
                        status: 'الحالة',
                        actions: 'إجراء'
                    }
                },
                common: {
                    search: 'بحث',
                    loading: 'جاري التحميل...',
                    noData: 'لم يتم العثور على بيانات'
                }
            }
        };
    }

    // Get nested translation value
    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }
        
        return value;
    }

    // Apply translations to the page
    applyTranslations() {
        // Translate elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            element.textContent = translation;
        });

        // Translate placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.getTranslation(key);
            element.placeholder = translation;
        });

        // Update page title
        const pageTitleElement = document.querySelector('[data-page-title]');
        if (pageTitleElement) {
            const titleKey = pageTitleElement.getAttribute('data-page-title');
            document.title = this.getTranslation(titleKey) + ' - BikeRent Pro';
        }
    }

    // Switch language
    switchLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            
            // Update HTML attributes
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            
            // Toggle RTL class
            if (lang === 'ar') {
                document.body.classList.add('rtl');
                document.documentElement.classList.add('rtl');
            } else {
                document.body.classList.remove('rtl');
                document.documentElement.classList.remove('rtl');
            }
            
            // Apply translations
            this.applyTranslations();
            
            // Update language buttons
            this.updateLanguageButtons();
            
            // Trigger custom event for other scripts
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
            
            console.log(`Language switched to: ${lang}`);
        }
    }

    // Update language button states
    updateLanguageButtons() {
        document.querySelectorAll('.language-switcher button').forEach(btn => {
            const btnLang = btn.getAttribute('onclick')?.match(/switchLanguage\('(\w+)'\)/)?.[1];
            if (btnLang === this.currentLang) {
                btn.classList.add('active');
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.remove('active');
                btn.classList.add('btn-outline');
                btn.classList.remove('btn-primary');
            }
        });
    }

    // Initialize translations
    init() {
        // Set initial language
        const savedLang = localStorage.getItem('language') || 'en';
        this.switchLanguage(savedLang);
    }
}

// Create global instance
const translationManager = new TranslationManager();

// Global function for onclick handlers
function switchLanguage(lang) {
    translationManager.switchLanguage(lang);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    translationManager.init();
});
