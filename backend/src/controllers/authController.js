import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Email e senha são obrigatórios."
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        });

        if (!usuario) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Email ou senha incorretos."
            });
        }

        if (!usuario.ativo) {
            return res.status(403).json({
                sucesso: false,
                mensagem: "Usuário desativado."
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Email ou senha incorretos."
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        return res.json({
            sucesso: true,
            mensagem: "Login realizado com sucesso.",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            }
        });

    } catch (error) {
        console.error("ERRO LOGIN:", error);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
}


async function cadastrar(req, res) {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nome, email, senha e tipo são obrigatórios."
            });
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        });

        if (usuarioExistente) {
            return res.status(409).json({
                sucesso: false,
                mensagem: "Este email já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                tipo
            },
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                ativo: true
            }
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: "Usuário cadastrado com sucesso.",
            usuario
        });

    } catch (error) {
        console.error("ERRO CADASTRO:", error);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
}


async function me(req, res) {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: req.usuario.id
            },
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                ativo: true
            }
        });

        if (!usuario) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Usuário não encontrado."
            });
        }

        return res.json({
            sucesso: true,
            usuario
        });

    } catch (error) {
        console.error("ERRO ME:", error);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
}


export {
    login,
    cadastrar,
    me
};