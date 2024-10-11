import express from 'express';
import { getComplaintDatamodel } from '../controllers/getComplaintDatamodel.controller.js';

const router = express.Router();

router.get('/', getComplaintDatamodel); 


export default router;
