import prisma from "../prisma.js";

export async function criarTurma(req, res) {
    try {
        const { codigo, nome, serie, turno, escolaId } = req.body;

        if (!codigo || !nome || !escolaId) {
            return res.status(400).json({
                mensagem: "Código, nome e escola são obrigatórios."
            });
        }

        const escola = await prisma.escola.findUnique({
            where: {
                id: Number(escolaId)
            }
        });

        if (!escola) {
            return res.status(404).json({
                mensagem: "Escola não encontrada."
            });
        }

        const existente = await prisma.turma.findUnique({
            where: {
                escolaId_codigo: {
                    escolaId: Number(escolaId),
                    codigo
                }
            }
        });

        if (existente) {
            return res.status(409).json({
                mensagem: "Já existe uma turma com esse código nesta escola."
            });
        }

        const turma = await prisma.turma.create({
            data: {
                codigo,
                nome,
                serie: serie || null,
                turno: turno || null,
                escolaId: Number(escolaId)
            }
        });

        return res.status(201).json({
            mensagem: "Turma criada com sucesso.",
            turma
        });

    } catch (error) {
        console.error("Erro ao criar turma:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao criar turma."
        });
    }
}

export async function listarTurmas(req, res) {
    try {
        const escolaId = Number(req.query.escolaId);

        if (!escolaId) {
            return res.status(400).json({
                mensagem: "escolaId é obrigatório."
            });
        }

        const turmas = await prisma.turma.findMany({
            where: {
                escolaId
            },
            include: {
                alunos: true,
                professores: {
                    include: {
                        professor: {
                            select: {
                                id: true,
                                nome: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                nome: "asc"
            }
        });

        return res.json(turmas);

    } catch (error) {
        console.error("Erro ao listar turmas:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao listar turmas."
        });
    }
}

export async function buscarTurma(req, res) {
    try {
        const id = Number(req.params.id);

        const turma = await prisma.turma.findUnique({
            where: {
                id
            },
            include: {
                escola: true,
                alunos: true,
                professores: {
                    include: {
                        professor: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                                tipo: true
                            }
                        }
                    }
                }
            }
        });

        if (!turma) {
            return res.status(404).json({
                mensagem: "Turma não encontrada."
            });
        }

        return res.json(turma);

    } catch (error) {
        console.error("Erro ao buscar turma:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao buscar turma."
        });
    }
}

export async function atualizarTurma(req, res) {
    try {
        const id = Number(req.params.id);
        const { codigo, nome, serie, turno } = req.body;

        const turma = await prisma.turma.findUnique({
            where: {
                id
            }
        });

        if (!turma) {
            return res.status(404).json({
                mensagem: "Turma não encontrada."
            });
        }

        const atualizada = await prisma.turma.update({
            where: {
                id
            },
            data: {
                codigo,
                nome,
                serie: serie || null,
                turno: turno || null
            }
        });

        return res.json({
            mensagem: "Turma atualizada com sucesso.",
            turma: atualizada
        });

    } catch (error) {
        console.error("Erro ao atualizar turma:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao atualizar turma."
        });
    }
}

export async function excluirTurma(req, res) {
    try {
        const id = Number(req.params.id);

        const turma = await prisma.turma.findUnique({
            where: {
                id
            }
        });

        if (!turma) {
            return res.status(404).json({
                mensagem: "Turma não encontrada."
            });
        }

        await prisma.turma.delete({
            where: {
                id
            }
        });

        return res.json({
            mensagem: "Turma excluída com sucesso."
        });

    } catch (error) {
        console.error("Erro ao excluir turma:", error);

        return res.status(500).json({
            mensagem: "Erro interno ao excluir turma."
        });
    }
}