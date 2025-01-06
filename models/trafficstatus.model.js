import mongoose from 'mongoose';

// Define the schema
const trafficStatusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String, 
        required: true
    }
}, { timestamps: true }); 

// Create the model
export const TrafficStatus = mongoose.model('TrafficStatus', trafficStatusSchema);
