import express from 'express';
import { createParkingBuilding,getAllParkingBuildings } from '../controllers/parkingbuilding.controller.js';


const router = express.Router();

router.post('/', createParkingBuilding);
router.get('/getAllParkingBuildings', getAllParkingBuildings);

export default router;