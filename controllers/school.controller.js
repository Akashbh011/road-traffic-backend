
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
        res.status(200).json(schools);
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching schools.',
            error: error.message
        });
    }
};

export const getAllSchoolsByTime = async (req, res) => {
    try {
        const currentTime = new Date(); // Get current time

        // Calculate the 20-minute range in milliseconds
        const rangeStart = new Date(currentTime.getTime() - 20 * 60 * 1000); // 20 minutes before now

        // Query schools that meet the specified conditions
        const schools = await School.find({
            $or: [
                {
                    // Schools that opened 0-20 minutes before now
                    startTime: { $gte: rangeStart, $lt: currentTime }
                },
                {
                    // Schools closing in the range 0-20 minutes before or after now
                    endTime: { $gte: rangeStart, $lte: new Date(currentTime.getTime() + 20 * 60 * 1000) }
                }
            ]
        });

        res.status(200).json(schools);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching schools by time.',
            error: error.message
        });
    }
};
