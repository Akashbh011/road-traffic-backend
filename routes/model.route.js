import express from 'express';
import {getPrediction,getPotholeDatamodel} from '../controllers/model.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();


router.post("/",verifyToken,upload.single('image'), getPrediction);
router.get("/getPotholeData",verifyToken,getPotholeDatamodel);



export default router;

