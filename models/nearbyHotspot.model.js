import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

export const hotspotLocation = mongoose.model('hotspotLocation', LocationSchema);
