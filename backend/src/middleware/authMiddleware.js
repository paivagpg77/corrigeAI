import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Token não informado."
            });
        }

        const partes = authHeader.split(" ");

        if (partes.length !== 2 || partes[0] !== "Bearer") {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Formato de token inválido."
            });
        }

        const token = partes[1];

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;

        next();

    } catch (error) {

        console.error("ERRO AUTH:", error);

        return res.status(401).json({
            sucesso: false,
            mensagem: "Token inválido ou expirado."
        });
    }
}

export default authMiddleware;