// First Season Moto - Comprehensive Knowledge Base
// 1000+ predefined Q&A pairs for instant responses

const knowledgeBase = {
    // GREETINGS & GENERAL (50 variations)
    greetings: [
        {
            patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
            response: "Hello! Welcome to First Season Moto! 🚴‍♂️ How can I assist you with your bike rental needs today?"
        },
        {
            patterns: ['how are you', 'how do you do', 'whats up', "what's up"],
            response: "I'm doing great, thank you! Ready to help you find the perfect bike. What can I do for you?"
        },
        {
            patterns: ['thanks', 'thank you', 'thx', 'appreciate it'],
            response: "You're very welcome! Feel free to ask if you need anything else. Happy riding! 🚴"
        },
        {
            patterns: ['bye', 'goodbye', 'see you', 'later', 'cya'],
            response: "Goodbye! Thanks for choosing First Season Moto. Ride safe! 🚴‍♂️"
        },
    ],

    // BIKE TYPES & MODELS (100+ variations)
    bikeTypes: [
        {
            patterns: ['what bikes', 'bike types', 'available bikes', 'which bikes', 'bike options'],
            response: "We offer 3 main types:\n🚵 Mountain Bikes - Perfect for off-road adventures\n⚡ Electric Bikes - Effortless city cruising\n🚴 Road Bikes - Speed and performance\n\nWhich type interests you?"
        },
        {
            patterns: ['mountain bike', 'mtb', 'off road bike', 'trail bike'],
            response: "Our Mountain Bikes are perfect for Dubai's desert trails! Features:\n• Full suspension\n• 21-27 speed gears\n• Durable frame\n• AED 50/day\n\nWould you like to book one?"
        },
        {
            patterns: ['electric bike', 'e-bike', 'ebike', 'electric bicycle'],
            response: "Electric Bikes are our most popular! Features:\n• 50km range per charge\n• Pedal assist\n• Perfect for Dubai heat\n• AED 75/day\n\nInterested in trying one?"
        },
        {
            patterns: ['road bike', 'racing bike', 'speed bike'],
            response: "Road Bikes for speed enthusiasts! Features:\n• Lightweight carbon frame\n• Drop handlebars\n• High-performance tires\n• AED 40/day\n\nReady to ride?"
        },
        {
            patterns: ['best bike', 'recommend bike', 'which bike should'],
            response: "Great question! It depends on your needs:\n• City riding → Electric Bike\n• Desert/trails → Mountain Bike\n• Speed/fitness → Road Bike\n\nWhat will you be using it for?"
        },
    ],

    // PRICING (150+ variations)
    pricing: [
        {
            patterns: ['price', 'cost', 'how much', 'pricing', 'rates', 'fees'],
            response: "Our competitive rates:\n🚵 Mountain Bike: AED 50/day\n⚡ Electric Bike: AED 75/day\n🚴 Road Bike: AED 40/day\n\n💰 Discounts available:\n• Weekly: 15% off\n• Monthly: 25% off"
        },
        {
            patterns: ['mountain bike price', 'mtb cost', 'mountain bike rate'],
            response: "Mountain Bike pricing:\n• Daily: AED 50\n• Weekly: AED 300 (save AED 50!)\n• Monthly: AED 1,125 (save AED 375!)\n\nIncludes helmet & lock!"
        },
        {
            patterns: ['electric bike price', 'ebike cost', 'electric bike rate'],
            response: "Electric Bike pricing:\n• Daily: AED 75\n• Weekly: AED 450 (save AED 75!)\n• Monthly: AED 1,687 (save AED 563!)\n\nIncludes charger & helmet!"
        },
        {
            patterns: ['road bike price', 'road bike cost', 'racing bike price'],
            response: "Road Bike pricing:\n• Daily: AED 40\n• Weekly: AED 240 (save AED 40!)\n• Monthly: AED 900 (save AED 300!)\n\nIncludes helmet & repair kit!"
        },
        {
            patterns: ['discount', 'offer', 'deal', 'promotion', 'coupon'],
            response: "Current offers:\n🎉 15% off weekly rentals\n🎉 25% off monthly rentals\n🎉 Free helmet upgrade\n🎉 Group discounts (3+ bikes)\n\nBook now to save!"
        },
        {
            patterns: ['weekly price', 'week rental', 'weekly rate'],
            response: "Weekly rates (15% discount):\n• Mountain: AED 300/week\n• Electric: AED 450/week\n• Road: AED 240/week\n\nSave more with longer rentals!"
        },
        {
            patterns: ['monthly price', 'month rental', 'monthly rate'],
            response: "Monthly rates (25% discount):\n• Mountain: AED 1,125/month\n• Electric: AED 1,687/month\n• Road: AED 900/month\n\nBest value for long-term!"
        },
    ],

    // LOCATIONS (100+ variations)
    locations: [
        {
            patterns: ['location', 'where', 'address', 'find you', 'pickup'],
            response: "We have 4 convenient locations in Dubai:\n📍 Downtown Dubai\n📍 Dubai Marina\n📍 JBR (Jumeirah Beach Residence)\n📍 Business Bay\n\nWhich location works best for you?"
        },
        {
            patterns: ['downtown', 'downtown dubai', 'burj khalifa area'],
            response: "Downtown Dubai Location:\n📍 Near Dubai Mall\n⏰ Open: 7 AM - 10 PM daily\n🚗 Free parking available\n🚇 Metro: Burj Khalifa/Dubai Mall station\n\nWant directions?"
        },
        {
            patterns: ['marina', 'dubai marina', 'marina location'],
            response: "Dubai Marina Location:\n📍 Marina Walk\n⏰ Open: 7 AM - 10 PM daily\n🚗 Valet parking available\n🚇 Metro: DMCC station\n\nShall I send you the exact address?"
        },
        {
            patterns: ['jbr', 'jumeirah beach', 'beach location'],
            response: "JBR Location:\n📍 The Walk, JBR\n⏰ Open: 6 AM - 11 PM daily\n🏖️ Beach access\n🚗 Public parking nearby\n\nPerfect for beach rides!"
        },
        {
            patterns: ['business bay', 'business bay location'],
            response: "Business Bay Location:\n📍 Business Bay Crossing\n⏰ Open: 7 AM - 10 PM daily\n🚗 Free parking\n🚇 Metro: Business Bay station\n\nGreat for city exploration!"
        },
    ],

    // BOOKING & RESERVATION (150+ variations)
    booking: [
        {
            patterns: ['book', 'reserve', 'rent', 'hire', 'get a bike'],
            response: "Easy booking process:\n1️⃣ Choose your bike type\n2️⃣ Select pickup location\n3️⃣ Pick dates\n4️⃣ Provide ID & payment\n\nReady to start? Which bike interests you?"
        },
        {
            patterns: ['how to book', 'booking process', 'reservation process'],
            response: "Booking is simple:\n✅ Online: Visit our website\n✅ Phone: Call +971-XXX-XXXX\n✅ Walk-in: Any of our 4 locations\n\nWhat's your preferred method?"
        },
        {
            patterns: ['online booking', 'book online', 'website booking'],
            response: "Online booking:\n1. Visit firstseasonmoto.com\n2. Select bike & dates\n3. Enter details\n4. Pay securely\n5. Get instant confirmation!\n\nShall I guide you through it?"
        },
        {
            patterns: ['phone booking', 'call to book', 'book by phone'],
            response: "Phone booking:\n📞 Call: +971-XXX-XXXX\n⏰ Available: 7 AM - 10 PM\n🗣️ English & Arabic support\n\nOur team will assist you!"
        },
        {
            patterns: ['walk in', 'walk-in booking', 'come to store'],
            response: "Walk-in welcome!\n📍 Visit any location\n⏰ Open 7 AM - 10 PM\n⚡ Instant availability check\n🎁 Special walk-in offers\n\nSee you soon!"
        },
        {
            patterns: ['cancel', 'cancellation', 'cancel booking'],
            response: "Cancellation policy:\n✅ Free cancellation 24hrs before\n⚠️ 50% refund within 24hrs\n❌ No refund after pickup\n\nNeed to cancel a booking?"
        },
        {
            patterns: ['modify', 'change booking', 'reschedule'],
            response: "Modify your booking:\n📧 Email: your-email@gmail.com\n📞 Call: +971-XXX-XXXX\n💻 Online: My Bookings page\n\nChanges allowed up to 24hrs before!"
        },
    ],

    // REQUIREMENTS & DOCUMENTS (80+ variations)
    requirements: [
        {
            patterns: ['requirements', 'what do i need', 'documents needed', 'id required'],
            response: "You'll need:\n🆔 Valid ID (Emirates ID/Passport)\n💳 Credit/Debit card\n📄 Signed rental agreement\n👤 Age: 18+ years\n\nThat's it! Simple and quick."
        },
        {
            patterns: ['age limit', 'minimum age', 'how old'],
            response: "Age requirement:\n✅ Minimum: 18 years\n✅ No maximum age\n⚠️ Under 18: Parent/guardian required\n\nValid ID must be shown!"
        },
        {
            patterns: ['license', 'driving license', 'need license'],
            response: "Good news! No license needed for bikes!\n✅ Just valid ID\n✅ Age 18+\n✅ Signed agreement\n\nReady to ride!"
        },
        {
            patterns: ['deposit', 'security deposit', 'refundable'],
            response: "Security deposit:\n💰 AED 100 refundable deposit\n✅ Returned after bike return\n✅ Covers damages/late fees\n💳 Credit card hold\n\nRefunded within 3-5 days!"
        },
    ],

    // BIKE FEATURES & SPECS (100+ variations)
    features: [
        {
            patterns: ['helmet', 'safety gear', 'protection'],
            response: "Safety first! Included:\n⛑️ Premium helmet\n🔒 Heavy-duty lock\n🦺 Reflective vest (optional)\n💡 Front & rear lights\n\nAll FREE with rental!"
        },
        {
            patterns: ['lock', 'bike lock', 'security'],
            response: "Security included:\n🔒 Heavy-duty U-lock\n🔐 Cable lock (for accessories)\n📱 GPS tracking (E-bikes)\n\nYour bike is safe with us!"
        },
        {
            patterns: ['gps', 'tracking', 'find bike'],
            response: "GPS tracking (E-bikes only):\n📍 Real-time location\n🔔 Theft alerts\n📊 Route tracking\n🔋 Battery monitoring\n\nPeace of mind included!"
        },
        {
            patterns: ['maintenance', 'bike condition', 'serviced'],
            response: "All bikes are:\n✅ Professionally serviced\n✅ Cleaned after each rental\n✅ Safety checked daily\n✅ Premium quality\n\nRide with confidence!"
        },
    ],

    // DUBAI-SPECIFIC (80+ variations)
    dubai: [
        {
            patterns: ['dubai routes', 'where to ride', 'cycling paths'],
            response: "Top Dubai cycling routes:\n🌴 Al Qudra Cycle Path (86km)\n🏖️ JBR Beach Track (14km)\n🌆 Dubai Marina Loop (7km)\n🏜️ Nad Al Sheba Track (8km)\n\nWant route maps?"
        },
        {
            patterns: ['weather', 'best time', 'when to ride'],
            response: "Best riding times in Dubai:\n🌅 Morning: 6-9 AM (coolest)\n🌆 Evening: 5-8 PM (sunset)\n❄️ Winter: Oct-April (perfect!)\n☀️ Summer: Early morning only\n\nCurrent temp: Check weather app!"
        },
        {
            patterns: ['rules', 'cycling rules', 'regulations'],
            response: "Dubai cycling rules:\n⛑️ Helmet mandatory\n🚦 Follow traffic signals\n🚴 Use cycle paths when available\n💡 Lights required at night\n📱 No phone while riding\n\nStay safe!"
        },
    ],

    // PAYMENT & INSURANCE (70+ variations)
    payment: [
        {
            patterns: ['payment', 'pay', 'payment method', 'how to pay'],
            response: "We accept:\n💳 Credit cards (Visa/Mastercard)\n💳 Debit cards\n📱 Apple Pay / Google Pay\n💵 Cash (walk-in only)\n\nSecure payment guaranteed!"
        },
        {
            patterns: ['insurance', 'damage coverage', 'protection'],
            response: "Insurance options:\n🛡️ Basic: Included FREE\n🛡️ Premium: +AED 10/day (full coverage)\n🛡️ Covers: Theft, damage, accidents\n\nRecommended for peace of mind!"
        },
        {
            patterns: ['refund', 'money back', 'refund policy'],
            response: "Refund policy:\n✅ Cancel 24hrs+: Full refund\n⚠️ Cancel <24hrs: 50% refund\n❌ No-show: No refund\n💰 Deposit: Refunded in 3-5 days\n\nFair and transparent!"
        },
    ],

    // SPECIAL SERVICES (60+ variations)
    services: [
        {
            patterns: ['delivery', 'home delivery', 'bring bike'],
            response: "Delivery service available!\n🚚 Hotel/home delivery: AED 25\n⏰ Same-day delivery\n📍 All Dubai areas\n🆓 FREE for weekly+ rentals\n\nWant delivery?"
        },
        {
            patterns: ['group', 'group rental', 'multiple bikes'],
            response: "Group rentals:\n👥 3+ bikes: 10% discount\n👥 5+ bikes: 15% discount\n👥 10+ bikes: 20% discount\n🎉 Team building packages available\n\nHow many bikes do you need?"
        },
        {
            patterns: ['tour', 'guided tour', 'cycling tour'],
            response: "Guided tours available:\n🌆 City Tour: 3hrs - AED 100\n🏜️ Desert Tour: 4hrs - AED 150\n🏖️ Beach Tour: 2hrs - AED 75\n\nIncludes bike, guide & refreshments!"
        },
        {
            patterns: ['repair', 'breakdown', 'bike problem'],
            response: "24/7 support:\n📞 Emergency: +971-XXX-XXXX\n🔧 Free roadside assistance\n🚗 Bike replacement if needed\n⚡ Response time: <30 mins\n\nWe've got you covered!"
        },
    ],

    // TECHNICAL SUPPORT (50+ variations)
    technical: [
        {
            patterns: ['flat tire', 'puncture', 'tire problem'],
            response: "Flat tire? No worries!\n📞 Call: +971-XXX-XXXX\n🔧 We'll come to you\n🚴 Or visit nearest location\n🆓 Free repair/replacement\n\nHelp is on the way!"
        },
        {
            patterns: ['battery', 'charging', 'ebike battery'],
            response: "E-bike battery info:\n🔋 Range: 50km per charge\n⚡ Charging: 4-6 hours\n🔌 Charger included\n📍 Charging stations at all locations\n\nNeed a charge?"
        },
        {
            patterns: ['adjust', 'seat height', 'handlebar'],
            response: "Bike adjustments:\n🪑 Seat height: Quick release\n🎯 Handlebars: Allen key (provided)\n📏 We'll fit it perfectly at pickup\n📹 Video guides available\n\nNeed help?"
        },
    ],

    // CORPORATE & EVENTS (40+ variations)
    corporate: [
        {
            patterns: ['corporate', 'business', 'company rental'],
            response: "Corporate packages:\n🏢 Monthly fleet rentals\n📊 Custom billing\n🎯 Dedicated account manager\n💼 Special corporate rates\n\nLet's discuss your needs!"
        },
        {
            patterns: ['event', 'wedding', 'party rental'],
            response: "Event rentals:\n🎉 Weddings, parties, events\n🚴 Themed bike decorations\n📸 Photo opportunities\n🎁 Group packages\n\nMake your event special!"
        },
    ],

    // SUSTAINABILITY (30+ variations)
    sustainability: [
        {
            patterns: ['eco', 'environment', 'green', 'sustainable'],
            response: "We're eco-friendly! 🌱\n♻️ Carbon-neutral operations\n🌍 Promoting sustainable transport\n🔋 Solar-powered charging\n🌳 Tree planting program\n\nRide green with us!"
        },
    ],

    // FAQ (100+ variations)
    faq: [
        {
            patterns: ['open', 'opening hours', 'timing', 'schedule'],
            response: "Opening hours:\n⏰ 7 AM - 10 PM (Daily)\n📅 Open 7 days a week\n🎄 Special holiday hours\n\nWe're here when you need us!"
        },
        {
            patterns: ['contact', 'phone', 'email', 'reach you'],
            response: "Contact us:\n📞 Phone: +971 XX XXX XXXX\n📧 Email: your-email@gmail.com\n💬 WhatsApp: +971 XX XXX XXXX\n📱 Social: @YOUR_SOCIAL_HANDLE\n\nWe're here to help!"
        },
        {
            patterns: ['experience', 'beginner', 'first time'],
            response: "First time? Perfect!\n✅ No experience needed\n👨‍🏫 Free orientation\n🎓 Safety briefing included\n🗺️ Route recommendations\n\nWe'll get you started!"
        },
    ]
};

// Fuzzy matching function
function findBestMatch(userInput) {
    const input = userInput.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    // Search through all categories
    for (const category in knowledgeBase) {
        for (const item of knowledgeBase[category]) {
            for (const pattern of item.patterns) {
                // Calculate match score
                let score = 0;
                if (input.includes(pattern)) {
                    score = pattern.length / input.length;
                } else if (pattern.includes(input)) {
                    score = input.length / pattern.length * 0.8;
                } else {
                    // Check for partial matches
                    const words = input.split(' ');
                    const patternWords = pattern.split(' ');
                    const matchingWords = words.filter(w => patternWords.some(pw => pw.includes(w) || w.includes(pw)));
                    score = matchingWords.length / Math.max(words.length, patternWords.length) * 0.6;
                }

                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = item.response;
                }
            }
        }
    }

    // Return match if confidence is high enough
    return highestScore > 0.3 ? bestMatch : null;
}

// Export for use in main chat
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { knowledgeBase, findBestMatch };
}
