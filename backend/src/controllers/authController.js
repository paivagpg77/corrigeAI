import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../prisma.js";

function gerarToken(usuario) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error(
            "JWT_SECRET não configurado no .env"
        );
    }

    return jwt.sign(
        {
            id: usuario.id,
            tipo: usuario.tipo,
            escolaId: usuario.escolaId
        },
        secret,
        {
            expiresIn: "8h"
        }
    );
}

export async function login(req, res) {
    try {
        const {
            email,
            senha
        } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem:
                    "E-mail e senha são obrigatórios."
            });
        }

        const emailNormalizado =
            email.trim().toLowerCase();

        const usuario =
            await prisma.usuario.findUnique({
                where: {
                    email: emailNormalizado
                },
                include: {
                    escola: {
                        select: {
                            id: true,
                            nome: true
                        }
                    }
                }
            });

        if (!usuario) {
            return res.status(401).json({
                mensagem:
                    "E-mail ou senha incorretos."
            });
        }

        if (!usuario.ativo) {
            return res.status(403).json({
                mensagem:
                    "Usuário está desativado."
            });
        }

        const senhaValida =
            await bcrypt.compare(
                senha,
                usuario.senha
            );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem:
                    "E-mail ou senha incorretos."
            });
        }

        const token =
            gerarToken(usuario);

        return res.json({
            mensagem:
                "Login realizado com sucesso.",

            token,

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                ativo: usuario.ativo,
                escolaId: usuario.escolaId,
                escola: usuario.escola
            }
        });

    } catch (error) {
        console.error(
            "Erro no login:",
            error
        );

        return res.status(500).json({
            mensagem:
                "Erro interno ao realizar login."
        });
    }
}

export async function cadastrar(req, res) {
    try {
        const {
            nome,
            email,
            senha,
            tipo
        } = req.body;

        if (
            !nome ||
            !email ||
            !senha ||
            !tipo
        ) {
            return res.status(400).json({
                mensagem:
                    "Nome, e-mail, senha e tipo são obrigatórios."
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                mensagem:
                    "A senha deve ter pelo menos 6 caracteres."
            });
        }

        const tiposValidos = [
            "PROFESSOR",
            "COORDENADOR",
            "DIRETOR"
        ];

        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                mensagem:
                    "Tipo de usuário inválido."
            });
        }

        const emailNormalizado =
            email.trim().toLowerCase();

        const existente =
            await prisma.usuario.findUnique({
                where: {
                    email: emailNormalizado
                }
            });

        if (existente) {
            return res.status(409).json({
                mensagem:
                    "Já existe um usuário com esse e-mail."
            });
        }

        const senhaHash =
            await bcrypt.hash(
                senha,
                10
            );

        const usuario =
            await prisma.usuario.create({
                data: {
                    nome: nome.trim(),
                    email: emailNormalizado,
                    senha: senhaHash,
                    tipo
                }
            });

        return res.status(201).json({
            mensagem:
                "Usuário cadastrado com sucesso.",

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                ativo: usuario.ativo,
                escolaId: usuario.escolaId
            }
        });

    } catch (error) {
        console.error(
            "Erro no cadastro:",
            error
        );

        return res.status(500).json({
            mensagem:
                "Erro interno ao cadastrar usuário."
        });
    }
}

export async function me(req, res) {
    try {
        const usuarioId =
            Number(req.usuario.id);

        const usuario =
            await prisma.usuario.findUnique({
                where: {
                    id: usuarioId
                },
                include: {
                    escola: {
                        select: {
                            id: true,
                            nome: true
                        }
                    }
                }
            });

        if (!usuario) {
            return res.status(404).json({
                mensagem:
                    "Usuário não encontrado."
            });
        }

        return res.json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                ativo: usuario.ativo,
                escolaId: usuario.escolaId,
                escola: usuario.escola
            }
        });

    } catch (error) {
        console.error(
            "Erro ao buscar usuário:",
            error
        );

        return res.status(500).json({
            mensagem:
                "Erro interno ao buscar usuário."
        });
    }
}