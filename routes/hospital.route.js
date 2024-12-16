import express from 'express';
import { createHospital , getAllHospitals} from '../controllers/hospital.controller.js';


const router = express.Router();

router.post('/',createHospital);
router.get('/getAllHospitals',getAllHospitals);
export default router;