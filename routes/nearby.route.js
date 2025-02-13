import express from 'express';
const router = express.Router();
import { getNearbyPlaceData,getNearbySpots, createTrafficHotspot ,getAllSpots } from '../controllers/nearby.controller.js';

router.get('/',createTrafficHotspot); 
router.post('/schools',getNearbyPlaceData); 
router.post('/hotspots',getNearbySpots);
router.get('/spots',getAllSpots);

export default router;
