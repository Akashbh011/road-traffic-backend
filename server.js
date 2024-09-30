const express = require('express');
const multer = require('multer');
const cors = require('cors'); // Import cors
const axios = require('axios');
const FormData = require('form-data'); // Import FormData for multipart
const app = express();
const PORT = process.env.PORT || 3001;

// Use cors middleware
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

// Route for image upload
app.post('/api/model', upload.single('image'), async (req, res) => {
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
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
