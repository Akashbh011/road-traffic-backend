import express from 'express';
import { getPotholeDatamodel } from '../controllers/getPotholeDatamodel.controller.js';

const router = express.Router();

router.get('/', getPotholeDatamodel); 


export default router;
