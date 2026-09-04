import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "./prisma.js";

async function main() {
    console.log("🌱 Iniciando seed do banco...");

    const senhaHash = await bcrypt.hash("123456", 10);

    // Professor
    await prisma.usuario.upsert({
        where: {
            email: "prof@escola.com"
        },
        update: {},
        create: {
            nome: "Professor",
            email: "prof@escola.com",
            senha: senhaHash,
            tipo: "PROFESSOR"
        }
    });

    // Coordenador
    await prisma.usuario.upsert({
        where: {
            email: "coord@escola.com"
        },
        update: {},
        create: {
            nome: "Coordenador",
            email: "coord@escola.com",
            senha: senhaHash,
            tipo: "COORDENADOR"
        }
    });

    // Diretor
    await prisma.usuario.upsert({
        where: {
            email: "diretor@escola.com"
        },
        update: {},
        create: {
            nome: "Diretor",
            email: "diretor@escola.com",
            senha: senhaHash,
            tipo: "DIRETOR"
        }
    });

    // Disciplinas
    const disciplinas = [
        "Matemática",
        "Português",
        "Ciências",
        "História",
        "Geografia"
    ];

    for (const nome of disciplinas) {
        await prisma.disciplina.upsert({
            where: {
                nome
            },
            update: {},
            create: {
                nome
            }
        });
    }

    console.log("✅ Usuários criados/atualizados.");
    console.log("✅ Disciplinas criadas/atualizadas.");
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