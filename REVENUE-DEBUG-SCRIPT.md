# Revenue Discrepancy Debug Script

## Problem
- **Dashboard**: Shows ~$1000
- **Analytics**: Shows $900
- **Users**: Shows $900

**Difference**: ~$100

## Possible Causes

1. **Case sensitivity** in status (FIXED)
2. **Different status values** in some bookings
3. **Missing status** field in some bookings
4. **Different amount fields** being used

---

## Debug Script

Open browser console on the **Dashboard** page and run this:

```javascript
// Comprehensive Revenue Debug
db.collection('bookings').get().then(snapshot => {
    console.log('='.repeat(60));
    console.log('REVENUE DEBUG REPORT');
    console.log('='.repeat(60));
    
    let dashboardTotal = 0;
    let analyticsTotal = 0;
    let dashboardCount = 0;
    let analyticsCount = 0;
    
    const dashboardStatuses = ['completed', 'confirmed', 'paid', 'active'];
    const analyticsStatuses = ['confirmed', 'paid', 'completed', 'active'];
    
    snapshot.forEach(doc => {
        const data = doc.data();
        const id = doc.id.slice(-6);
        const amount = parseFloat(data.amount || data.totalAmount || 0);
        const status = (data.status || '').toLowerCase();
        const statusRaw = data.status || 'MISSING';
        
        // Dashboard filter (case-insensitive now)
        const dashboardInclude = dashboardStatuses.includes(status);
        
        // Analytics filter (case-insensitive)
        const analyticsInclude = analyticsStatuses.includes(status);
        
        if (dashboardInclude) {
            dashboardTotal += amount;
            dashboardCount++;
        }
        
        if (analyticsInclude) {
            analyticsTotal += amount;
            analyticsCount++;
        }
        
        // Log discrepancies
        if (dashboardInclude !== analyticsInclude) {
            console.log(`⚠️  DISCREPANCY: ${id}`);
            console.log(`   Status: "${statusRaw}" (lowercase: "${status}")`);
            console.log(`   Amount: $${amount}`);
            console.log(`   Dashboard: ${dashboardInclude ? '✅ COUNTED' : '❌ EXCLUDED'}`);
            console.log(`   Analytics: ${analyticsInclude ? '✅ COUNTED' : '❌ EXCLUDED'}`);
            console.log('');
        }
        
        // Log all bookings
        const icon = dashboardInclude ? '✅' : '❌';
        console.log(`${icon} ${id}: $${amount.toFixed(2)} (${statusRaw})`);
    });
    
    console.log('');
    console.log('='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Dashboard: ${dashboardCount} bookings = $${dashboardTotal.toFixed(2)}`);
    console.log(`Analytics: ${analyticsCount} bookings = $${analyticsTotal.toFixed(2)}`);
    console.log(`Difference: $${Math.abs(dashboardTotal - analyticsTotal).toFixed(2)}`);
    console.log('='.repeat(60));
    
    if (Math.abs(dashboardTotal - analyticsTotal) < 0.01) {
        console.log('✅ MATCH! Revenue is consistent.');
    } else {
        console.log('⚠️  MISMATCH! Check discrepancies above.');
    }
});
```

---

## What to Look For

### 1. **Status Value Issues**
Look for bookings with unusual status values:
- `"Confirmed"` (capital C) vs `"confirmed"`
- `"PAID"` (all caps) vs `"paid"`
- Empty status: `""`
- Null status: `null`

### 2. **Amount Field Issues**
Check if some bookings have:
- `amount` field but not `totalAmount`
- `totalAmount` field but not `amount`
- Both fields with different values
- String values instead of numbers

### 3. **Missing Fields**
Some bookings might be missing:
- `status` field entirely
- `amount` and `totalAmount` fields
- `createdAt` timestamp

---

## Expected Output

### If Everything Matches:
```
✅ booking1: $150.00 (confirmed)
✅ booking2: $200.00 (paid)
✅ booking3: $250.00 (completed)
❌ booking4: $100.00 (pending)

==========================================================
SUMMARY
==========================================================
Dashboard: 3 bookings = $600.00
Analytics: 3 bookings = $600.00
Difference: $0.00
==========================================================
✅ MATCH! Revenue is consistent.
```

### If There's a Discrepancy:
```
⚠️  DISCREPANCY: abc123
   Status: "Confirmed" (lowercase: "confirmed")
   Amount: $100
   Dashboard: ✅ COUNTED
   Analytics: ✅ COUNTED

✅ booking1: $150.00 (confirmed)
✅ booking2: $200.00 (paid)
✅ booking3: $250.00 (completed)
✅ booking4: $100.00 (Confirmed)  ← This one!
❌ booking5: $100.00 (pending)

==========================================================
SUMMARY
==========================================================
Dashboard: 4 bookings = $700.00
Analytics: 3 bookings = $600.00
Difference: $100.00
==========================================================
⚠️  MISMATCH! Check discrepancies above.
```

---

## Quick Fixes

### Fix 1: Normalize All Status Values
Run this to fix case issues:

```javascript
db.collection('bookings').get().then(snapshot => {
    const batch = db.batch();
    let count = 0;
    
    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status && data.status !== data.status.toLowerCase()) {
            batch.update(doc.ref, {
                status: data.status.toLowerCase()
            });
            count++;
            console.log(`Fixing: ${doc.id} - "${data.status}" → "${data.status.toLowerCase()}"`);
        }
    });
    
    if (count > 0) {
        batch.commit().then(() => {
            console.log(`✅ Fixed ${count} bookings`);
            console.log('Refresh the page to see updated revenue.');
        });
    } else {
        console.log('✅ All statuses are already lowercase');
    }
});
```

### Fix 2: Add Missing Status
Run this to set default status for bookings without one:

```javascript
db.collection('bookings').get().then(snapshot => {
    const batch = db.batch();
    let count = 0;
    
    snapshot.forEach(doc => {
        const data = doc.data();
        if (!data.status) {
            batch.update(doc.ref, {
                status: 'confirmed'  // or 'pending' if you prefer
            });
            count++;
            console.log(`Adding status to: ${doc.id}`);
        }
    });
    
    if (count > 0) {
        batch.commit().then(() => {
            console.log(`✅ Added status to ${count} bookings`);
        });
    } else {
        console.log('✅ All bookings have status');
    }
});
```

---

## After Running Debug Script

1. **Copy the output** from console
2. **Look for discrepancies** marked with ⚠️
3. **Check the difference** amount
4. **Run appropriate fix** if needed
5. **Refresh all admin pages** to verify

---

**Next Step**: Run the debug script and share the output!
