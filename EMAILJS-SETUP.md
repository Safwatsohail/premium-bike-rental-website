# EmailJS Setup Guide for Customer Emails

FormSubmit.co cannot send emails directly to customers (it only receives form submissions). 
To send confirmation emails to customers, you need to set up **EmailJS** (free tier: 200 emails/month).

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up Free"
3. Create account with your email

### Step 2: Add Email Service
1. Go to "Email Services" in dashboard
2. Click "Add New Service"
3. Choose "Gmail" (or your email provider)
4. Connect your email: `4s.motos@gmail.com`
5. Note the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Subject:**
```
🏍️ Booking Confirmation - {{booking_id}} | Four Season Moto
```

**Content:**
```html
Dear {{to_name}},

Thank you for your booking with Four Season Moto!

═══════════════════════════════════════
BOOKING CONFIRMATION
═══════════════════════════════════════

📋 Booking ID: {{booking_id}}
📅 Pickup Date: {{pickup_date}}
📅 Drop-off Date: {{dropoff_date}}
⏱️ Rental Duration: {{rental_days}} day(s)

🏍️ BIKE DETAILS:
• Bike: {{bike_name}}
• Price per Day: {{bike_price_per_day}}
• Bike Subtotal: {{bike_total}}

🎒 ACCESSORIES (for {{rental_days}} days):
{{accessories}}
• Accessories Total: {{accessories_total}}

💰 TOTAL AMOUNT: {{total_amount}}

═══════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════

1. Click the link below to confirm your booking
2. Complete payment via WhatsApp
3. Bring valid ID for pickup

🔗 CONFIRM YOUR BOOKING:
{{confirmation_link}}

═══════════════════════════════════════

Questions? Contact us at 4s.motos@gmail.com

Best regards,
Four Season Moto Team 🏍️
```

4. Set "To Email" field to: `{{to_email}}`
5. Save and note the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

### Step 5: Update payment.html
Open `payment.html` and replace these placeholders:

```javascript
// Line ~1082 - Replace YOUR_PUBLIC_KEY
emailjs.init('YOUR_PUBLIC_KEY');

// Line ~1298 - Replace service and template IDs
emailjs.send('service_fsmoto', 'template_booking', customerEmailParams);
```

Replace with your actual values:
- `YOUR_PUBLIC_KEY` → Your EmailJS public key
- `service_fsmoto` → Your Service ID from Step 2
- `template_booking` → Your Template ID from Step 3

## Testing
1. Make a test booking with your own email
2. Check if you receive the confirmation email
3. Check EmailJS dashboard for delivery status

## Free Tier Limits
- 200 emails/month
- 2 email templates
- Sufficient for small business

## Alternative: Upgrade to Paid
If you need more emails, EmailJS paid plans start at $5/month for 1000 emails.

---
After setup, customers will receive booking confirmation emails automatically!
