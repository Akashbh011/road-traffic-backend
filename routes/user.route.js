import express from 'express';
const router = express.Router();
import { getUserData } from '../controllers/user.controller.js';


router.get('/',getUserData); 

export default router;
