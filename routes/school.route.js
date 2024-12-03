import express from 'express';
import { createSchool } from '../controllers/school.controller.js';

const router = express.Router();

router.post('/',createSchool);

export default router;