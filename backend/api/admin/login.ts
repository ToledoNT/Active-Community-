import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminService } from '../../src/services/admin.service';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { email, senha } = req.body || {};

      if (!email || !senha) {
        return res.status(400).json({
          message: 'E-mail e senha são obrigatórios.',
        });
      }

      const resultado = await adminService.login({ email, senha });
      return res.status(200).json(resultado);
    } catch (error: any) {
      if (
        error.message === 'E-mail e senha são obrigatórios.' ||
        error.message?.includes('Credenciais inválidas')
      ) {
        return res.status(401).json({ message: error.message });
      }

      console.error('Erro no login Vercel:', error);
      return res.status(500).json({
        message: 'Ocorreu um erro interno ao processar o login.',
      });
    }
  }

  return res.status(405).json({ message: 'Método não permitido.' });
}
