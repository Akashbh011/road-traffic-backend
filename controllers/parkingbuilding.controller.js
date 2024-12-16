

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


export const getAllParkingBuildings = async (req, res) => {
    try {
        // Fetch all parking building documents from the database
        const parkingBuildings = await ParkingBuilding.find({});
        
        // Send a successful response with the data
        res.status(200).json(parkingBuildings);
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching parking buildings.',
            error: error.message
        });
    }
};
