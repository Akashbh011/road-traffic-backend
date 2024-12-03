import express from 'express';
import { createDiversion } from '../controllers/diversion.controller.js';


const router = express.Router();

router.post('/',createDiversion);

export default router;