import { Hospital } from "../models/Hospital.model.js";



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