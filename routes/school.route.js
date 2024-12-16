import express from 'express';
import { createSchool,getAllSchools, getAllSchoolsByTime } from '../controllers/school.controller.js';

const router = express.Router();

router.post('/',createSchool);
router.get('/getAllSchools',getAllSchools);
router.get('/getAllSchoolsByTime',getAllSchoolsByTime);

export default router;