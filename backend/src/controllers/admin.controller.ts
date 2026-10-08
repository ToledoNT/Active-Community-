import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export class AdminController {
  /**
   * POST /api/admin/login
   * Autentica o administrador e retorna o token de acesso.
   */
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

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

      console.error('Erro ao realizar login de administrador:', error);
      return res.status(500).json({
        message: 'Ocorreu um erro interno ao processar o login.',
      });
    }
  }

  /**
   * GET /api/admin/me
   * Retorna os dados do administrador atualmente logado.
   */
  async me(req: Request, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ message: 'Não autenticado.' });
      }

      const admin = await adminService.buscarPorId(req.admin.id);
      if (!admin) {
        return res.status(404).json({ message: 'Administrador não encontrado.' });
      }

      return res.status(200).json(admin);
    } catch (error) {
      console.error('Erro ao buscar dados do administrador:', error);
      return res.status(500).json({
        message: 'Não foi possível carregar os dados do administrador.',
      });
    }
  }
}

export const adminController = new AdminController();
