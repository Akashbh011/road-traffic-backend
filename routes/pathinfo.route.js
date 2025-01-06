import express from 'express';
import { addPathInfo, getLast8DaysData, getScoresByTime } from '../controllers/pathinfo.controller.js';
const router = express.Router();

router.post('/',addPathInfo); 
router.get('/getPastPathData',getLast8DaysData); 
router.get('/getBarGraphData', getScoresByTime)
export default router;
