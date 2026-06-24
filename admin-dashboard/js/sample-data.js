// Sample Data Script for BikeRent Pro Firebase
// Run this script in the browser console to populate your database with sample data

async function populateSampleData() {
    if (!window.firebaseService) {
        console.error('Firebase service not initialized');
        return;
    }

    try {
        console.log('🚀 Populating sample data...');

        // 1. Add Settings
        await window.firebaseService.updateSettings({
            companyName: 'First Season Moto',
            currency: 'AED',
            language: 'en',
            theme: 'dark',
            email: 'info@firstseasonmoto.com',
            phone: '+1-234-567-8900',
            address: '123 Bike Street, Dubai, UAE',
            website: 'https://firstseasonmoto.com',
            socialMedia: {
                facebook: 'https://facebook.com/firstseasonmoto',
                instagram: 'https://instagram.com/firstseasonmoto',
                twitter: 'https://twitter.com/firstseasonmoto'
            },
            businessHours: {
                monday: '9:00 AM - 6:00 PM',
                tuesday: '9:00 AM - 6:00 PM',
                wednesday: '9:00 AM - 6:00 PM',
                thursday: '9:00 AM - 6:00 PM',
                friday: '9:00 AM - 6:00 PM',
                saturday: '10:00 AM - 4:00 PM',
                sunday: 'Closed'
            },
            rentalPolicies: {
                minRentalHours: 1,
                maxRentalDays: 30,
                depositRequired: true,
                depositAmount: 50,
                cancellationPolicy: '24 hours notice required'
            }
        });
        console.log('✅ Settings added');

        // 2. Add Sample Bikes
        const sampleBikes = [
            {
                name: 'Mountain Pro X1',
                model: '2023',
                type: 'mountain',
                year: 2023,
                price: 49.99,
                status: 'available',
                features: ['21 Gears', 'Disc Brakes', 'Front Suspension', 'Aluminum Frame'],
                description: 'Perfect for off-road adventures with its durable frame and smooth suspension system.',
                image: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            {
                name: 'Roadster 5000',
                model: '2023',
                type: 'road',
                year: 2023,
                price: 39.99,
                status: 'rented',
                features: ['18 Gears', 'Lightweight Frame', 'Aero Design', 'Carbon Fork'],
                description: 'Designed for speed and efficiency on paved roads with its aerodynamic frame.',
                image: 'https://images.unsplash.com/photo-1507030585642-3a6c3f8e3f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            {
                name: 'Urban Commuter E-500',
                model: '2023',
                type: 'electric',
                year: 2023,
                price: 69.99,
                status: 'available',
                features: ['Electric Assist', '50km Range', 'LED Display', 'Removable Battery'],
                description: 'Eco-friendly commuting with powerful electric assist for easy riding.',
                image: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            {
                name: 'Hybrid City Plus',
                model: '2023',
                type: 'hybrid',
                year: 2023,
                price: 34.99,
                status: 'available',
                features: ['21 Gears', 'Comfort Seat', 'Rack', 'Mudguards'],
                description: 'Versatile bike perfect for city commuting and light trail riding.',
                image: 'https://images.unsplash.com/photo-1548620150-685b7040b9b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            {
                name: 'Pro Racing 2000',
                model: '2023',
                type: 'road',
                year: 2023,
                price: 89.99,
                status: 'maintenance',
                features: ['24 Gears', 'Carbon Frame', 'Tubeless Tires', 'Aero Bars'],
                description: 'Professional racing bike built for competitive cycling.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            }
        ];

        for (const bike of sampleBikes) {
            await window.firebaseService.addBike(bike);
        }
        console.log('✅ Sample bikes added');

        // 3. Add Sample Users
        const sampleUsers = [
            {
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+1-234-567-8901',
                address: '456 User Street, Dubai, UAE',
                dateOfBirth: '1990-05-15',
                emergencyContact: {
                    name: 'Jane Doe',
                    phone: '+1-234-567-8902',
                    relationship: 'Spouse'
                },
                drivingLicense: 'DL123456789',
                licenseExpiry: '2025-12-31',
                membershipType: 'premium',
                membershipExpiry: '2024-12-31',
                status: 'active',
                totalRentals: 5,
                avatar: 'https://via.placeholder.com/100x100?text=JD'
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@email.com',
                phone: '+1-234-567-8903',
                address: '789 User Avenue, Dubai, UAE',
                dateOfBirth: '1985-08-22',
                emergencyContact: {
                    name: 'Bob Smith',
                    phone: '+1-234-567-8904',
                    relationship: 'Brother'
                },
                drivingLicense: 'DL987654321',
                licenseExpiry: '2024-10-31',
                membershipType: 'regular',
                membershipExpiry: '2024-06-30',
                status: 'active',
                totalRentals: 12,
                avatar: 'https://via.placeholder.com/100x100?text=JS'
            },
            {
                name: 'Mike Johnson',
                email: 'mike.johnson@email.com',
                phone: '+1-234-567-8905',
                address: '321 User Road, Dubai, UAE',
                dateOfBirth: '1992-03-10',
                emergencyContact: {
                    name: 'Sarah Johnson',
                    phone: '+1-234-567-8906',
                    relationship: 'Sister'
                },
                drivingLicense: 'DL456789123',
                licenseExpiry: '2025-06-30',
                membershipType: 'regular',
                membershipExpiry: '2024-09-30',
                status: 'inactive',
                totalRentals: 3,
                avatar: 'https://via.placeholder.com/100x100?text=MJ'
            }
        ];

        for (const user of sampleUsers) {
            await window.firebaseService.addUser(user);
        }
        console.log('✅ Sample users added');

        // 4. Add Sample Bookings
        const bikes = await window.firebaseService.getAllBikes();
        const users = await window.firebaseService.getAllUsers();
        
        const sampleBookings = [
            {
                userId: users[0]?.id || 'user1',
                bikeId: bikes[1]?.id || 'bike2', // Roadster 5000 (rented)
                startDate: new Date('2024-12-01'),
                endDate: new Date('2024-12-03'),
                startTime: '10:00 AM',
                endTime: '10:00 AM',
                totalAmount: 79.98, // 2 days * AED 39.99
                depositAmount: 50,
                status: 'active',
                paymentMethod: 'credit_card',
                paymentStatus: 'paid',
                notes: 'Customer requested helmet and lock',
                createdAt: new Date('2024-12-01T09:30:00')
            },
            {
                userId: users[1]?.id || 'user2',
                bikeId: bikes[0]?.id || 'bike1', // Mountain Pro X1
                startDate: new Date('2024-11-25'),
                endDate: new Date('2024-11-28'),
                startTime: '2:00 PM',
                endTime: '2:00 PM',
                totalAmount: 149.97, // 3 days * AED 49.99
                depositAmount: 50,
                status: 'completed',
                paymentMethod: 'cash',
                paymentStatus: 'paid',
                notes: 'Weekend rental for mountain trail',
                createdAt: new Date('2024-11-25T13:45:00')
            },
            {
                userId: users[2]?.id || 'user3',
                bikeId: bikes[2]?.id || 'bike3', // Urban Commuter
                startDate: new Date('2024-12-05'),
                endDate: new Date('2024-12-07'),
                startTime: '9:00 AM',
                endTime: '9:00 AM',
                totalAmount: 139.98, // 2 days * AED 69.99
                depositAmount: 50,
                status: 'pending',
                paymentMethod: 'credit_card',
                paymentStatus: 'pending',
                notes: 'Awaiting payment confirmation',
                createdAt: new Date('2024-12-04T16:20:00')
            }
        ];

        for (const booking of sampleBookings) {
            await window.firebaseService.addBooking(booking);
        }
        console.log('✅ Sample bookings added');

        console.log('🎉 Sample data populated successfully!');
        console.log('📊 Dashboard stats updated');
        
        // Show summary
        const stats = await window.firebaseService.getDashboardStats();
        console.log('📈 Current Dashboard Stats:', stats);

    } catch (error) {
        console.error('❌ Error populating sample data:', error);
    }
}

// Function to clear all data (use with caution!)
async function clearAllData() {
    if (!confirm('⚠️ Are you sure you want to delete ALL data? This cannot be undone!')) {
        return;
    }

    try {
        console.log('🗑️ Clearing all data...');

        // Get all collections
        const bikes = await window.firebaseService.getAllBikes();
        const users = await window.firebaseService.getAllUsers();
        const bookings = await window.firebaseService.getAllBookings();

        // Delete all documents
        for (const bike of bikes) {
            await window.firebaseService.deleteBike(bike.id);
        }

        for (const user of users) {
            await window.firebaseService.db.collection('users').doc(user.id).delete();
        }

        for (const booking of bookings) {
            await window.firebaseService.db.collection('bookings').doc(booking.id).delete();
        }

        // Clear settings
        await window.firebaseService.db.collection('settings').doc('app').delete();

        console.log('✅ All data cleared successfully!');
        console.log('🔄 Refresh the page to see empty database');

    } catch (error) {
        console.error('❌ Error clearing data:', error);
    }
}

// Make functions available globally
window.populateSampleData = populateSampleData;
window.clearAllData = clearAllData;

console.log('🔧 Sample data functions ready!');
console.log('💡 Run populateSampleData() to add sample data');
console.log('⚠️  Run clearAllData() to delete all data (use with caution!)');
