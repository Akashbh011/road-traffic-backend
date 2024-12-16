import express from 'express';
import { createBanquetHall , getAllBanquetHalls, getAllBanquetHallsByTime } from '../controllers/banquethall.controller.js';

const router = express.Router();

router.post('/',createBanquetHall);
router.get('/getAllBanquetHalls',getAllBanquetHalls);
router.get('/getAllBanquetHallsByTime',getAllBanquetHallsByTime);
export default router;