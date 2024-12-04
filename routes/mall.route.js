import express from 'express';
import { createMall ,getAllMalls } from '../controllers/mall.controller.js';

const router = express.Router();

router.post('/',createMall);
router.post('/getAllMalls',getAllMalls);

export default router;