import express from 'express';
import { createMall ,getAllMalls } from '../controllers/mall.controller.js';

const router = express.Router();

router.post('/',createMall);
router.get('/get',getAllMalls);

export default router;