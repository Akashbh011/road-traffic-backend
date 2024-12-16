import express from 'express';
import { addPathInfo, getLast8DaysData } from '../controllers/pathinfo.controller.js';
const router = express.Router();

router.post('/',addPathInfo); 
router.get('/getPastPathData',getLast8DaysData); 
export default router;
