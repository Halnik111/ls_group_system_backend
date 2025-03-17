import express from "express";
import {test, uploadImage} from '../controllers/apiController.js';
import multer from "multer";
import * as path from "node:path";

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    fileName: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalName));
    }
});

// const upload = multer({storage: storage});
// if (!fs.existsSync('uploads')) {
//     fs.mkdirSync('uploads');
// }

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 5 * 1024 * 1024}
});

router.get('/test', test);
router.post('/upload', upload.single('files'), uploadImage);


export default router;