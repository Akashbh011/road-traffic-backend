import express from 'express';
const router = express.Router();
import { registerEvent,getEventDatamodel } from '../controllers/event.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';


router.post('/',verifyToken,registerEvent); 
router.get('/getEventData',verifyToken,getEventDatamodel); 
export default router;
