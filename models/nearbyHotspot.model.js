import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});

export const hotspotLocation = mongoose.model('hotspotLocation', LocationSchema);
