# EmailJS Contact Form Template Setup

You need to create 2 new templates in EmailJS for the "Get in Touch" contact form.

## Template 1: Contact Form to Admin (template_contact)

Go to EmailJS Dashboard → Email Templates → Create New Template

**Template ID:** `template_contact`

**To Email:** `{{to_email}}` (will be 4s.motos@gmail.com)

**Subject:**
```
{{subject}}
```

**Content:**
```html
📬 NEW CONTACT FORM SUBMISSION
================================

👤 Name: {{from_name}}
📧 Email: {{from_email}}
📱 Phone: {{phone}}

💬 Message:
{{message}}

================================
Sent from Four Season Moto Website

Reply directly to this email to respond to the customer.
```

**Reply To:** `{{from_email}}`

---

## Template 2: Auto-Reply to Customer (template_contact_reply)

**Template ID:** `template_contact_reply`

**To Email:** `{{to_email}}`

**Subject:**
```
{{subject}}
```

**Content:**
```html
Hi {{to_name}},

Thank you for reaching out to Four Season Moto! 🏍️

✅ Your message has been received.

Your Message:
"{{user_message}}"

📞 Response Time: We will get back to you within 24 hours.

📱 Contact Us:
WhatsApp: +971 56 126 6770
Email: 4s.motos@gmail.com

Thank you for choosing Four Season Moto!

Best regards,
Four Season Moto Team
```

---

## How to Create Templates

1. Go to https://dashboard.emailjs.com/
2. Click "Email Templates" in sidebar
3. Click "Create New Template"
4. Enter the template name and content as shown above
5. Save the template
6. Note the Template ID and make sure it matches what's in the code

## Service ID
The code uses: `service_mcsa7qw`

## Public Key
The code uses: `IA6FvjChvXJCSW3nC`

## Testing
1. Go to the website's "Get in Touch" section
2. Fill out the contact form
3. Submit and check:
   - 4s.motos@gmail.com receives the message
   - The customer receives an auto-reply confirmation
