import express from 'express';
import { loginUser } from '../controllers/user.controller.js'; // Import your controller function for handling registration

const router = express.Router();

// Define the route for user registration
router.post('/', loginUser); // Assuming your registration handler is named `loginUser`

export default router;
