import express from 'express';
import { predictTraffic } from '../controllers/predictTraffic.controller.js';

const router = express.Router();

router.get('/',predictTraffic);


export default router;