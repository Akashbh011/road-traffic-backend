import express from 'express';
import { createHotel , getAllHotels} from '../controllers/hotel.controller.js';


const router = express.Router();

router.post('/',createHotel);
router.get('/get',getAllHotels);
export default router;