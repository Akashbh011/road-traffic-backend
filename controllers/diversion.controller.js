
import { Diversion } from "../models/diversion.model.js";


export const createDiversion = async (req, res) => {
    try {
      const {
        projectName,
        vendorName,
        startDate,
        endDate,
        diversionPoints, 
        type,
      } = req.body;
  
      // Validate the input fields
      if (!Array.isArray(diversionPoints) || diversionPoints.length === 0) {
        return res.status(400).json({
          message: 'Diversion points must be a non-empty array of lat-lng objects.',
        });
      }
  
      // Validate each point in the diversionPoints array
      for (const point of diversionPoints) {
        if (
          typeof point.lat !== 'number' ||
          typeof point.lng !== 'number'
        ) {
          return res.status(400).json({
            message: 'Each diversion point must contain valid "lat" and "lng" as numbers.',
          });
        }
      }
  
      // Create the diversion document
      const newDiversion = new Diversion({
        projectName,
        vendorName,
        startDate,
        endDate,
        diversionPoints,
        type,
      });
  

      const savedDiversion = await newDiversion.save();
  
      res.status(201).json({
        message: 'Diversion created successfully!',
        data: savedDiversion,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error creating diversion.',
        error: error.message,
      });
    }
  };
  



export const getAllDiversions = async (req, res) => {
    try {
        // Fetch all diversion documents from the database
        const diversions = await Diversion.find({});
        
        // Send a successful response with the data
        res.status(200).json(diversions);
    } catch (error) {
        // Send an error response with the error message
        res.status(500).json({
            message: 'Error fetching diversions.',
            error: error.message
        });
    }
};
