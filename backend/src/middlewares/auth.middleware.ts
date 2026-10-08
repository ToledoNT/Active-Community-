import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken, AdminTokenPayload } from '../config/jwt';

// Estende a interface Request do Express para incluir os dados do admin autenticado
declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token de autenticação não fornecido. Acesso restrito a administradores.',
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      message: 'Formato de token inválido. Utilize o formato "Bearer <token>".',
    });
  }

  const token = parts[1];

  try {
    const payload = verifyAdminToken(token);
    req.admin = payload;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Sessão expirada ou token inválido. Por favor, faça login novamente.',
    });
  }
}
