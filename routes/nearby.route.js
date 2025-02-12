import express from 'express';
const router = express.Router();
import { getNearbyPlaceData,getNearbySpots, createTrafficHotspot  } from '../controllers/nearby.controller.js';

router.post('/',createTrafficHotspot); 
router.post('/schools',getNearbyPlaceData); 
router.post('/hotspots',getNearbySpots); 
export default router;
