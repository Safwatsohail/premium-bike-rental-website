// Firebase Data Preloader - Loads all data immediately for instant display
(function() {
    'use strict';

    // Cache keys
    const CACHE_KEYS = {
        bikes: 'fsm_bikes_cache',
        testimonials: 'fsm_testimonials_cache',
        accessories: 'fsm_accessories_cache',
        timestamp: 'fsm_cache_timestamp'
    };

    // Cache duration: 30 minutes (longer cache for faster loads)
    const CACHE_DURATION = 30 * 60 * 1000;

    // Global data store
    window.FSMData = {
        bikes: null,
        testimonials: null,
        accessories: null,
        bikesLoaded: false,
        testimonialsLoaded: false,
        accessoriesLoaded: false,
        callbacks: {
            bikes: [],
            testimonials: [],
            accessories: []
        }
    };

    function isCacheValid() {
        const timestamp = localStorage.getItem(CACHE_KEYS.timestamp);
        if (!timestamp) return false;
        return (Date.now() - parseInt(timestamp)) < CACHE_DURATION;
    }

    function loadFromCache() {
        try {
            if (isCacheValid()) {
                const bikesCache = localStorage.getItem(CACHE_KEYS.bikes);
                const testimonialsCache = localStorage.getItem(CACHE_KEYS.testimonials);
                const accessoriesCache = localStorage.getItem(CACHE_KEYS.accessories);

                if (bikesCache) {
                    window.FSMData.bikes = JSON.parse(bikesCache);
                    window.FSMData.bikesLoaded = true;
                    triggerCallbacks('bikes', window.FSMData.bikes);
                    console.log('⚡ Cache: Bikes loaded instantly');
                }
                if (testimonialsCache) {
                    window.FSMData.testimonials = JSON.parse(testimonialsCache);
                    window.FSMData.testimonialsLoaded = true;
                    triggerCallbacks('testimonials', window.FSMData.testimonials);
                    console.log('⚡ Cache: Testimonials loaded instantly');
                }
                if (accessoriesCache) {
                    window.FSMData.accessories = JSON.parse(accessoriesCache);
                    window.FSMData.accessoriesLoaded = true;
                    triggerCallbacks('accessories', window.FSMData.accessories);
                    console.log('⚡ Cache: Accessories loaded instantly');
                }
                return true;
            }
        } catch (e) {
            console.warn('Cache error:', e);
        }
        return false;
    }

    function saveToCache(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            localStorage.setItem(CACHE_KEYS.timestamp, Date.now().toString());
        } catch (e) {}
    }

    function triggerCallbacks(type, data) {
        window.FSMData.callbacks[type].forEach(cb => cb(data));
        window.FSMData.callbacks[type] = [];
    }

    function waitForFirebase(callback, maxRetries = 100) {
        let retries = 0;
        const check = () => {
            if (window.db) {
                callback(window.db);
            } else if (retries < maxRetries) {
                retries++;
                // Check faster at the start (every 20ms for first 500ms, then every 50ms)
                const delay = retries < 25 ? 20 : 50;
                setTimeout(check, delay);
            } else {
                console.error('❌ Firebase not available after timeout');
                // Mark as loaded with empty arrays to prevent infinite waiting
                if (!window.FSMData.bikesLoaded) {
                    window.FSMData.bikes = [];
                    window.FSMData.bikesLoaded = true;
                    triggerCallbacks('bikes', []);
                }
                if (!window.FSMData.testimonialsLoaded) {
                    window.FSMData.testimonials = [];
                    window.FSMData.testimonialsLoaded = true;
                    triggerCallbacks('testimonials', []);
                }
                if (!window.FSMData.accessoriesLoaded) {
                    window.FSMData.accessories = [];
                    window.FSMData.accessoriesLoaded = true;
                    triggerCallbacks('accessories', []);
                }
            }
        };
        // Start checking immediately
        check();
    }

    function fetchBikes(db) {
        db.collection('bikes').get()
            .then(snapshot => {
                const bikes = [];
                snapshot.forEach(doc => bikes.push({ id: doc.id, ...doc.data() }));
                
                window.FSMData.bikes = bikes;
                window.FSMData.bikesLoaded = true;
                saveToCache(CACHE_KEYS.bikes, bikes);
                triggerCallbacks('bikes', bikes);
                console.log('✅ Bikes fetched:', bikes.length);
                
                // Notify LoadingController if available
                if (window.LoadingController && typeof window.LoadingController.resourceLoaded === 'function') {
                    window.LoadingController.resourceLoaded('firebaseData', 'Firebase bikes');
                }
            })
            .catch(err => {
                console.error('❌ Bikes fetch error:', err);
                window.FSMData.bikes = [];
                window.FSMData.bikesLoaded = true;
                triggerCallbacks('bikes', []);
            });
    }

    // Default testimonials to seed if none exist
    const defaultTestimonials = [
        { customerName: "Ahmed K.", customerTitle: "Regular Customer", rating: 5, text: "Absolutely phenomenal service! The Yamaha R1 was pristine and the team made everything seamless. Best rental experience in Dubai!", avatar: "https://randomuser.me/api/portraits/men/32.jpg", displayOrder: 1, isActive: true },
        { customerName: "Sara M.", customerTitle: "Adventure Seeker", rating: 5, text: "Incredible fleet of bikes! Rented the Kawasaki H2 for a weekend trip and it was pure adrenaline. Professional staff and fair pricing.", avatar: "https://randomuser.me/api/portraits/women/44.jpg", displayOrder: 2, isActive: true },
        { customerName: "Khalid A.", customerTitle: "Speed Enthusiast", rating: 5, text: "Five stars all the way! The booking process was smooth, bikes were spotless, and customer service was exceptional.", avatar: "https://randomuser.me/api/portraits/men/67.jpg", displayOrder: 3, isActive: true },
        { customerName: "Fatima R.", customerTitle: "First-Time Rider", rating: 4, text: "Great experience overall! The bike was in perfect condition and the team was very helpful. Will definitely be back!", avatar: "https://randomuser.me/api/portraits/women/65.jpg", displayOrder: 4, isActive: true },
        { customerName: "Omar S.", customerTitle: "VIP Member", rating: 5, text: "Premium bikes, premium service! The attention to detail and customer care is unmatched. This is THE place to rent in Dubai.", avatar: "https://randomuser.me/api/portraits/men/22.jpg", displayOrder: 5, isActive: true }
    ];

    // Seed testimonials if none exist
    function seedTestimonials(db) {
        console.log('📝 Seeding default testimonials...');
        const batch = db.batch();
        defaultTestimonials.forEach(t => {
            const ref = db.collection('testimonials').doc();
            batch.set(ref, { ...t, createdAt: new Date(), updatedAt: new Date() });
        });
        return batch.commit().then(() => {
            console.log('✅ Default testimonials seeded');
        });
    }

    // Fetch testimonials
    function fetchTestimonials(db) {
        db.collection('testimonials').get()
            .then(snapshot => {
                // If empty, seed defaults first
                if (snapshot.empty) {
                    return seedTestimonials(db).then(() => {
                        // Re-fetch after seeding
                        return db.collection('testimonials').get();
                    });
                }
                return snapshot;
            })
            .then(snapshot => {
                let testimonials = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.isActive !== false) {
                        testimonials.push({ id: doc.id, ...data });
                    }
                });
                
                testimonials.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
                
                window.FSMData.testimonials = testimonials;
                window.FSMData.testimonialsLoaded = true;
                saveToCache(CACHE_KEYS.testimonials, testimonials);
                triggerCallbacks('testimonials', testimonials);
                console.log('✅ Testimonials fetched:', testimonials.length);
            })
            .catch(err => {
                console.error('❌ Testimonials fetch error:', err);
                window.FSMData.testimonials = [];
                window.FSMData.testimonialsLoaded = true;
                triggerCallbacks('testimonials', []);
            });
    }

    function fetchAccessories(db) {
        db.collection('accessories').get()
            .then(snapshot => {
                const accessories = [];
                snapshot.forEach(doc => accessories.push({ id: doc.id, ...doc.data() }));
                
                window.FSMData.accessories = accessories;
                window.FSMData.accessoriesLoaded = true;
                saveToCache(CACHE_KEYS.accessories, accessories);
                triggerCallbacks('accessories', accessories);
                console.log('✅ Accessories fetched:', accessories.length);
            })
            .catch(err => {
                console.error('❌ Accessories fetch error:', err);
                window.FSMData.accessories = [];
                window.FSMData.accessoriesLoaded = true;
                triggerCallbacks('accessories', []);
            });
    }

    // Public API
    window.FSMData.getBikes = function(callback) {
        if (window.FSMData.bikesLoaded) {
            callback(window.FSMData.bikes || []);
        } else {
            window.FSMData.callbacks.bikes.push(callback);
        }
    };

    window.FSMData.getTestimonials = function(callback) {
        if (window.FSMData.testimonialsLoaded) {
            callback(window.FSMData.testimonials || []);
        } else {
            window.FSMData.callbacks.testimonials.push(callback);
        }
    };

    window.FSMData.getAccessories = function(callback) {
        if (window.FSMData.accessoriesLoaded) {
            callback(window.FSMData.accessories || []);
        } else {
            window.FSMData.callbacks.accessories.push(callback);
        }
    };

    window.FSMData.refresh = function() {
        localStorage.removeItem(CACHE_KEYS.timestamp);
        localStorage.removeItem(CACHE_KEYS.bikes);
        localStorage.removeItem(CACHE_KEYS.testimonials);
        localStorage.removeItem(CACHE_KEYS.accessories);
        window.FSMData.bikesLoaded = false;
        window.FSMData.testimonialsLoaded = false;
        window.FSMData.accessoriesLoaded = false;
        waitForFirebase(db => {
            fetchBikes(db);
            fetchTestimonials(db);
            fetchAccessories(db);
        });
    };

    // Clear cache function (can be called from console: FSMData.clearCache())
    window.FSMData.clearCache = function() {
        localStorage.removeItem(CACHE_KEYS.bikes);
        localStorage.removeItem(CACHE_KEYS.testimonials);
        localStorage.removeItem(CACHE_KEYS.accessories);
        localStorage.removeItem(CACHE_KEYS.timestamp);
        console.log('🗑️ Cache cleared! Refresh the page to load fresh data.');
    };

    // Initialize
    const hadCache = loadFromCache();
    
    // Always fetch fresh data from Firebase (will update cache)
    waitForFirebase(db => {
        // Always fetch fresh data to keep cache updated
        fetchBikes(db);
        fetchTestimonials(db);
        fetchAccessories(db);
    });

    console.log('🚀 Preloader initialized');
})();
