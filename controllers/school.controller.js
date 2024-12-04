
import { School } from "../models/school.model.js"; 


export const createSchool = async (req, res) => {
    try {
        const { latitude, longitude, schoolName, startTime, endTime, numberOfSchoolBuses, numberOfStudents } = req.body;

        const newSchool = new School({
            latitude,
            longitude,
            schoolName,
            startTime,
            endTime,
            numberOfSchoolBuses,
            numberOfStudents
        });


        const savedSchool = await newSchool.save();

        res.status(201).json({
            message: 'School created successfully',
            data: savedSchool
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating school',
            error: error.message
        });
    }
};


export const getAllSchools = async (req, res) => {
    try {
        // Fetch all school documents from the database
        const schools = await School.find({});
        
        // Send a successful response with the data
        res.status(200).json({
            message: 'Schools fetched successfully!',
            data: schools
        });
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching schools.',
            error: error.message
        });
    }
};
