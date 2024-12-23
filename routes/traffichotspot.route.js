import express from 'express';
import { createTrafficHotspot ,getAllTrafficHotspots} from '../controllers/traffichotspot.controller.js';

const router = express.Router();

router.post('/',createTrafficHotspot);
router.get('/getAllTrafficHotspots',getAllTrafficHotspots);


export default router;