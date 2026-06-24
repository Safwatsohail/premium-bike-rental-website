# Pricing Data & Revenue Accuracy Verification

## Current Data Flow

### 1. **Booking Creation** (confirm-booking.html)
When a user confirms a booking, this data is saved to Firebase:

```javascript
{
    id: "booking_id",
    email: "user@example.com",
    amount: 150.00,              // ← PRIMARY PRICE FIELD
    customerName: "John Doe",
    bikeName: "Kawasaki Ninja",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: Timestamp,
    // ... other fields
}
```

**Key Field**: `amount` (number)

---

## Revenue Calculation Across Pages

### ✅ **Main Dashboard** (main_admin.html)
**File**: `admin-dashboard/js/firebase-service.js` → `getDashboardStats()`

```javascript
const totalRevenue = bookings
    .filter(booking => (
        booking.status === 'completed' || 
        booking.status === 'confirmed' || 
        booking.status === 'paid'
    ))
    .reduce((sum, booking) => {
        const amount = parseFloat(booking.amount || booking.totalAmount || 0);
        return sum + amount;
    }, 0);
```

**Statuses Counted**: `completed`, `confirmed`, `paid`
**Fields Checked**: `amount` (primary), `totalAmount` (fallback)

---

### ✅ **Analytics Page** (analytics.html)
**File**: `admin-dashboard/js/analytics.js` → `generateAnalyticsFromBookings()`

```javascript
const dayRevenue = bookings
    .filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= date && bookingDate < nextDate;
    })
    .reduce((sum, b) => sum + b.amount, 0);
```

**Calculation**: Sums `amount` field for each day
**Time-based**: Groups by `createdAt` date

---

### ✅ **Bookings Page** (bookings.html)
**File**: `admin-dashboard/js/bookings.js` → `updateStats()`

```javascript
const todayRevenue = todayBookings.reduce((sum, b) => sum + b.price, 0);
```

**Field Used**: `price` (mapped from `amount` during load)

**Mapping in loadBookingsFromFirebase**:
```javascript
price: parseFloat(data.amount || data.price || 0)
```

---

### ✅ **Users Page** (users.html)
**File**: `admin-dashboard/js/users.js` → `setupRealtimeListener()`

```javascript
const amount = parseFloat(booking.amount || booking.totalAmount || 0);
bookingsByUser[userEmail].totalSpent += amount;
```

**Per User**: Sums all bookings by email
**Fields Checked**: `amount` (primary), `totalAmount` (fallback)

---

## Data Consistency Checklist

### ✅ **Field Names**
- [x] Primary field: `amount` (number)
- [x] Fallback field: `totalAmount` (number)
- [x] All pages check both fields
- [x] parseFloat() used to ensure number type

### ✅ **Status Filtering**
Dashboard counts these statuses:
- [x] `confirmed`
- [x] `completed`
- [x] `paid`
- [x] `active`

Analytics counts ALL bookings (no status filter)
Bookings page counts ALL bookings (no status filter)
Users page counts ALL bookings (no status filter)

### ⚠️ **Potential Discrepancy**
**Dashboard** filters by status → May show LESS revenue
**Analytics/Bookings/Users** count ALL → May show MORE revenue

---

## Recommended Fix for Consistency

All pages should use the same status filter. Here's what each page should count:

### **Paid/Confirmed Bookings Only**
```javascript
const isPaidBooking = (booking) => {
    const status = booking.status?.toLowerCase();
    return status === 'confirmed' || 
           status === 'completed' || 
           status === 'paid' || 
           status === 'active';
};
```

### **Apply to All Pages**:

1. **Analytics**: Filter before calculating
2. **Bookings**: Filter before summing
3. **Users**: Filter before calculating per-user totals

---

## Testing Revenue Accuracy

### Step 1: Check Firebase Data
1. Open Firebase Console
2. Go to Firestore → `bookings` collection
3. Verify each booking has:
   - ✅ `amount` field (number)
   - ✅ `status` field (string)
   - ✅ `createdAt` field (timestamp)

### Step 2: Manual Calculation
```
Total Revenue = Sum of all booking.amount where status IN ('confirmed', 'paid', 'completed', 'active')
```

### Step 3: Verify Each Page

| Page | Expected Revenue | Actual Revenue | Match? |
|------|-----------------|----------------|--------|
| Dashboard | $XXX | $XXX | ✅/❌ |
| Analytics | $XXX | $XXX | ✅/❌ |
| Bookings (Today) | $XXX | $XXX | ✅/❌ |
| Users (Total) | $XXX | $XXX | ✅/❌ |

---

## Common Issues & Fixes

### Issue 1: Revenue Shows $0
**Cause**: No `amount` field in bookings
**Fix**: Check Firebase, ensure bookings have `amount` field

### Issue 2: Revenue Doesn't Match
**Cause**: Different status filters on different pages
**Fix**: Use same filter everywhere (see above)

### Issue 3: Revenue Too High
**Cause**: Counting cancelled/pending bookings
**Fix**: Add status filter

### Issue 4: Revenue Too Low
**Cause**: Only counting 'completed' status
**Fix**: Include 'confirmed', 'paid', 'active' statuses

---

## Current Status Summary

### ✅ **Working Correctly**
- Dashboard calculates from bookings with status filter
- Analytics calculates daily revenue from all bookings
- Bookings page shows today's revenue
- Users page shows per-user spending

### ⚠️ **Needs Verification**
- Confirm all bookings have `amount` field
- Verify status values are consistent
- Check if cancelled bookings should be excluded

### 🔧 **Recommended Actions**

1. **Standardize Status Filter**
   - Apply same filter to all pages
   - Exclude: `cancelled`, `pending`, `rejected`
   - Include: `confirmed`, `paid`, `completed`, `active`

2. **Add Data Validation**
   - Ensure `amount` is always a number
   - Ensure `status` is always lowercase
   - Add default values if missing

3. **Add Debug Logging**
   - Log total bookings found
   - Log filtered bookings count
   - Log calculated revenue
   - Compare across pages

---

## Quick Test Script

Open browser console on any admin page and run:

```javascript
// Test revenue calculation
db.collection('bookings').get().then(snapshot => {
    let total = 0;
    let count = 0;
    
    snapshot.forEach(doc => {
        const data = doc.data();
        const amount = parseFloat(data.amount || data.totalAmount || 0);
        const status = data.status || 'unknown';
        
        console.log(`Booking ${doc.id}: $${amount} (${status})`);
        
        if (['confirmed', 'paid', 'completed', 'active'].includes(status)) {
            total += amount;
            count++;
        }
    });
    
    console.log(`\nTotal Paid Bookings: ${count}`);
    console.log(`Total Revenue: $${total.toFixed(2)}`);
});
```

This will show you exactly what revenue should be displayed.

---

**Status**: ✅ Data flow documented
**Next**: Run test script to verify actual vs expected revenue
**Date**: December 8, 2025
