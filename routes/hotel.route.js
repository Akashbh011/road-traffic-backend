import express from 'express';
import { createHotel } from '../controllers/hotel.controller.js';


const router = express.Router();

router.post('/',createHotel);

export default router;