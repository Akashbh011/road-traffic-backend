import axios from "axios";
import FormData from "form-data"; 
import { Image } from "../models/image.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { User } from "../models/user.model.js";


export const getPrediction = async (req, res) => {
  try {
    const { lng,lat } = req.body; 
    
    const userId = req.userId;
    

    const uploadedImage = req.file;

    if (!uploadedImage) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = uploadedImage.path

    const formData = new FormData();


    formData.append('file', fs.createReadStream(filePath));

    const flaskResponse = await axios.post('http://127.0.0.1:3003/predict', formData, {
        headers: { ...formData.getHeaders() },
    });

    const prediction = flaskResponse.data.prediction; // Get the prediction result

    if (prediction === 'pothole') {

      const cloudurl = await uploadOnCloudinary(uploadedImage.path)

      await User.updateOne(
        { _id: userId }, 
        { $inc: { citizen_score: 50 } }
      );

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
        prediction: prediction,  
      });
      
    } else {

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


export const getPotholeDatamodel = async (req, res) => {
    try {
        const images = await Image.find({});
        res.json(images);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching pothole images' });
    }
  };


