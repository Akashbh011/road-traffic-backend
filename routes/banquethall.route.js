import express from 'express';
import { createBanquetHall , getAllBanquetHalls } from '../controllers/banquethall.controller.js';

const router = express.Router();

router.post('/',createBanquetHall);
router.post('/getAllBanquetHalls',getAllBanquetHalls);

export default router;