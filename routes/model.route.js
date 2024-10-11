import express from 'express';
import {getPrediction,getPotholeDatamodel} from '../controllers/model.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();


router.post("/", upload.single('image'), getPrediction);
router.get("/getPotholeData", getPotholeDatamodel);



export default router;

