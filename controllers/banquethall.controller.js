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
 
 export const getAllBanquetHalls = async (req, res) => {
    try {
        console.log("Fetching all banquet halls!");
        // Fetch all banquet hall documents
        const banquetHalls = await BanquetHall.find({});
        res.json(banquetHalls); // Send the fetched banquet halls as a response
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ message: 'Error fetching banquet halls', error: error.message });
    }
};