import { TrafficStatus } from "../models/trafficstatus.model.js";

export const addOrUpdateTrafficStatus = async (req, res) => {
    const { name, status } = req.body;
   
    if (!name || !status) {
      return res.status(400).json({ error: 'Name and status are required' });
    }
  
    try {
     
      const existingEntry = await TrafficStatus.findOne({ name });
  
      if (existingEntry) {
       
        existingEntry.status = status;
        await existingEntry.save();
        return res.status(200).json({ message: 'Status updated successfully', data: existingEntry });
      } else {
 
        const newEntry = new TrafficStatus({ name, status });
        await newEntry.save();
        return res.status(201).json({ message: 'Entry created successfully', data: newEntry });
      }
    } catch (error) {
      console.error('Error in addOrUpdateTrafficStatus:', error);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  };



  export const getTrafficStatus = async (req, res) => {
    const { names } = req.body;
  
    // Check if the input is valid
    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: 'A valid list of names is required' });
    }
  
    try {
      // Extract 'name' property from the list of objects
      const nameList = names.map((item) => item.name);
  
      // Find traffic status for the extracted names
      const trafficStatus = await TrafficStatus.find({ name: { $in: nameList } });
  
      // Send the full array of traffic status objects
      res.status(200).json({ trafficStatus });
    } catch (error) {
      console.error('Error in getTrafficStatus:', error);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  };
  