
import { Complaint } from '../models/complaint.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Function to handle user registration
export const registerComplaint = async (req, res) => {
  console.log("Hi");
  try {
    const {  lng, lat , category, description } = req.body;
   
    const uploadedImage = req.file;
    if (!uploadedImage) {
      const newComplaintnoImg  = new Complaint({longitude:longitude ,latitude: latitude ,src:"",category:category, description });
      const savedCompaintnoImg = await newComplaintnoImg.save();
      console.log("New Complaint has been saved !");
      res.status(201).json(savedCompaintnoImg);
      return;
    }
  
    const cloudurl = await uploadOnCloudinary(uploadedImage.path)

      // await User.updateOne(
      //   { _id: userId }, 
      //   { $inc: { citizen_score: 50 } }
      // );

    console.log("the url of complaint :",cloudurl.secure_url);

    const newComplaint = new Complaint({longitude:lng ,latitude: lat ,src:cloudurl.secure_url,category:category, description });
    const savedCompaint = await newComplaint.save();
    console.log("New Complaint has been saved !");

    res.status(201).json(savedCompaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error raising complaint' });
  }
};

//  export const login /reg



export const getComplaintDatamodel = async (req, res) => {
    try {
      console.log("this is the backend call !");
        const complaints = await Complaint.find({});
        res.json(complaints);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching complaints' });
    }
  };
  



  