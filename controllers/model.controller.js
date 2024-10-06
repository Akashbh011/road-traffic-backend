import multer from "multer";
import axios from "axios";
import { User } from "../models/user.model.js";
import FormData from "form-data"; 
import { Image } from "../models/image.model.js";
import {cloudinary, storage } from "../mongoose/cloudinaryConfig.js";


export const upload = multer({ storage });

const getPrediction = async (req, res) => {
  try {
    const { longitude, latitude, username } = req.body; // Extract additional info from request body
    console.log(username);
    // Get the uploaded image from Multer
    const uploadedImage = req.file;

    // Check if uploadedImage exists
    if (!uploadedImage) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log("uploaded image  details : ", uploadedImage);
    const pathneeded=uploadedImage.path;

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

      

      console.log("the url which we want :",pathneeded);
      // Save the image data to MongoDB
      const user = await User.findOne({ name:username });
      console.log(user);
      const newuserId = user._id;
      

      const newImage = new Image({
        src: pathneeded, // Make sure you have the secure URL after uploading to Cloudinary
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

