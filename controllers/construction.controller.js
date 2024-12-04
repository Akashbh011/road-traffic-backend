
import { Construction } from "../models/construction.model.js";



export const createConstructionProject = async (req, res) => {
    try {
      const { projectName, vendorName, coordinates, startDate, expectedEndDate, status } = req.body;
  
      if (!projectName || !vendorName || !startDate || !expectedEndDate || !status || !coordinates) {
        throw new Error("All fields are required, including coordinates.");
      }
  
      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        throw new Error("Coordinates must be an array of at least two points in [lng, lat] format.");
      }
      
      coordinates.forEach((point, index) => {
        if (!Array.isArray(point) || point.length !== 2 || isNaN(point[0]) || isNaN(point[1])) {
          throw new Error(`Coordinate at index ${index} must be a valid [lng, lat] array.`);
        }
      });
      
  
      const newConstruction = new Construction({
        projectName,
        vendorName,
        coordinates, // Save polyline as coordinates in the DB
        startDate,
        expectedEndDate,
        status,
      });
  
      const savedConstruction = await newConstruction.save();
  
      res.status(201).json({
        message: "Construction project created successfully!",
        data: savedConstruction,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating construction project.",
        error: error.message,
      });
    }
  };


export const getAllConstructionProjects = async (req, res) => {
    try {
        // Fetch all construction project documents
        const constructionProjects = await Construction.find({});
        
        // Send a successful response with the data
        res.status(200).json({
            message: 'Construction projects fetched successfully!',
            data: constructionProjects
        });
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching construction projects.',
            error: error.message
        });
    }
};
