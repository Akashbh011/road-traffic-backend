import { TrafficHotspot } from "../models/traffichotspot.model.js";

// Controller function to create a new traffic hotspot entry
export const createTrafficHotspot = async (req, res) => {
    try {
        const { latitude, longitude, landmark } = req.body;

        // Create a new TrafficHotspot document
        const newHotspot = new TrafficHotspot({
            latitude,
            longitude,
            landmark
        });

        const savedHotspot = await newHotspot.save();

        res.status(201).json({
            message: 'Traffic hotspot created successfully',
            data: savedHotspot
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating traffic hotspot',
            error: error.message
        });
    }
};