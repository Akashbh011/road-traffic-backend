import express from 'express';
const router = express.Router();
import { getNearbyPlaceData,getNearbySpots } from '../controllers/nearby.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

router.post('/',verifyToken,getNearbyPlaceData); 
router.post('/hotspots',verifyToken,getNearbySpots); 
export default router;
