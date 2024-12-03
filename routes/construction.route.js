import express from 'express';
import { createConstructionProject } from '../controllers/construction.controller.js';


const router = express.Router();

router.post('/',createConstructionProject);

export default router;