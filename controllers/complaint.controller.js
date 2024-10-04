import { Complaint } from '../models/complaint.model.js';

// Function to handle user registration
export const registerComplaint = async (req, res) => {
  try {
    const {  user,Longitude , Latitude , complaint } = req.body;

    // Check if the user already exists
    
    
    const newComplaint = new Complaint({ user,Longitude , Latitude , complaint });
    const savedCompaint = await newComplaint.save();
    console.log("new complaint has been saved !");
    // console.log(savedUser);

    res.status(201).json(savedCompaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error raising complaint' });
  }
};

//  export const login /reg
