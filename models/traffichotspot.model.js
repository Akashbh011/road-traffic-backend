import mongoose from 'mongoose';

// Define the schema
const trafficHotspotSchema = new mongoose.Schema({
    latitude: {
        type: String, // Latitude of the hotspot
        required: true
    },
    longitude: {
        type: String, // Longitude of the hotspot
        required: true
    },
    landmark: {
        type: String, // Nearby landmark for identification
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the model
export const TrafficHotspot = mongoose.model('TrafficHotspot', trafficHotspotSchema);
