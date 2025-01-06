import express from 'express';
import { createGarden , getAllGardens} from '../controllers/garden.controller.js';

const router = express.Router();

router.post('/',createGarden);
router.get('/get',getAllGardens);

export default router;