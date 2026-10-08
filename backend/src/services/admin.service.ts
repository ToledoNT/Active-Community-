import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { generateAdminToken } from '../config/jwt';

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface AdminResponse {
  id: number;
  nome: string;
  email: string;
}

export interface LoginResult {
  token: string;
  admin: AdminResponse;
}

export class AdminService {
  /**
   * Realiza autenticação de um administrador com e-mail e senha.
   */
  async login(dados: LoginDTO): Promise<LoginResult> {
    const { email, senha } = dados;

    if (!email?.trim() || !senha?.trim()) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Busca o administrador no banco de dados
    let admin = await prisma.admin.findUnique({
      where: { email: emailNormalizado },
    });

    // Se o banco estiver vazio e for o admin padrão, auto-cria para conveniência de desenvolvimento
    if (!admin && emailNormalizado === 'admin@activecommunity.com') {
      const totalAdmins = await prisma.admin.count();
      if (totalAdmins === 0) {
        const hash = await bcrypt.hash('admin123', 10);
        admin = await prisma.admin.create({
          data: {
            nome: 'Administrador',
            email: 'admin@activecommunity.com',
            senha: hash,
          },
        });
      }
    }

    if (!admin) {
      throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
    }

    const token = generateAdminToken({
      id: admin.id,
      email: admin.email,
      nome: admin.nome,
    });

    return {
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
      },
    };
  }

  /**
   * Busca os dados do administrador pelo ID.
   */
  async buscarPorId(id: number): Promise<AdminResponse | null> {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return admin;
  }
}

export const adminService = new AdminService();
