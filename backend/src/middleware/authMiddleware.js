import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
    try {
        const authorization =
            req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                mensagem: "Token não informado."
            });
        }

        const partes =
            authorization.split(" ");

        if (
            partes.length !== 2 ||
            partes[0] !== "Bearer"
        ) {
            return res.status(401).json({
                mensagem: "Formato de token inválido."
            });
        }

        const token = partes[1];

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                mensagem:
                    "JWT_SECRET não configurado."
            });
        }

        const payload =
            jwt.verify(token, secret);

        req.usuario = payload;

        next();

    } catch (error) {
        console.error(
            "Erro de autenticação:",
            error.message
        );

        return res.status(401).json({
            mensagem:
                "Token inválido ou expirado."
        });
    }
}