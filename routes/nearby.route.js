import express from 'express';
const router = express.Router();
import { getNearbyPlaceData,findNearbyLocations,findNearbyHotspots } from '../controllers/nearby.controller.js';

router.post('/',getNearbyPlaceData); 
router.post('/hotspots',findNearbyLocations); 
router.post('/hotspotNearby',findNearbyHotspots); 
export default router;
