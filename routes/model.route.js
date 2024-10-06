import express from 'express';
import getPrediction from '../controllers/model.controller.js';
import { upload } from '../controllers/model.controller.js'; // Import the Cloudinary `upload` middleware

const router = express.Router();

router.post("/", upload.single('image'), getPrediction);  // Use the Cloudinary `upload`

export default router;

