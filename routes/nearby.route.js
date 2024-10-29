import express from 'express';
const router = express.Router();
import { getNearbyplacedata } from '../controllers/getNearbyplacedata.controller.js';


router.post('/',getNearbyplacedata); 

export default router;
