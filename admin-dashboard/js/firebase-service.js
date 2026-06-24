// Complete Firebase Service for BikeRent Pro
class FirebaseService {
    constructor() {
        this.db = window.db;
        this.auth = window.auth;
        this.storage = window.storage;
        this.analytics = window.analytics;
    }

    // ==================== BIKES COLLECTION ====================

    // Get all bikes
    async getAllBikes() {
        try {
            const snapshot = await this.db.collection('bikes').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching bikes:', error);
            return [];
        }
    }

    // Add new bike
    async addBike(bikeData) {
        try {
            const bikeWithTimestamp = {
                ...bikeData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('bikes').add(bikeWithTimestamp);
            return { id: docRef.id, ...bikeWithTimestamp };
        } catch (error) {
            console.error('Error adding bike:', error);
            throw error;
        }
    }

    // Update bike
    async updateBike(id, bikeData) {
        try {
            const bikeWithTimestamp = {
                ...bikeData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('bikes').doc(id).update(bikeWithTimestamp);
            return { id, ...bikeWithTimestamp };
        } catch (error) {
            console.error('Error updating bike:', error);
            throw error;
        }
    }

    // Delete bike
    async deleteBike(id) {
        try {
            await this.db.collection('bikes').doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting bike:', error);
            throw error;
        }
    }

    // Get bikes by status
    async getBikesByStatus(status) {
        try {
            const snapshot = await this.db.collection('bikes').where('status', '==', status).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching bikes by status:', error);
            return [];
        }
    }

    // ==================== USERS COLLECTION ====================

    // Get all users
    async getAllUsers() {
        try {
            const snapshot = await this.db.collection('users').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    // Add new user
    async addUser(userData) {
        try {
            const userWithTimestamp = {
                ...userData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('users').add(userWithTimestamp);
            return { id: docRef.id, ...userWithTimestamp };
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    // Update user
    async updateUser(id, userData) {
        try {
            const userWithTimestamp = {
                ...userData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('users').doc(id).update(userWithTimestamp);
            return { id, ...userWithTimestamp };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Get user by email
    async getUserByEmail(email) {
        try {
            const snapshot = await this.db.collection('users').where('email', '==', email).get();
            if (snapshot.empty) return null;

            const user = snapshot.docs[0];
            return { id: user.id, ...user.data() };
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }
    }

    // ==================== BOOKINGS COLLECTION ====================

    // Get all bookings
    async getAllBookings() {
        try {
            const snapshot = await this.db.collection('bookings').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    }

    // Add new booking
    async addBooking(bookingData) {
        try {
            const bookingWithTimestamp = {
                ...bookingData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('bookings').add(bookingWithTimestamp);
            return { id: docRef.id, ...bookingWithTimestamp };
        } catch (error) {
            console.error('Error adding booking:', error);
            throw error;
        }
    }

    // Update booking
    async updateBooking(id, bookingData) {
        try {
            const bookingWithTimestamp = {
                ...bookingData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('bookings').doc(id).update(bookingWithTimestamp);
            return { id, ...bookingWithTimestamp };
        } catch (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
    }

    // Get bookings by user
    async getBookingsByUser(userId) {
        try {
            const snapshot = await this.db.collection('bookings').where('userId', '==', userId).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching bookings by user:', error);
            return [];
        }
    }

    // Get bookings by bike
    async getBookingsByBike(bikeId) {
        try {
            const snapshot = await this.db.collection('bookings').where('bikeId', '==', bikeId).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching bookings by bike:', error);
            return [];
        }
    }

    // Get bookings by status
    async getBookingsByStatus(status) {
        try {
            const snapshot = await this.db.collection('bookings').where('status', '==', status).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching bookings by status:', error);
            return [];
        }
    }

    // ==================== SETTINGS COLLECTION ====================

    // Get all settings
    async getSettings() {
        try {
            const doc = await this.db.collection('settings').doc('app').get();
            return doc.exists ? doc.data() : {};
        } catch (error) {
            console.error('Error fetching settings:', error);
            return {};
        }
    }

    // Update settings
    async updateSettings(settingsData) {
        try {
            const settingsWithTimestamp = {
                ...settingsData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('settings').doc('app').set(settingsWithTimestamp, { merge: true });
            return settingsWithTimestamp;
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }

    // Get specific setting
    async getSetting(key) {
        try {
            const doc = await this.db.collection('settings').doc('app').get();
            if (!doc.exists) return null;
            return doc.data()[key] || null;
        } catch (error) {
            console.error('Error fetching setting:', error);
            return null;
        }
    }

    // ==================== DASHBOARD STATISTICS ====================

    // Get dashboard statistics
    async getDashboardStats() {
        try {
            const [users, bikes, bookings, settings] = await Promise.all([
                this.getAllUsers(),
                this.getAllBikes(),
                this.getAllBookings(),
                this.getSettings()
            ]);

            const totalUsers = users.length;
            const totalBikes = bikes.length;
            const availableBikes = bikes.filter(bike => bike.status === 'available').length;
            const rentedBikes = bikes.filter(bike => bike.status === 'rented').length;
            const totalBookings = bookings.length;
            const activeBookings = bookings.filter(booking => booking.status === 'active' || booking.status === 'confirmed').length;
            const completedBookings = bookings.filter(booking => booking.status === 'completed').length;

            // Calculate total revenue - check both 'amount' and 'totalAmount' fields
            console.log('📊 Calculating Dashboard Revenue...');
            console.log('Total bookings fetched:', bookings.length);

            const totalRevenue = bookings
                .filter(booking => {
                    const status = (booking.status || '').toLowerCase();
                    const isPaid = status === 'completed' || status === 'confirmed' || status === 'paid' || status === 'active';
                    if (isPaid) {
                        const amount = parseFloat(booking.amount || booking.totalAmount || 0);
                        console.log(`✅ Counting: ${booking.id?.slice(-6)} - $${amount} (${status})`);
                    }
                    return isPaid;
                })
                .reduce((sum, booking) => {
                    const amount = parseFloat(booking.amount || booking.totalAmount || 0);
                    return sum + amount;
                }, 0);

            console.log('💰 Dashboard Total Revenue:', totalRevenue.toFixed(2));

            // Calculate monthly revenue (current month)
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const monthlyRevenue = bookings
                .filter(booking => {
                    if (!booking.amount && !booking.totalAmount) return false;
                    const bookingDate = booking.createdAt?.toDate ? booking.createdAt.toDate() : new Date(booking.createdAt || Date.now());
                    return bookingDate &&
                        bookingDate.getMonth() === currentMonth &&
                        bookingDate.getFullYear() === currentYear;
                })
                .reduce((sum, booking) => {
                    const amount = parseFloat(booking.amount || booking.totalAmount || 0);
                    return sum + amount;
                }, 0);

            return {
                totalUsers,
                totalBikes,
                availableBikes,
                rentedBikes,
                totalBookings,
                activeBookings,
                completedBookings,
                totalRevenue,
                monthlyRevenue,
                companyName: settings.companyName || 'BikeRent Pro',
                currency: settings.currency || 'AED'
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalUsers: 0,
                totalBikes: 0,
                availableBikes: 0,
                rentedBikes: 0,
                totalBookings: 0,
                activeBookings: 0,
                completedBookings: 0,
                totalRevenue: 0,
                monthlyRevenue: 0,
                companyName: 'BikeRent Pro',
                currency: 'AED'
            };
        }
    }

    // ==================== REAL-TIME LISTENERS ====================

    // Real-time listener for bikes
    onBikesChange(callback) {
        return this.db.collection('bikes').onSnapshot((snapshot) => {
            const bikes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(bikes);
        });
    }

    // Real-time listener for users
    onUsersChange(callback) {
        return this.db.collection('users').onSnapshot((snapshot) => {
            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(users);
        });
    }

    // Real-time listener for bookings
    onBookingsChange(callback) {
        return this.db.collection('bookings').onSnapshot((snapshot) => {
            const bookings = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(bookings);
        });
    }

    // Real-time listener for dashboard stats
    onDashboardStatsChange(callback) {
        // Listen to all relevant collections
        const unsubscribeUsers = this.onUsersChange(() => this.updateDashboardStats(callback));
        const unsubscribeBikes = this.onBikesChange(() => this.updateDashboardStats(callback));
        const unsubscribeBookings = this.onBookingsChange(() => this.updateDashboardStats(callback));

        return () => {
            unsubscribeUsers();
            unsubscribeBikes();
            unsubscribeBookings();
        };
    }

    // Update dashboard stats and call callback
    async updateDashboardStats(callback) {
        const stats = await this.getDashboardStats();
        callback(stats);
    }

    // ==================== SEARCH FUNCTIONALITY ====================

    // Search bikes
    async searchBikes(searchTerm) {
        try {
            const snapshot = await this.db.collection('bikes').get();
            const bikes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return bikes.filter(bike =>
                bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (bike.features || []).some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } catch (error) {
            console.error('Error searching bikes:', error);
            return [];
        }
    }

    // Search users
    async searchUsers(searchTerm) {
        try {
            const snapshot = await this.db.collection('users').get();
            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching users:', error);
            return [];
        }
    }

    // ==================== FILE UPLOAD ====================

    // Upload file to Firebase Storage
    async uploadFile(file, path) {
        try {
            const storageRef = this.storage.ref();
            const fileRef = storageRef.child(path);

            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    // Upload bike image
    async uploadBikeImage(file, bikeId) {
        return this.uploadFile(file, `bikes/${bikeId}/${file.name}`);
    }

    // Upload user avatar
    async uploadUserAvatar(file, userId) {
        return this.uploadFile(file, `users/${userId}/avatar.${file.name.split('.').pop()}`);
    }
}

// Initialize Firebase service
const firebaseService = new FirebaseService();

// Make it globally available
window.firebaseService = firebaseService;
