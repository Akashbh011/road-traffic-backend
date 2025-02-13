import { TrafficStatus } from "../models/trafficstatus.model.js";

export const addOrUpdateTrafficStatus = async (req, res) => {
  const { latitude,longitude, category } = req.body;
   
  if (!latitude || !longitude || !category) {
    return res.status(400).json({ error: 'Location and status are required' });
  }
  
  try {
      const newEntry = new TrafficStatus({ latitude,longitude, category });
      await newEntry.save();
      return res.status(201).json({ message: 'Entry created successfully', data: newEntry });
  } catch (error) {
    console.error('Error in addOrUpdateTrafficStatus:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};


export const getTrafficStatus = async (req, res) => {
  try {
    // Retrieve all entries from the TrafficStatus collection
    const trafficEntries = await TrafficStatus.find();

    // Return the entries in the response
    res.status(200).json(trafficEntries);
  } catch (error) {
    console.error('Error in getTrafficStatus:', error);
    res.status(500).json({ error: 'An error occurred while fetching traffic statuses' });
  }
};
