import express from 'express';
import { createConstructionProject,getAllConstructionProjects } from '../controllers/construction.controller.js';


const router = express.Router();

router.post('/',createConstructionProject);
router.post('/getAllConstructionProjects',getAllConstructionProjects);
export default router;