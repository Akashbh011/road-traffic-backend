import mongoose from 'mongoose';

// Define the schema
const trafficStatusSchema = new mongoose.Schema({
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    category: {
        type: String, 
        required: true
    }
}, { timestamps: true }); 

// Create the model
export const TrafficStatus = mongoose.model('TrafficStatus', trafficStatusSchema);
