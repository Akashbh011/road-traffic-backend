
import { Construction } from "../models/construction.model.js";



export const createConstructionProject = async (req, res) => {
    try {
      const {
        projectName,
        vendorName,
        type,
        constructionPoints,
        startDate,
        expectedEndDate,
        status
      } = req.body;

      console.log(projectName+" "+vendorName+" "+type+" "+constructionPoints+" "+startDate+" "+expectedEndDate+" "+status);
  
      if (!Array.isArray(constructionPoints) || constructionPoints.length === 0) {
        return res.status(400).json({
          message: 'Construction points must be a non-empty array of lat-lng objects.',
        });
      }
  
      // Validate each point in the diversionPoints array
      for (const point of constructionPoints) {
        if (
          typeof point.lat !== 'number' ||
          typeof point.lng !== 'number'
        ) {
          return res.status(400).json({
            message: 'Each construction point must contain valid "lat" and "lng" as numbers.',
          });
        }
      }

      console.log("hi");
      
  
      const newConstruction = new Construction({
        projectName,
        vendorName,
        type,
        constructionPoints,
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
