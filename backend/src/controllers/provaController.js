import prisma from "../prisma.js";

async function criarProva(req, res) {
    try {
        const {
            titulo,
            totalQuestoes,
            professorId,
            disciplinaId
        } = req.body;

        if (!titulo || !totalQuestoes || !professorId || !disciplinaId) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Título, total de questões, professor e disciplina são obrigatórios."
            });
        }

        const prova = await prisma.prova.create({
            data: {
                titulo,
                totalQuestoes: Number(totalQuestoes),
                professorId: Number(professorId),
                disciplinaId: Number(disciplinaId)
            },
            include: {
                professor: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                disciplina: true
            }
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: "Prova criada com sucesso.",
            prova
        });

    } catch (error) {
        console.error("ERRO AO CRIAR PROVA:", error);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
}


async function listarProvas(req, res) {
    try {
        const provas = await prisma.prova.findMany({
            orderBy: {
                criadoEm: "desc"
            },
            include: {
                professor: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                disciplina: true,
                questoes: true
            }
        });

        return res.json({
            sucesso: true,
            total: provas.length,
            provas
        });

    } catch (error) {
        console.error("ERRO AO LISTAR PROVAS:", error);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
}


export {
    criarProva,
    listarProvas
};