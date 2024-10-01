import express from 'express';
import { registerComplaint } from '../controllers/complaint.controller.js'; // Import your controller function for handling registration

const router = express.Router();

// Define the route for user registration
router.post('/', registerComplaint); // Assuming your registration handler is named `registerUser`

export default router;
