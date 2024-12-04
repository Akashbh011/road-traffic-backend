import express from 'express';
import { createDiversion , getAllDiversions} from '../controllers/diversion.controller.js';


const router = express.Router();

router.post('/',createDiversion);
router.post('/getAllDiversions',getAllDiversions);
export default router;