import express from "express";
import {addMaterial, deleteMaterial, getMaterial} from "../controllers/materialController.js";


const router = express.Router()

router.get('/material/getMaterial', getMaterial)
router.post('/material/addMaterial', addMaterial)
router.delete('/material/deleteMaterial', deleteMaterial)

export default router;