import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({

    latitude: {
        type: String, 
        required: true
    },

    longitude: {
        type: String, 
        required: true
    },

    schoolName: {
        type: String,
        required: true
    },

    startTime: {
        type: String, 
        required: true
    },

    endTime: {
        type: String, 
        required: true
    },

    numberOfSchoolBuses: {
        type: Number, 
        required: true,
        min: 0 
    },

    numberOfStudents: {
        type: Number, 
        required: true,
        min: 0 
    }

}, { timestamps: true }); 


export const School = mongoose.model('School', schoolSchema);
