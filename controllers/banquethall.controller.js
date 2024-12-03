import { BanquetHall } from "../models/banquethall.model.js";


 export const createBanquetHall = async(req, res) =>{
    try {
        const {
            hallName,
            latitude,
            longitude,
            eventName,
            eventStartTime,
            eventEndTime,
            parkingLimit,
            numberOfVehiclesExpected,
            hallCapacity
        } = req.body;

        // Create a new banquet hall document
        const newBanquetHall = new BanquetHall({
            hallName,
            latitude,
            longitude,
            eventName,
            eventStartTime,
            eventEndTime,
            parkingLimit,
            numberOfVehiclesExpected,
            hallCapacity
        });

        // Save to the database
        const savedBanquetHall = await newBanquetHall.save();
        res.status(201).json({ message: 'Banquet Hall created successfully!', data: savedBanquetHall });
    } catch (error) {
        res.status(400).json({ message: 'Error creating Banquet Hall.', error: error.message });
    }
 }
 