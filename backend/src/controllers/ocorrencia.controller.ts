import { Request, Response } from 'express';
import { ocorrenciaService } from '../services/ocorrencia.service';

export class OcorrenciaController {
  /**
   * GET /api/ocorrencias
   * Retorna a lista de todas as ocorrências.
   */
  async listar(req: Request, res: Response) {
    try {
      const ocorrencias = await ocorrenciaService.listarTodas();
      return res.status(200).json(ocorrencias);
    } catch (error) {
      console.error('Erro ao listar ocorrências:', error);
      return res.status(500).json({
        message: 'Não foi possível carregar as ocorrências.',
      });
    }
  }

  /**
   * GET /api/ocorrencias/:id
   * Retorna os detalhes de uma ocorrência específica.
   */
  async buscarPorId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          message: 'Identificador de ocorrência inválido.',
        });
      }

      const ocorrencia = await ocorrenciaService.buscarPorId(id);

      if (!ocorrencia) {
        return res.status(404).json({
          message: 'Ocorrência não encontrada.',
        });
      }

      return res.status(200).json(ocorrencia);
    } catch (error) {
      console.error('Erro ao buscar ocorrência:', error);
      return res.status(500).json({
        message: 'Não foi possível carregar os detalhes da ocorrência.',
      });
    }
  }

  /**
   * POST /api/ocorrencias
   * Cadastra uma nova ocorrência.
   */
  async criar(req: Request, res: Response) {
    try {
      const { titulo, categoria, descricao, local } = req.body;

      if (!titulo || !categoria || !descricao || !local) {
        return res.status(400).json({
          message: 'Preencha todos os campos obrigatórios.',
        });
      }

      const novaOcorrencia = await ocorrenciaService.criar({
        titulo,
        categoria,
        descricao,
        local,
      });

      return res.status(201).json(novaOcorrencia);
    } catch (error: any) {
      console.error('Erro ao cadastrar ocorrência:', error);

      if (error.message === 'Preencha todos os campos obrigatórios.') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Não foi possível registrar o problema. Tente novamente.',
      });
    }
  }

  /**
   * PATCH /api/ocorrencias/:id/status
   * Atualiza o status de uma ocorrência existente (restrito a admin).
   */
  async atualizarStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).json({
          message: 'Identificador de ocorrência inválido.',
        });
      }

      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          message: 'O campo status é obrigatório.',
        });
      }

      const ocorrenciaAtualizada = await ocorrenciaService.atualizarStatus(id, status);
      return res.status(200).json(ocorrenciaAtualizada);
    } catch (error: any) {
      console.error('Erro ao atualizar status da ocorrência:', error);

      if (error.message?.includes('Status inválido')) {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === 'Ocorrência não encontrada.') {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Não foi possível atualizar o status da ocorrência.',
      });
    }
  }
}

export const ocorrenciaController = new OcorrenciaController();
