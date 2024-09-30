import multer from "multer";
import axios from "axios";
import FormData from "form-data"; 


const storage = multer.memoryStorage();
const upload = multer({ storage });


const getPrediction = async (req, res) => {
    try {
      const image = req.file.buffer;
      console.log("You have reached the backend successfully");
  
      // Create FormData and append the image
      const formData = new FormData();
      formData.append('file', image, req.file.originalname); // 'file' is the key Flask expects
  
      // Send the image to the Flask API
      const response = await axios.post('http://127.0.0.1:3003/predict', formData, {
        headers: {
          ...formData.getHeaders(),  // Set correct headers for multipart/form-data
        },
      });
  
      res.json({ prediction: response.data.prediction });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Error processing the image' });
    }
  };

export default getPrediction;