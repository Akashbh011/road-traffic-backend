import express from 'express';
const router = express.Router();
import { getUserData } from '../controllers/user.controller.js';
import { makeAdmin } from '../controllers/user.controller.js';

router.get('/',getUserData); 
router.put('/:id/make-admin',makeAdmin);

export default router;
