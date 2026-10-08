import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ocorrenciaService } from '../../src/services/ocorrencia.service';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para requisições do app mobile
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/ocorrencias/[id] - Buscar ocorrência por ID
  if (req.method === 'GET') {
    try {
      const { id: rawId } = req.query;
      const id = parseInt(Array.isArray(rawId) ? rawId[0] : (rawId as string), 10);

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
      console.error('Erro ao buscar ocorrência na Vercel Function:', error);
      return res.status(500).json({
        message: 'Não foi possível carregar os detalhes da ocorrência.',
      });
    }
  }

  // PATCH /api/ocorrencias/[id] - Atualizar status da ocorrência (requer auth)
  if (req.method === 'PATCH') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          message: 'Token de autenticação não fornecido. Acesso restrito a administradores.',
        });
      }

      const { id: rawId } = req.query;
      const id = parseInt(Array.isArray(rawId) ? rawId[0] : (rawId as string), 10);

      if (isNaN(id)) {
        return res.status(400).json({ message: 'Identificador de ocorrência inválido.' });
      }

      const { status } = req.body || {};
      if (!status) {
        return res.status(400).json({ message: 'O campo status é obrigatório.' });
      }

      const ocorrenciaAtualizada = await ocorrenciaService.atualizarStatus(id, status);
      return res.status(200).json(ocorrenciaAtualizada);
    } catch (error: any) {
      console.error('Erro ao atualizar status na Vercel Function:', error);
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

  return res.status(405).json({ message: 'Método não permitido.' });
}
