import express from 'express';
const router = express.Router();
import { getUserData } from '../controllers/user.controller.js';
import { makeAdmin } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

router.get('/',verifyToken,getUserData); 
router.put('/:id/make-admin',verifyToken,makeAdmin);

export default router;
