#!/bin/bash

# Four Seasons Moto - Quick Netlify Deployment Script
# This script helps you deploy to Netlify via CLI

echo "🏍️  Four Seasons Moto - Netlify Deployment"
echo "=========================================="
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "❌ Netlify CLI not found!"
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed!"
    echo ""
fi

# Login to Netlify
echo "🔐 Logging in to Netlify..."
netlify login

echo ""
echo "🚀 Deploying to Netlify..."
echo ""

# Deploy to production
netlify deploy --prod --dir="."

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Check your site URL in the output above"
echo "2. Test all pages and features"
echo "3. Configure custom domain (optional)"
echo "4. Set up Firebase security rules"
echo ""
echo "🎉 Your site is live! 🏍️💨"
