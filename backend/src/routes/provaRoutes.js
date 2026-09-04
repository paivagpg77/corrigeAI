import express from "express";

import {
    criarProva,
    listarProvas
} from "../controllers/provaController.js";

const router = express.Router();

router.post("/", criarProva);
router.get("/", listarProvas);

export default router;