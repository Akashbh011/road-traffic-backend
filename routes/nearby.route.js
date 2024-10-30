import express from 'express';
const router = express.Router();
import { getNearbyPlaceData } from '../controllers/nearby.controller.js';


router.post('/',getNearbyPlaceData); 

export default router;
