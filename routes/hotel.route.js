import express from 'express';
import { createHotel , getAllHotels} from '../controllers/hotel.controller.js';


const router = express.Router();

router.post('/',createHotel);
router.get('/getAllHotels',getAllHotels);
export default router;