import jwt from 'jsonwebtoken';

export const JWT_SECRET =
  process.env.JWT_SECRET || 'active-community-super-secret-key-2026';

export interface AdminTokenPayload {
  id: number;
  email: string;
  nome: string;
}

/**
 * Gera um token JWT com validade de 24 horas para o administrador autenticado.
 */
export function generateAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Valida e decodifica um token JWT.
 */
export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
}
