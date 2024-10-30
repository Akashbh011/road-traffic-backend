import express from 'express';
const router = express.Router();
import { getNearbyplacedata } from '../controllers/nearby.controller.js';


router.post('/',getNearbyplacedata); 

export default router;
