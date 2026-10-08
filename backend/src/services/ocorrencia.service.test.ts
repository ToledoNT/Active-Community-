import { ocorrenciaService } from './ocorrencia.service';
import prisma from '../config/prisma';

jest.mock('../config/prisma', () => ({
  __esModule: true,
  default: {
    ocorrencia: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('OcorrenciaService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve lançar erro se algum campo obrigatório estiver vazio', async () => {
      await expect(
        ocorrenciaService.criar({
          titulo: '',
          categoria: 'Buraco',
          descricao: 'Descrição teste',
          local: 'Rua teste',
        })
      ).rejects.toThrow('Preencha todos os campos obrigatórios.');

      await expect(
        ocorrenciaService.criar({
          titulo: 'Buraco',
          categoria: '',
          descricao: 'Descrição teste',
          local: 'Rua teste',
        })
      ).rejects.toThrow('Preencha todos os campos obrigatórios.');

      await expect(
        ocorrenciaService.criar({
          titulo: 'Buraco',
          categoria: 'Buraco',
          descricao: '   ',
          local: 'Rua teste',
        })
      ).rejects.toThrow('Preencha todos os campos obrigatórios.');

      await expect(
        ocorrenciaService.criar({
          titulo: 'Buraco',
          categoria: 'Buraco',
          descricao: 'Descrição',
          local: '',
        })
      ).rejects.toThrow('Preencha todos os campos obrigatórios.');
    });

    it('deve salvar a ocorrência com status REGISTRADO quando dados forem válidos', async () => {
      const mockRetorno = {
        id: 1,
        titulo: 'Buraco na pista',
        categoria: 'Buraco',
        descricao: 'Buraco perigoso',
        local: 'Av. Brasil',
        status: 'REGISTRADO',
        createdAt: new Date(),
      };

      (prisma.ocorrencia.create as jest.Mock).mockResolvedValue(mockRetorno);

      const resultado = await ocorrenciaService.criar({
        titulo: 'Buraco na pista',
        categoria: 'Buraco',
        descricao: 'Buraco perigoso',
        local: 'Av. Brasil',
      });

      expect(prisma.ocorrencia.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          titulo: 'Buraco na pista',
          categoria: 'Buraco',
          descricao: 'Buraco perigoso',
          local: 'Av. Brasil',
          status: 'REGISTRADO',
        }),
      });
      expect(resultado).toEqual(mockRetorno);
    });
  });

  describe('listarTodas', () => {
    it('deve listar ocorrências ordenadas por data decrescente', async () => {
      const mockLista = [
        { id: 1, titulo: 'Buraco 1' },
        { id: 2, titulo: 'Lixo 2' },
      ];

      (prisma.ocorrencia.findMany as jest.Mock).mockResolvedValue(mockLista);

      const resultado = await ocorrenciaService.listarTodas();

      expect(prisma.ocorrencia.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(resultado).toEqual(mockLista);
    });
  });

  describe('buscarPorId', () => {
    it('deve buscar uma ocorrência pelo id fornecido', async () => {
      const mockItem = { id: 1, titulo: 'Buraco 1' };
      (prisma.ocorrencia.findUnique as jest.Mock).mockResolvedValue(mockItem);

      const resultado = await ocorrenciaService.buscarPorId(1);

      expect(prisma.ocorrencia.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(resultado).toEqual(mockItem);
    });
  });

  describe('atualizarStatus', () => {
    it('deve lançar erro se o status for inválido', async () => {
      await expect(
        ocorrenciaService.atualizarStatus(1, 'INVALIDO' as any)
      ).rejects.toThrow('Status inválido');
    });

    it('deve lançar erro se a ocorrência não existir', async () => {
      (prisma.ocorrencia.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        ocorrenciaService.atualizarStatus(999, 'EM_ANALISE' as any)
      ).rejects.toThrow('Ocorrência não encontrada.');
    });

    it('deve atualizar o status com sucesso quando os parâmetros forem válidos', async () => {
      const ocorrenciaExistente = { id: 1, titulo: 'Buraco', status: 'REGISTRADO' };
      const ocorrenciaAtualizada = { id: 1, titulo: 'Buraco', status: 'EM_ANALISE' };

      (prisma.ocorrencia.findUnique as jest.Mock).mockResolvedValue(ocorrenciaExistente);
      (prisma.ocorrencia.update as jest.Mock).mockResolvedValue(ocorrenciaAtualizada);

      const resultado = await ocorrenciaService.atualizarStatus(1, 'EM_ANALISE' as any);

      expect(prisma.ocorrencia.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'EM_ANALISE' },
      });
      expect(resultado).toEqual(ocorrenciaAtualizada);
    });
  });
});
