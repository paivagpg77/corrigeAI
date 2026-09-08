-- CreateTable
CREATE TABLE "Escola" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "logo" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Escola_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turma" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "serie" TEXT,
    "turno" TEXT,
    "escolaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessorTurma" (
    "id" SERIAL NOT NULL,
    "professorId" INTEGER NOT NULL,
    "turmaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessorTurma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id" SERIAL NOT NULL,
    "matricula" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "responsavel" TEXT,
    "emailResponsavel" TEXT,
    "turmaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- AddColumn
ALTER TABLE "Usuario"
ADD COLUMN "escolaId" INTEGER;

-- AddColumn
ALTER TABLE "Disciplina"
ADD COLUMN "escolaId" INTEGER;

-- AddColumn
ALTER TABLE "Prova"
ADD COLUMN "turmaId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Escola_cnpj_key" ON "Escola"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Turma_escolaId_codigo_key"
ON "Turma"("escolaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorTurma_professorId_turmaId_key"
ON "ProfessorTurma"("professorId", "turmaId");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_turmaId_matricula_key"
ON "Aluno"("turmaId", "matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_escolaId_nome_key"
ON "Disciplina"("escolaId", "nome");

-- AddForeignKey
ALTER TABLE "Usuario"
ADD CONSTRAINT "Usuario_escolaId_fkey"
FOREIGN KEY ("escolaId")
REFERENCES "Escola"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turma"
ADD CONSTRAINT "Turma_escolaId_fkey"
FOREIGN KEY ("escolaId")
REFERENCES "Escola"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorTurma"
ADD CONSTRAINT "ProfessorTurma_professorId_fkey"
FOREIGN KEY ("professorId")
REFERENCES "Usuario"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessorTurma"
ADD CONSTRAINT "ProfessorTurma_turmaId_fkey"
FOREIGN KEY ("turmaId")
REFERENCES "Turma"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno"
ADD CONSTRAINT "Aluno_turmaId_fkey"
FOREIGN KEY ("turmaId")
REFERENCES "Turma"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciplina"
ADD CONSTRAINT "Disciplina_escolaId_fkey"
FOREIGN KEY ("escolaId")
REFERENCES "Escola"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prova"
ADD CONSTRAINT "Prova_turmaId_fkey"
FOREIGN KEY ("turmaId")
REFERENCES "Turma"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;