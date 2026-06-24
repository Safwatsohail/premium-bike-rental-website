// Firebase Bike Service for BikeRent Pro
class BikeService {
    constructor() {
        this.db = window.db;
        this.storage = window.storage;
        this.bikesCollection = this.db.collection('bikes');
    }

    // Get all bikes
    async getAllBikes() {
        try {
            const snapshot = await this.bikesCollection.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching bikes:', error);
            return [];
        }
    }

    // Get bike by ID
    async getBikeById(id) {
        try {
            const doc = await this.bikesCollection.doc(id).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            console.error('Error fetching bike:', error);
            return null;
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
            
            const docRef = await this.bikesCollection.add(bikeWithTimestamp);
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
            
            await this.bikesCollection.doc(id).update(bikeWithTimestamp);
            return { id, ...bikeWithTimestamp };
        } catch (error) {
            console.error('Error updating bike:', error);
            throw error;
        }
    }

    // Delete bike
    async deleteBike(id) {
        try {
            await this.bikesCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.error('Error deleting bike:', error);
            throw error;
        }
    }

    // Upload bike image
    async uploadBikeImage(file, bikeId) {
        try {
            const storageRef = this.storage.ref();
            const imageRef = storageRef.child(`bikes/${bikeId}/${file.name}`);
            
            const snapshot = await imageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    // Search bikes
    async searchBikes(searchTerm) {
        try {
            // Simple text search - for production, consider using Algolia or similar
            const snapshot = await this.bikesCollection.get();
            const bikes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return bikes.filter(bike => 
                bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bike.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } catch (error) {
            console.error('Error searching bikes:', error);
            return [];
        }
    }

    // Get bikes by status
    async getBikesByStatus(status) {
        try {
            const snapshot = await this.bikesCollection.where('status', '==', status).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching bikes by status:', error);
            return [];
        }
    }

    // Real-time listener for bikes
    onBikesChange(callback) {
        return this.bikesCollection.onSnapshot((snapshot) => {
            const bikes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(bikes);
        });
    }
}

// Initialize bike service
const bikeService = new BikeService();
