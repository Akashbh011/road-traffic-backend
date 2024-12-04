import mongoose from 'mongoose';

// Define the schema
const trafficHotspotSchema = new mongoose.Schema({
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String, 
        required: true
    },
    landmark: {
        type: String, 
        required: true
    }
}, { timestamps: true }); 

// Create the model
export const TrafficHotspot = mongoose.model('TrafficHotspot', trafficHotspotSchema);
