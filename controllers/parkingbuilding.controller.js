

import { ParkingBuilding } from "../models/parkingbuilding.model.js";


export const createParkingBuilding = async (req, res) => {
    try {
        const {
            longitude,
            latitude,
            name,
            parkingCapacity
        } = req.body;

        const newParkingBuilding = new ParkingBuilding({
            longitude,
            latitude,
            name,
            parkingCapacity
        });

        const savedParkingBuilding = await newParkingBuilding.save();
        res.status(201).json({
            message: 'Parking building created successfully!',
            data: savedParkingBuilding
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating parking building.',
            error: error.message
        });
    }
};