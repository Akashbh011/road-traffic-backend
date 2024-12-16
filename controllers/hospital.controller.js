import { Hospital } from "../models/hospital.model.js";



export const createHospital = async (req, res) => {
    try {
        const { longitude, latitude, name, capacity } = req.body;


        const newHospital = new Hospital({
            longitude,
            latitude,
            name,
            capacity
        });

        const savedHospital = await newHospital.save();

        res.status(201).json({
            message: 'Hospital created successfully',
            data: savedHospital
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating hospital',
            error: error.message
        });
    }
};


export const getAllHospitals = async (req, res) => {
    try {
        // Fetch all hospital documents from the database
        const hospitals = await Hospital.find({});
        
        // Send a successful response with the data
        res.status(200).json(hospitals);
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching hospitals',
            error: error.message
        });
    }
};
