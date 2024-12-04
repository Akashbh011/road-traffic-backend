import express from 'express';
import { createSchool,getAllSchools } from '../controllers/school.controller.js';

const router = express.Router();

router.post('/',createSchool);
router.post('/getAllSchools',getAllSchools);

export default router;