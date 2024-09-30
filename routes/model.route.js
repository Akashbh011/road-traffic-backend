import express from 'express';
import getPrediction from '../controllers/model.controller.js';
import multer from 'multer';  // Import multer here

const router = express.Router();

const upload = multer(); // Configure multer to handle file uploads

router.post("/", upload.single('image'), getPrediction);  // Add multer middleware

export default router;
