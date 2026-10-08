import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ocorrenciaService } from '../../src/services/ocorrencia.service';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuração de CORS para requisições do app mobile
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Responde imediatamente a requisições de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/ocorrencias - Listar todas as ocorrências
  if (req.method === 'GET') {
    try {
      const ocorrencias = await ocorrenciaService.listarTodas();
      return res.status(200).json(ocorrencias);
    } catch (error) {
      console.error('Erro ao listar ocorrências na Vercel Function:', error);
      return res.status(500).json({
        message: 'Não foi possível carregar as ocorrências.',
      });
    }
  }

  // POST /api/ocorrencias - Criar nova ocorrência
  if (req.method === 'POST') {
    try {
      const { titulo, categoria, descricao, local } = req.body || {};

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
      console.error('Erro ao cadastrar ocorrência na Vercel Function:', error);

      if (error.message === 'Preencha todos os campos obrigatórios.') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: 'Não foi possível registrar o problema. Tente novamente.',
      });
    }
  }

  return res.status(405).json({ message: 'Método não permitido.' });
}
