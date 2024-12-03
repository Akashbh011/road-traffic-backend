import express from 'express';
import { ParkingBuilding } from '../models/parkingbuilding.model.js';


const router = express.Router();

router.post('/', ParkingBuilding);

export default router;