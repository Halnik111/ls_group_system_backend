import express from "express";
import {addWork, deleteWork, getAllActiveWork, getAllWork, getWork, modifyWork} from "../controllers/workController.js";

const router = express.Router()

router.get('/getAll', getAllWork);
router.get('/getAllActive', getAllActiveWork);
router.get('/getWork', getWork);
router.put('/modifyWork', modifyWork);
router.delete('/deleteWork', deleteWork);
router.post('/addWork', addWork);

export default router;