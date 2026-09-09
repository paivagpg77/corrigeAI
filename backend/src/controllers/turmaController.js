import prisma from "../prisma.js";

export async function criarTurma(req, res) {
    try {
        const {
            codigo,
            nome,
            serie,
            turno,
            escolaId
        } = req.body;

        if (!codigo || !nome || !escolaId) {
            return res.status(400).json({
                mensagem:
                    "Código, nome e escola são obrigatórios."
            });
        }

        const escolaIdNumerico = Number(escolaId);

        if (!Number.isInteger(escolaIdNumerico)) {
            return res.status(400).json({
                mensagem: "escolaId inválido."
            });
        }

        const escola = await prisma.escola.findUnique({
            where: {
                id: escolaIdNumerico
            }
        });

        if (!escola) {
            return res.status(404).json({
                mensagem: "Escola não encontrada."
            });
        }

        const codigoNormalizado = codigo.trim();

        const turmaExistente =
            await prisma.turma.findUnique({
                where: {
                    escolaId_codigo: {
                        escolaId: escolaIdNumerico,
                        codigo: codigoNormalizado
                    }
                }
            });

        if (turmaExistente) {
            return res.status(409).json({
                mensagem:
                    "Já existe uma turma com esse código nesta escola."
            });
        }

        const turma = await prisma.turma.create({
            data: {
                codigo: codigoNormalizado,
                nome: nome.trim(),
                serie: serie || null,
                turno: turno || null,
                escolaId: escolaIdNumerico
            },
            include: {
                escola: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
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

        if (!escolaId || !Number.isInteger(escolaId)) {
            return res.status(400).json({
                mensagem: "escolaId é obrigatório."
            });
        }

        const turmas = await prisma.turma.findMany({
            where: {
                escolaId
            },
            include: {
                escola: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
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

        if (!id || !Number.isInteger(id)) {
            return res.status(400).json({
                mensagem: "ID da turma inválido."
            });
        }

        const turma = await prisma.turma.findUnique({
            where: {
                id
            },
            include: {
                escola: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
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

        const {
            codigo,
            nome,
            serie,
            turno
        } = req.body;

        if (!id || !Number.isInteger(id)) {
            return res.status(400).json({
                mensagem: "ID da turma inválido."
            });
        }

        if (!codigo || !nome) {
            return res.status(400).json({
                mensagem:
                    "Código e nome são obrigatórios."
            });
        }

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

        const codigoNormalizado = codigo.trim();

        const codigoEmUso =
            await prisma.turma.findFirst({
                where: {
                    escolaId: turma.escolaId,
                    codigo: codigoNormalizado,
                    NOT: {
                        id
                    }
                }
            });

        if (codigoEmUso) {
            return res.status(409).json({
                mensagem:
                    "Já existe outra turma com esse código nesta escola."
            });
        }

        const turmaAtualizada =
            await prisma.turma.update({
                where: {
                    id
                },
                data: {
                    codigo: codigoNormalizado,
                    nome: nome.trim(),
                    serie: serie || null,
                    turno: turno || null
                },
                include: {
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

        return res.json({
            mensagem:
                "Turma atualizada com sucesso.",
            turma: turmaAtualizada
        });

    } catch (error) {
        console.error(
            "Erro ao atualizar turma:",
            error
        );

        return res.status(500).json({
            mensagem:
                "Erro interno ao atualizar turma."
        });
    }
}

export async function excluirTurma(req, res) {
    try {
        const id = Number(req.params.id);

        if (!id || !Number.isInteger(id)) {
            return res.status(400).json({
                mensagem: "ID da turma inválido."
            });
        }

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
            mensagem:
                "Turma excluída com sucesso."
        });

    } catch (error) {
        console.error(
            "Erro ao excluir turma:",
            error
        );

        return res.status(500).json({
            mensagem:
                "Erro interno ao excluir turma."
        });
    }
}