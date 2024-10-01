import multer from "multer";
import axios from "axios";
import { User } from "../models/user.model.js";
import FormData from "form-data"; 
import { Image } from "../models/image.model.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder in Cloudinary
    format: async () => "jpg", // Change to match your image type (png, jpg, etc.)
    public_id: (req, file) => file.originalname, // Use the original file name
  },
});

const upload = multer({ storage });

const getPrediction = async (req, res) => {
  try {
    const { longitude, latitude, userId } = req.body; // Extract additional info from request body

    // Get the uploaded image from Multer
    const uploadedImage = req.file;

    // Check if uploadedImage exists
    if (!uploadedImage) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log("uploaded image url details : ", uploadedImage.secure_url);

    // Create FormData and append the image for Flask API
    const formData = new FormData();
    // Use the image buffer directly since you're not saving it manually
    formData.append('file', uploadedImage.buffer, uploadedImage.originalname);

    // Send the image to the Flask API for prediction
    const flaskResponse = await axios.post('http://127.0.0.1:3003/predict', formData, {
      headers: { ...formData.getHeaders() },
    });

    const prediction = flaskResponse.data.prediction; // Get the prediction result

    if (prediction === 'pothole') {

      res.json({
        message: "Image uploaded and saved successfully",
        prediction: prediction,  // Send the prediction result
       
      });


      // Save the image data to MongoDB
      const user = await User.findOne({ userId });
      const newuserId = user._id;
      console.log("the url which we want :",uploadedImage.secure_url);

      const newImage = new Image({
        src: uploadedImage.secure_url, // Make sure you have the secure URL after uploading to Cloudinary
        user: newuserId, // User ID
        longitude: longitude, // Longitude
        latitude: latitude, // Latitude
      });

      const savedImage = await newImage.save(); // Save image document

      res.json({
        message: "Image uploaded and saved successfully",
        prediction: prediction,  // Send the prediction result
       
      });
    } else {
      // If the prediction is not 'pothole', skip saving the image
      res.json({
        message: "Prediction is not 'pothole', image not saved",
        prediction: prediction,
      });
    }
  } catch (error) {
    console.error("Error processing the image:", error);
    res.status(500).json({ error: 'Error processing image and prediction' });
  }
};

export default getPrediction;

