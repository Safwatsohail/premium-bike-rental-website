// Delivery Settings Loader for Main Website
(function() {
    'use strict';

    // Firebase config
    const firebaseConfig = {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_FIREBASE_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.firebasestorage.app",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "1:YOUR_MESSAGING_SENDER_ID:web:27d28d44e449306b726b97",
        measurementId: "YOUR_MEASUREMENT_ID"
    };

    // Get Firebase instance
    let db;
    if (window.db) {
        db = window.db;
    } else if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
    }

    // Store settings globally (DEFAULT: disabled until admin enables)
    window.deliverySettings = {
        enabled: false,
        fee: 50,
        locations: []
    };

    // Load settings on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadDeliverySettings();
    });

    async function loadDeliverySettings() {
        try {
            if (!db) {
                console.warn('Delivery: Firebase not available');
                return;
            }

            const doc = await db.collection('settings').doc('delivery').get();
            
            if (doc.exists) {
                window.deliverySettings = doc.data();
                console.log('✅ Delivery settings loaded:', window.deliverySettings);
            } else {
                // Use defaults
                console.log('Using default delivery settings');
            }

            // Update all location dropdowns on the page
            updateLocationDropdowns();

        } catch (error) {
            console.error('Error loading delivery settings:', error);
        }
    }

    function updateLocationDropdowns() {
        // Find all location select elements (broader selector)
        const locationSelects = document.querySelectorAll('select[name="location"], select#location, select#pickupLocation, select#dropoffLocation, select[id*="location"], select[name*="location"]');
        
        console.log('🔍 Found', locationSelects.length, 'location dropdowns to update');
        
        locationSelects.forEach(select => {
            // Check if delivery is enabled
            if (!window.deliverySettings.enabled) {
                // Disable the dropdown - show Coming Soon
                select.disabled = true;
                select.removeAttribute('required'); // Remove required validation
                select.innerHTML = '<option value="coming-soon">🚀 Coming Soon</option>';
                
                // Add visual indicator
                select.style.opacity = '0.6';
                select.style.cursor = 'not-allowed';
                select.style.background = 'rgba(255,255,255,0.05)';
                
                // Show message
                const parent = select.parentElement;
                let notice = parent.querySelector('.delivery-notice');
                if (!notice) {
                    notice = document.createElement('p');
                    notice.className = 'delivery-notice';
                    notice.style.cssText = 'color: #ffa500; font-size: 12px; margin-top: 5px; font-weight: 500;';
                    notice.textContent = '🏍️ Delivery service coming soon! Contact us for pickup options.';
                    parent.appendChild(notice);
                }
            } else {
                // Enable and populate with locations
                select.disabled = false;
                select.style.opacity = '1';
                select.style.cursor = 'pointer';
                
                // Remove notice if exists
                const parent = select.parentElement;
                const notice = parent.querySelector('.delivery-notice');
                if (notice) notice.remove();
                
                // Populate with enabled locations
                const enabledLocations = window.deliverySettings.locations.filter(l => l.enabled);
                
                if (enabledLocations.length > 0) {
                    select.innerHTML = '<option value="">Select Location</option>';
                    enabledLocations.forEach(location => {
                        const option = document.createElement('option');
                        option.value = location.name.toLowerCase().replace(/\s+/g, '-');
                        option.textContent = location.name;
                        select.appendChild(option);
                    });
                }
            }
        });

        // Also update any delivery fee displays
        const feeDisplays = document.querySelectorAll('.delivery-fee-amount');
        feeDisplays.forEach(el => {
            el.textContent = 'AED ' + (window.deliverySettings.fee || 50);
        });
    }

    // Expose function globally
    window.updateLocationDropdowns = updateLocationDropdowns;
    window.loadDeliverySettings = loadDeliverySettings;

})();
