import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({

    latitude: {
        type: String, // Latitude as string to handle precision
        required: true
    },

    longitude: {
        type: String, // Longitude as string to handle precision
        required: true
    },

    schoolName: {
        type: String, // School name
        required: true
    },

    startTime: {
        type: Date, // Start time in HH:MM format
        required: true
    },

    endTime: {
        type: String, // End time in HH:MM format
        required: true
    },

    numberOfSchoolBuses: {
        type: Number, // Number of school buses
        required: true,
        min: 0 // Minimum value is 0
    },

    numberOfStudents: {
        type: Number, // Number of students
        required: true,
        min: 0 // Minimum value is 0
    }

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields


export const School = mongoose.model('School', schoolSchema);
