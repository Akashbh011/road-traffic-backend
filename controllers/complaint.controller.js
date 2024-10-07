import { Complaint } from '../models/complaint.model.js';

// Function to handle user registration
export const registerComplaint = async (req, res) => {
  try {
    const {  userId,lng , lat , complaint,category } = req.body;

    // Check if the user already exists
    
    
    const newComplaint = new Complaint({ user:userId,longitude:lng ,latitude: lat ,complaint: complaint,category:category });
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
