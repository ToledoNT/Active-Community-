-- CreateEnum
CREATE TYPE "Status" AS ENUM ('REGISTRADO', 'EM_ANALISE', 'RESOLVIDO');

-- CreateTable
CREATE TABLE "ocorrencias" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'REGISTRADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocorrencias_pkey" PRIMARY KEY ("id")
);
