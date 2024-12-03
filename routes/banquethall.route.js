import express from 'express';
import { createBanquetHall } from '../controllers/banquethall.controller.js';

const router = express.Router();

router.post('/',createBanquetHall);

export default router;