import mongoose from 'mongoose';

// Define the schema
const banquetHallSchema = new mongoose.Schema({
    hallName: {
        type: String, // Name of the hall
        required: true
    },
    latitude: {
        type: String, // Latitude as string to handle precision
        required: true
    },

    longitude: {
        type: String, // Longitude as string to handle precision
        required: true
    },
    eventName: {
        type: String, // Name of the event
        required: true
    },
    eventStartTime: {
        type: Date, // Start date and time of the event
        required: true
    },
    eventEndTime: {
        type: Date, // End date and time of the event
        required: true
    },
    parkingLimit: {
        type: Number, // Maximum parking capacity
        required: true,
        min: 0 // Minimum value is 0
    },
    numberOfVehiclesExpected: {
        type: Number, // Expected number of vehicles
        required: true,
        min: 0 // Minimum value is 0
    },
    hallCapacity: {
        type: Number, // Maximum hall capacity for people
        required: true,
        min: 0 // Minimum value is 0
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the model
export const BanquetHall = mongoose.model('BanquetHall', banquetHallSchema);

