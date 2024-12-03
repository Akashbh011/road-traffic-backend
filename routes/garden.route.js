import express from 'express';
import { createGarden } from '../controllers/garden.controller.js';

const router = express.Router();

router.post('/',createGarden);

export default router;