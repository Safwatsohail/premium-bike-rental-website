# Bikes Edit/Delete Buttons Troubleshooting Guide

## Issue
Edit and Delete buttons on bike cards are not working.

## Possible Causes & Solutions

### 1. JavaScript Not Loaded
**Check:**
- Open browser console (F12)
- Look for any JavaScript errors
- Verify `bikes-firebase.js` is loading

**Solution:**
```html
<!-- Verify this is in bikes.html -->
<script src="js/firebase-config.js"></script>
<script src="js/session-manager.js"></script>
<script src="js/translation.js"></script>
<script src="js/bikes-firebase.js"></script>
```

### 2. Functions Not Exposed to Window
**Check:**
The functions should be defined as:
```javascript
window.openEditBikeModal = function(id) { ... }
window.openDeleteConfirm = function(id) { ... }
```

**Current Status:** ✅ Fixed - Functions are now exposed to window

### 3. Bike ID Issues
**Check:**
- Bike IDs must be valid strings
- IDs should not contain special characters that break HTML

**Debug:**
```javascript
// Add this to console
console.log('Bikes:', bikes);
bikes.forEach(b => console.log('ID:', b.id, 'Type:', typeof b.id));
```

### 4. Modal Elements Missing
**Check:**
```javascript
// Add to console
console.log('Modal:', document.getElementById('bikeModal'));
console.log('Confirm Modal:', document.getElementById('confirmModal'));
```

**Solution:**
Verify these elements exist in `bikes.html`:
- `<div class="modal" id="bikeModal">`
- `<div class="modal" id="confirmModal">`

### 5. Event Listeners Not Attached
**Check:**
```javascript
// In console
console.log('Add button:', document.getElementById('addNewBike'));
```

**Solution:**
Verify `setupEventListeners()` is being called in `DOMContentLoaded`

## Quick Test Steps

### Step 1: Open Browser Console
1. Go to `admin-dashboard/bikes.html`
2. Press F12 to open Developer Tools
3. Go to Console tab

### Step 2: Check for Errors
Look for red error messages. Common ones:
- `Uncaught ReferenceError: openEditBikeModal is not defined`
- `Cannot read property 'classList' of null`
- `Firebase not initialized`

### Step 3: Test Functions Manually
In console, type:
```javascript
// Test if functions exist
console.log(typeof window.openEditBikeModal);
console.log(typeof window.openDeleteConfirm);

// Test with a fake ID
window.openEditBikeModal('test-123');
```

### Step 4: Check Bike Data
```javascript
// See all bikes
console.log('Bikes:', bikes);

// Check first bike
if (bikes.length > 0) {
    console.log('First bike:', bikes[0]);
    console.log('First bike ID:', bikes[0].id);
}
```

### Step 5: Test Button Click
```javascript
// Find all edit buttons
const editButtons = document.querySelectorAll('.btn-icon');
console.log('Edit buttons found:', editButtons.length);

// Check onclick attribute
if (editButtons.length > 0) {
    console.log('First button onclick:', editButtons[0].getAttribute('onclick'));
}
```

## Common Fixes

### Fix 1: Clear Browser Cache
1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Clear cached images and files
3. Reload page with Ctrl+F5 (or Cmd+Shift+R on Mac)

### Fix 2: Check Firebase Connection
```javascript
// In console
console.log('Firebase DB:', window.db);
console.log('Firebase Auth:', window.auth);

// Test Firebase
window.db.collection('bikes').get().then(snapshot => {
    console.log('Bikes in Firebase:', snapshot.size);
});
```

### Fix 3: Verify Modal HTML
Check that bikes.html has:
```html
<!-- Add/Edit Bike Modal -->
<div class="modal" id="bikeModal">
    <div class="modal-content glass">
        <div class="modal-header">
            <h2 id="modalTitle">Add New Bike</h2>
            <button class="close-modal">&times;</button>
        </div>
        <form id="bikeForm">
            <!-- Form content -->
        </form>
    </div>
</div>

<!-- Confirmation Modal -->
<div class="modal" id="confirmModal">
    <div class="modal-content glass">
        <div class="modal-header">
            <h2>Confirm Action</h2>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to delete this bike?</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelDelete">Cancel</button>
            <button class="btn btn-danger" id="confirmDelete">Delete</button>
        </div>
    </div>
</div>
```

### Fix 4: Re-render Bikes
```javascript
// In console - force re-render
renderBikes(bikes);
```

## Test Page
Open `admin-dashboard/test-bikes-buttons.html` to test button functionality in isolation.

## Still Not Working?

### Debug Script
Add this to the bottom of `bikes-firebase.js`:

```javascript
// DEBUG: Log when functions are defined
console.log('🔧 DEBUG: bikes-firebase.js loaded');
console.log('🔧 openEditBikeModal:', typeof window.openEditBikeModal);
console.log('🔧 openDeleteConfirm:', typeof window.openDeleteConfirm);

// DEBUG: Test button clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-icon')) {
        console.log('🔧 Button clicked:', e.target);
        console.log('🔧 Button onclick:', e.target.getAttribute('onclick'));
    }
});
```

### Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Reload page
4. Check if `bikes-firebase.js` loads successfully (status 200)
5. Check if there are any 404 errors

## Expected Behavior

When working correctly:
1. Click Edit button → Modal opens with bike data
2. Click Delete button → Confirmation modal appears
3. Confirm delete → Bike is removed from Firebase
4. Cancel delete → Modal closes, bike remains

## Contact Support
If none of these solutions work, provide:
1. Screenshot of browser console errors
2. Screenshot of Network tab
3. Browser name and version
4. Operating system
