import express from 'express';
import { createHospital , getAllHospitals} from '../controllers/hospital.controller.js';


const router = express.Router();

router.post('/',createHospital);
router.post('/getAllHospitals',getAllHospitals);
export default router;