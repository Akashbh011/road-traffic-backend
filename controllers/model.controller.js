import axios from "axios";
import FormData from "form-data"; 
import { Image } from "../models/image.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";


const getPrediction = async (req, res) => {
  try {
    const { userId,lng,lat } = req.body; // Extract additional info from request body
    // Get the uploaded image from Multer
    const uploadedImage = req.file;
    console.log("userid is"+lat)
    // Check if uploadedImage exists
    if (!uploadedImage) {
      console.log("not");
      return res.status(400).json({ error: 'No file uploaded' });
    }

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

      const cloudurl = await uploadOnCloudinary(uploadedImage.path)

      console.log("the url which we want :",cloudurl.secure_url);

      const newImage = new Image({
        src: cloudurl.secure_url, 
        user: userId,
        longitude: lng, 
        latitude: lat, 
      });

      const savedImage = await newImage.save(); 

      res.json({
        message: "Image uploaded and saved successfully",
        prediction: prediction,  // Send the prediction result
      });

      fs.unlink((uploadedImage.path),function(err){
        if(err) console.log(err);
        else console.log("\nDeleted file");
      })

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

