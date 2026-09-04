import express from "express";

import {
    login,
    cadastrar
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/cadastro", cadastrar);

export default router;