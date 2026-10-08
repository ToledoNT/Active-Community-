import { Status } from '@prisma/client';
import prisma from '../config/prisma';
import { CreateOcorrenciaDTO } from '../types/ocorrencia';

export class OcorrenciaService {
  /**
   * Retorna todas as ocorrências cadastradas, ordenadas pela mais recente.
   */
  async listarTodas() {
    return prisma.ocorrencia.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca uma ocorrência pelo identificador numérico.
   */
  async buscarPorId(id: number) {
    return prisma.ocorrencia.findUnique({
      where: { id },
    });
  }

  /**
   * Cria uma nova ocorrência no banco de dados.
   * Define automaticamente status = REGISTRADO e createdAt = data atual.
   */
  async criar(dados: CreateOcorrenciaDTO) {
    const { titulo, categoria, descricao, local } = dados;

    // Validação de campos obrigatórios
    if (
      !titulo?.trim() ||
      !categoria?.trim() ||
      !descricao?.trim() ||
      !local?.trim()
    ) {
      throw new Error('Preencha todos os campos obrigatórios.');
    }

    return prisma.ocorrencia.create({
      data: {
        titulo: titulo.trim(),
        categoria: categoria.trim(),
        descricao: descricao.trim(),
        local: local.trim(),
        status: Status.REGISTRADO,
        // createdAt é preenchido automaticamente pelo Prisma (@default(now()))
      },
    });
  }

  /**
   * Atualiza o status de uma ocorrência existente.
   */
  async atualizarStatus(id: number, novoStatus: Status) {
    if (!novoStatus || !Object.values(Status).includes(novoStatus)) {
      throw new Error(
        `Status inválido. Os status permitidos são: ${Object.values(Status).join(', ')}.`
      );
    }

    const ocorrencia = await prisma.ocorrencia.findUnique({
      where: { id },
    });

    if (!ocorrencia) {
      throw new Error('Ocorrência não encontrada.');
    }

    return prisma.ocorrencia.update({
      where: { id },
      data: {
        status: novoStatus,
      },
    });
  }
}

export const ocorrenciaService = new OcorrenciaService();
