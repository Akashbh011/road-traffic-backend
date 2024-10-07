import express from 'express';
import getPrediction from '../controllers/model.controller.js';
<<<<<<< HEAD
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();


router.post("/", upload.single('image'), getPrediction); 
=======
import { upload } from '../controllers/model.controller.js'; // Import the Cloudinary `upload` middleware

const router = express.Router();

router.post("/", upload.single('image'), getPrediction);  // Use the Cloudinary `upload`
>>>>>>> 818e49f54f73e96660a9a6a248487740359416ad

export default router;

