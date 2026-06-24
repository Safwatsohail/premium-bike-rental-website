# Troubleshooting Guide

## 🔍 Common Issues & Solutions

### Issue 1: Language Buttons Don't Work

#### Symptoms:
- Clicking "English" or "العربية" does nothing
- Text doesn't change
- No error in console

#### Solutions:

**Solution A: Check File Loading**
```
1. Open browser console (F12)
2. Go to Network tab
3. Refresh page
4. Check if translation.js loads (should be 200 OK)
5. If 404 error, check file path
```

**Solution B: Clear Cache**
```
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (Ctrl+F5)
```

**Solution C: Check JavaScript**
```
1. Open console (F12)
2. Type: typeof switchLanguage
3. Should show: "function"
4. If "undefined", translation.js not loaded
```

**Solution D: Verify File Structure**
```
admin-dashboard/
├── main_admin.html
└── js/
    └── translation.js  ← Must exist here!
```

---

### Issue 2: Mobile Menu Not Appearing

#### Symptoms:
- No hamburger icon on mobile
- Sidebar always visible
- Can't access menu on small screens

#### Solutions:

**Solution A: Check Screen Size**
```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone or similar
4. Width must be < 768px
5. Hamburger should appear
```

**Solution B: Check CSS Loading**
```
1. Open DevTools (F12)
2. Go to Elements tab
3. Find .mobile-menu-toggle
4. Check if display: block (on mobile)
5. If display: none, CSS not loading
```

**Solution C: Force Mobile View**
```
1. Resize browser window
2. Make it very narrow (< 768px)
3. Refresh page
4. Hamburger should appear
```

---

### Issue 3: Animations Not Working

#### Symptoms:
- Cards appear instantly
- No fade-in effect
- No hover animations

#### Solutions:

**Solution A: Check Browser Support**
```
1. Update browser to latest version
2. Try different browser (Chrome, Firefox)
3. Check if hardware acceleration enabled
```

**Solution B: Check CSS**
```
1. Open DevTools (F12)
2. Go to Elements tab
3. Find .stat-card
4. Check if animation property exists
5. Should see: animation: fadeInUp 0.5s ease-out
```

**Solution C: Disable Browser Extensions**
```
1. Open browser in incognito mode
2. Test animations
3. If working, disable extensions one by one
4. Find conflicting extension
```

---

### Issue 4: RTL Layout Not Working

#### Symptoms:
- Arabic text appears but layout doesn't flip
- Icons on wrong side
- Text alignment incorrect

#### Solutions:

**Solution A: Check HTML Attributes**
```
1. Open DevTools (F12)
2. Check <html> tag
3. Should have: dir="rtl" (in Arabic mode)
4. Should have: lang="ar"
```

**Solution B: Check Body Class**
```
1. Open DevTools (F12)
2. Check <body> tag
3. Should have class="rtl" (in Arabic mode)
4. If missing, JavaScript not working
```

**Solution C: Check RTL CSS**
```
1. Verify rtl.css file exists
2. Check if it's loaded in Network tab
3. Should be linked in main_admin.html
```

---

### Issue 5: Language Not Persisting

#### Symptoms:
- Language resets to English on refresh
- Can't remember language choice
- Always starts in English

#### Solutions:

**Solution A: Check LocalStorage**
```
1. Open DevTools (F12)
2. Go to Application tab
3. Click Local Storage
4. Check for 'language' key
5. Should show 'en' or 'ar'
```

**Solution B: Enable LocalStorage**
```
1. Check browser privacy settings
2. Allow cookies and site data
3. Disable "Clear on exit" option
4. Try again
```

**Solution C: Test LocalStorage**
```
1. Open console (F12)
2. Type: localStorage.setItem('test', 'value')
3. Type: localStorage.getItem('test')
4. Should return: "value"
5. If error, LocalStorage blocked
```

---

### Issue 6: Responsive Layout Broken

#### Symptoms:
- Layout doesn't adapt to screen size
- Content overflows
- Horizontal scrollbar appears

#### Solutions:

**Solution A: Check Viewport Meta Tag**
```html
<!-- Should be in <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Solution B: Check Media Queries**
```
1. Open DevTools (F12)
2. Go to Elements tab
3. Check computed styles
4. Verify media queries are active
```

**Solution C: Test Different Sizes**
```
1. Open DevTools (F12)
2. Toggle device toolbar
3. Try different devices:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)
```

---

### Issue 7: Buttons Not Clickable

#### Symptoms:
- Can't click language buttons
- Hover effect works but click doesn't
- No response when clicking

#### Solutions:

**Solution A: Check Z-Index**
```
1. Open DevTools (F12)
2. Inspect button element
3. Check z-index value
4. Should be higher than overlapping elements
```

**Solution B: Check Pointer Events**
```
1. Open DevTools (F12)
2. Check button styles
3. Verify: pointer-events: auto (not none)
4. Verify: cursor: pointer
```

**Solution C: Check JavaScript Errors**
```
1. Open console (F12)
2. Look for red error messages
3. Fix any JavaScript errors
4. Refresh and try again
```

---

### Issue 8: Console Errors

#### Common Errors & Fixes:

**Error: "switchLanguage is not defined"**
```
Fix: translation.js not loaded
1. Check file path
2. Verify script tag in HTML
3. Check Network tab for 404 errors
```

**Error: "Cannot read property 'classList' of null"**
```
Fix: Element not found
1. Check element IDs/classes
2. Verify HTML structure
3. Ensure DOM is loaded
```

**Error: "localStorage is not defined"**
```
Fix: Browser doesn't support localStorage
1. Update browser
2. Enable cookies
3. Check privacy settings
```

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Page loads without errors
- [ ] All images load correctly
- [ ] No console errors (F12)
- [ ] All CSS files load
- [ ] All JS files load

### Language Switching
- [ ] English button works
- [ ] Arabic button works
- [ ] Text changes correctly
- [ ] Layout flips for Arabic
- [ ] Language persists on refresh
- [ ] Active button highlighted

### Responsive Design
- [ ] Desktop layout works (> 1200px)
- [ ] Tablet layout works (768-1200px)
- [ ] Mobile layout works (< 768px)
- [ ] Hamburger menu appears on mobile
- [ ] Sidebar slides in/out
- [ ] All content visible on mobile

### Animations
- [ ] Cards fade in on load
- [ ] Hover effects work
- [ ] Mobile menu slides smoothly
- [ ] Language switch is smooth
- [ ] No janky animations

### Mobile Menu
- [ ] Hamburger icon appears
- [ ] Clicking opens sidebar
- [ ] Clicking outside closes sidebar
- [ ] Clicking link closes sidebar
- [ ] Icon changes (☰ ↔ ✕)

---

## 🔧 Developer Tools

### Chrome DevTools Shortcuts
```
F12              → Open DevTools
Ctrl+Shift+M     → Toggle device toolbar
Ctrl+Shift+C     → Inspect element
Ctrl+Shift+J     → Open console
Ctrl+R           → Refresh page
Ctrl+Shift+R     → Hard refresh
Ctrl+Shift+Delete → Clear cache
```

### Useful Console Commands
```javascript
// Check if translation.js loaded
typeof switchLanguage

// Check current language
localStorage.getItem('language')

// Force language change
switchLanguage('ar')

// Check if element exists
document.querySelector('.mobile-menu-toggle')

// Check RTL class
document.body.classList.contains('rtl')
```

---

## 📞 Still Having Issues?

### Step 1: Gather Information
```
1. Browser name and version
2. Operating system
3. Screen size
4. Console errors (screenshot)
5. What you were trying to do
6. What actually happened
```

### Step 2: Try These
```
1. Clear browser cache completely
2. Try different browser
3. Try incognito/private mode
4. Disable all browser extensions
5. Check internet connection
6. Restart browser
7. Restart computer
```

### Step 3: Check Files
```
1. Verify all files exist:
   - main_admin.html
   - js/translation.js
   - css/style.css
   - css/rtl.css

2. Check file permissions
3. Check file sizes (not 0 bytes)
4. Check file encoding (UTF-8)
```

### Step 4: Test Basics
```
1. Open TEST-LANGUAGE-SWITCHING.html
2. If test page works, issue is in main_admin.html
3. If test page fails, issue is in translation.js
4. Compare working vs broken files
```

---

## 🎯 Quick Fixes

### Fix 1: Nuclear Option (Clears Everything)
```
1. Close all browser tabs
2. Clear all cache and cookies
3. Restart browser
4. Open main_admin.html
5. Test functionality
```

### Fix 2: Fresh Start
```
1. Download fresh copy of files
2. Replace existing files
3. Clear browser cache
4. Test again
```

### Fix 3: Minimal Test
```
1. Create new HTML file
2. Copy only essential code
3. Test if it works
4. Add code piece by piece
5. Find what breaks it
```

---

## ✅ Verification Steps

After fixing any issue:

1. **Test Language Switching**
   - Click English → Should work
   - Click Arabic → Should work
   - Refresh → Should persist

2. **Test Responsive Design**
   - Resize window → Should adapt
   - Test on mobile → Should work
   - Test hamburger menu → Should work

3. **Test Animations**
   - Reload page → Should fade in
   - Hover cards → Should lift
   - All smooth → No jank

4. **Check Console**
   - No errors → Clean console
   - No warnings → All good
   - Everything loads → Success!

---

**If all else fails, start fresh with the provided files! 🔄**
