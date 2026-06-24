// Firebase Fast Initialization - Load in <head> for instant data access
// This script initializes Firebase immediately and starts fetching data
(function() {
    'use strict';
    
    const firebaseConfig = {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_FIREBASE_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.firebasestorage.app",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "1:YOUR_MESSAGING_SENDER_ID:web:27d28d44e449306b726b97",
        measurementId: "YOUR_MEASUREMENT_ID"
    };

    // Initialize Firebase immediately
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Create global db reference
    window.db = firebase.firestore();
    
    // Initialize auth and storage if available
    if (typeof firebase.auth === 'function') {
        window.auth = firebase.auth();
    }
    if (typeof firebase.storage === 'function') {
        window.storage = firebase.storage();
    }

    // Global admin data store for caching
    window.AdminData = {
        bikes: null,
        users: null,
        bookings: null,
        testimonials: null,
        accessories: null,
        settings: null,
        bikesReady: false,
        usersReady: false,
        bookingsReady: false,
        testimonialsReady: false,
        accessoriesReady: false,
        settingsReady: false
    };

    // Try to load from localStorage cache instantly
    const cacheKeys = ['bikes', 'users', 'bookings', 'testimonials', 'accessories', 'settings'];
    cacheKeys.forEach(key => {
        try {
            const cached = localStorage.getItem('admin_' + key + '_cache');
            if (cached) {
                window.AdminData[key] = JSON.parse(cached);
                window.AdminData[key + 'Ready'] = true;
                console.log('⚡ Admin ' + key + ' from cache:', window.AdminData[key].length || 'loaded');
            }
        } catch(e) {}
    });

    // Pre-fetch common collections in background
    function prefetchCollection(name, query) {
        const q = query || window.db.collection(name);
        q.get().then(function(snapshot) {
            const data = [];
            snapshot.forEach(function(doc) {
                data.push({ id: doc.id, ...doc.data() });
            });
            window.AdminData[name] = data;
            window.AdminData[name + 'Ready'] = true;
            localStorage.setItem('admin_' + name + '_cache', JSON.stringify(data));
            console.log('⚡ Admin ' + name + ' fetched:', data.length);
            
            // Trigger callback if exists
            if (window['render' + name.charAt(0).toUpperCase() + name.slice(1) + 'Now']) {
                window['render' + name.charAt(0).toUpperCase() + name.slice(1) + 'Now']();
            }
        }).catch(function(e) {
            console.error('Error fetching ' + name + ':', e);
            window.AdminData[name + 'Ready'] = true;
        });
    }

    // Start prefetching immediately
    prefetchCollection('bikes');
    prefetchCollection('users');
    prefetchCollection('bookings');
    prefetchCollection('testimonials');
    prefetchCollection('accessories');
    
    // Settings is a single doc
    window.db.collection('settings').doc('general').get().then(function(doc) {
        window.AdminData.settings = doc.exists ? doc.data() : {};
        window.AdminData.settingsReady = true;
        localStorage.setItem('admin_settings_cache', JSON.stringify(window.AdminData.settings));
    }).catch(function(e) {
        window.AdminData.settingsReady = true;
    });

    console.log('🚀 Admin Firebase initialized & prefetch started!');
})();
