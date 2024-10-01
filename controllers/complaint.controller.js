import { Complaint } from '../models/complaint.model.js';

// Function to handle user registration
export const registerComplaint = async (req, res) => {
  try {
    const { longitude , latitude , complaint } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }
    
    const newUser = new User({ name, phoneNumber, password});
    const savedUser = await newUser.save();
    console.log("new user has been saved !");
    // console.log(savedUser);

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

//  export const login /reg