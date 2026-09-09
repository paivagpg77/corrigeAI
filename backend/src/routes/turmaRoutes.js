import express from "express";

import {
    criarTurma,
    listarTurmas,
    buscarTurma,
    atualizarTurma,
    excluirTurma
} from "../controllers/turmaController.js";

const router = express.Router();

router.post("/", criarTurma);
router.get("/", listarTurmas);
router.get("/:id", buscarTurma);
router.put("/:id", atualizarTurma);
router.delete("/:id", excluirTurma);

export default router;