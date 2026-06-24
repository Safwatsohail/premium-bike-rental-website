# Contact Form - Web3Forms Integration ✅

## Status: FULLY CONFIGURED

Your contact form is already integrated with Web3Forms and configured to send emails to **4s.motos@gmail.com**.

## Current Configuration

### Email Recipient
- **Admin Email**: 4s.motos@gmail.com
- All contact form submissions will be sent to this email address

### Web3Forms Access Key
- **Access Key**: `6d808a31-76e3-46c1-aaef-8938f170521a`
- This key is already configured in the JavaScript code

### Form Features
✅ Name field (required)
✅ Email field (required) - with validation
✅ Phone field (optional)
✅ Message field (required)
✅ Loading state during submission
✅ Success/error notifications
✅ Automatic form reset after successful submission
✅ Reply-to set to customer's email for easy responses

## How It Works

1. **User fills out the form** on your website
2. **JavaScript validates** the input (name, email, message required)
3. **Web3Forms API** receives the data
4. **Email is sent** to 4s.motos@gmail.com with:
   - Subject: "New Contact Form Message from [Customer Name]"
   - From: Four Season Moto Website
   - Reply-To: Customer's email (so you can reply directly)
   - Body: All form details (name, email, phone, message)

## Testing

To test the contact form:
1. Open your website
2. Scroll to the "Get In Touch" section
3. Fill out the form with test data
4. Click "Send Message"
5. Check 4s.motos@gmail.com inbox for the email

## Important Notes

- ⚠️ Make sure to check your **spam folder** if you don't see emails
- 📧 You can reply directly to customer emails (reply-to is set to their email)
- 🔒 Web3Forms is secure and GDPR compliant
- 📊 You can view submission logs at https://web3forms.com (login with your account)

## Need to Change the Email?

If you need to change the recipient email in the future, update line ~10398 in `index.html`:

```javascript
formData.append('email', '4s.motos@gmail.com'); // Change this email
```

## Support

If emails are not being received:
1. Verify the Web3Forms access key is valid
2. Check spam/junk folders
3. Verify 4s.motos@gmail.com is correct
4. Check Web3Forms dashboard for submission logs
