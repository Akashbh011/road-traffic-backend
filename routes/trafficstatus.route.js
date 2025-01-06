import express from 'express';
import { addOrUpdateTrafficStatus, getTrafficStatus } from '../controllers/status.controller.js';

const router = express.Router();

router.post('/',addOrUpdateTrafficStatus);
router.post('/getTrafficStatus',getTrafficStatus);


export default router;