import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";

async function main() {
    console.log("🌱 Iniciando seed do banco...");

    const senhaHash = await bcrypt.hash("123456", 10);

    // =========================================
    // ESCOLA
    // =========================================

    const escola = await prisma.escola.upsert({
        where: {
            cnpj: "00000000000100"
        },
        update: {
            nome: "Escola CorrigeAI",
            email: "contato@corrigeai.com",
            telefone: "(00) 00000-0000",
            endereco: "Rua Principal, 100"
        },
        create: {
            nome: "Escola CorrigeAI",
            cnpj: "00000000000100",
            email: "contato@corrigeai.com",
            telefone: "(00) 00000-0000",
            endereco: "Rua Principal, 100"
        }
    });

    console.log(`🏫 Escola: ${escola.nome} (ID: ${escola.id})`);

    // =========================================
    // USUÁRIOS
    // =========================================

    await prisma.usuario.upsert({
        where: {
            email: "prof@escola.com"
        },
        update: {
            escolaId: escola.id
        },
        create: {
            nome: "Professor",
            email: "prof@escola.com",
            senha: senhaHash,
            tipo: "PROFESSOR",
            escolaId: escola.id
        }
    });

    await prisma.usuario.upsert({
        where: {
            email: "coord@escola.com"
        },
        update: {
            escolaId: escola.id
        },
        create: {
            nome: "Coordenador",
            email: "coord@escola.com",
            senha: senhaHash,
            tipo: "COORDENADOR",
            escolaId: escola.id
        }
    });

    await prisma.usuario.upsert({
        where: {
            email: "diretor@escola.com"
        },
        update: {
            escolaId: escola.id
        },
        create: {
            nome: "Diretor",
            email: "diretor@escola.com",
            senha: senhaHash,
            tipo: "DIRETOR",
            escolaId: escola.id
        }
    });

    // =========================================
    // VINCULAR USUÁRIOS EXISTENTES
    // =========================================

    await prisma.usuario.updateMany({
        where: {
            escolaId: null
        },
        data: {
            escolaId: escola.id
        }
    });

    // =========================================
    // DISCIPLINAS
    // =========================================

    const disciplinas = [
        "Matemática",
        "Português",
        "Ciências",
        "História",
        "Geografia"
    ];

    for (const nome of disciplinas) {
        const existente = await prisma.disciplina.findFirst({
            where: {
                nome: nome
            }
        });

        if (existente) {
            await prisma.disciplina.update({
                where: {
                    id: existente.id
                },
                data: {
                    escolaId: escola.id
                }
            });
        } else {
            await prisma.disciplina.create({
                data: {
                    nome: nome,
                    escolaId: escola.id
                }
            });
        }
    }

    // =========================================
    // VINCULAR DISCIPLINAS EXISTENTES
    // =========================================

    await prisma.disciplina.updateMany({
        where: {
            escolaId: null
        },
        data: {
            escolaId: escola.id
        }
    });

    console.log("✅ Escola criada/vinculada.");
    console.log("✅ Usuários criados/atualizados.");
    console.log("✅ Usuários antigos vinculados.");
    console.log("✅ Disciplinas criadas/atualizadas.");
    console.log("✅ Disciplinas antigas vinculadas.");
    console.log("🎉 Seed concluído com sucesso!");
}

main()
    .catch((error) => {
        console.error("❌ ERRO NO SEED:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });