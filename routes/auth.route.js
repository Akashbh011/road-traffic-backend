import express from 'express';
import { loginUser, logout, registerUser } from '../controllers/auth.controller.js'; // Import your controller function for handling registration

const router = express.Router();

// Define the route for user registration
router.post('/register', registerUser); // Assuming your registration handler is named `registerUser`
router.post('/login', loginUser);
router.post('/logout',logout)

export default router;
