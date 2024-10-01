import express from 'express';
import { registerUser } from '../controllers/user.controller.js'; // Import your controller function for handling registration

const router = express.Router();

// Define the route for user registration
router.post('/', registerUser); // Assuming your registration handler is named `registerUser`

export default router;
