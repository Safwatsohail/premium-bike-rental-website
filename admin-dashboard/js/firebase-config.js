// Firebase configuration for BikeRent Pro Admin Dashboard
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:YOUR_MESSAGING_SENDER_ID:web:27d28d44e449306b726b97",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Declare variables globally
let db, auth, storage, analytics;

// Wait for Firebase SDK to load
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded yet! Make sure Firebase scripts are loaded before firebase-config.js');
} else {
    console.log('Firebase SDK loaded, initializing...');

    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        
        // Optimize Firestore settings for mobile performance
        db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
            ignoreUndefinedProperties: true
        });
        
        // Auth is optional - only initialize if SDK is loaded
        if (typeof firebase.auth === 'function') {
            auth = firebase.auth();
            console.log('Firebase Auth initialized');
        } else {
            console.log('Firebase Auth SDK not loaded - skipping auth initialization');
        }

        // Storage is optional - only initialize if SDK is loaded
        if (typeof firebase.storage === 'function') {
            storage = firebase.storage();
            console.log('Firebase Storage initialized');
        } else {
            console.log('Firebase Storage SDK not loaded - skipping storage initialization');
        }

        // Only initialize analytics if the SDK is loaded
        if (typeof firebase.analytics === 'function') {
            analytics = firebase.analytics();
            console.log('Firebase Analytics initialized');
        } else {
            console.log('Analytics SDK not loaded - skipping analytics initialization');
        }

        // Enable offline persistence in background (non-blocking)
        // This helps with offline support but shouldn't delay initial load
        setTimeout(() => {
            db.enablePersistence({ 
                synchronizeTabs: true,
                experimentalForceOwningTab: true // Better for mobile
            })
                .then(() => {
                    console.log('✅ Firebase persistence enabled');
                })
                .catch((err) => {
                    if (err.code === 'failed-precondition') {
                        console.warn('⚠️ Firebase persistence failed: Multiple tabs open');
                    } else if (err.code === 'unimplemented') {
                        console.warn('⚠️ Firebase persistence not supported in this browser');
                    } else {
                        console.warn('⚠️ Firebase persistence error:', err.code);
                    }
                });
        }, 100);

        // Export for use in other files
        window.firebase = firebase;
        window.db = db;
        window.auth = auth;
        window.storage = storage;
        window.analytics = analytics;

        console.log('Firebase initialized successfully, window.db:', window.db ? 'exists' : 'missing');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}
