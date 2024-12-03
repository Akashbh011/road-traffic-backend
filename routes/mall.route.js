import express from 'express';
import { createMall } from '../controllers/mall.controller.js';

const router = express.Router();

router.post('/',createMall);

export default router;