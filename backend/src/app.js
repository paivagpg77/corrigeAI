import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import provaRoutes from "./routes/provaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/provas", provaRoutes);

app.get("/", (req, res) => {
    res.json({
        mensagem: "API CorrigeAI funcionando!"
    });
});

export default app;