import express from 'express';
import { addPathInfo, getCalendarData, getFestivalData, getLastFourWeekDayData, predictTraffic } from '../controllers/pathinfo.controller.js';
const router = express.Router();

router.post('/',addPathInfo); 
router.get('/getCalendarData', getCalendarData);
router.get('/getFestivalData',getFestivalData);
router.get('/getLastFourWeek',getLastFourWeekDayData);
router.get('/predictTraffic',predictTraffic);
export default router;
