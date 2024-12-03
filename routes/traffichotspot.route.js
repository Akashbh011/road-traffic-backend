import express from 'express';
import { createTrafficHotspot } from '../controllers/traffichotspot.controller.js';

const router = express.Router();

router.post('/',createTrafficHotspot);

export default router;