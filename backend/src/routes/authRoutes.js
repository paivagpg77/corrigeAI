import express from "express";

import {
    login,
    cadastrar,
    me
} from "../controllers/authController.js";

import {
    autenticar
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/cadastro", cadastrar);

router.get("/me", autenticar, me);

export default router;