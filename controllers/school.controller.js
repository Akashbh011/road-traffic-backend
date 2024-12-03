
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