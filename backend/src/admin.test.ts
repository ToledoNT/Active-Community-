
import request from 'supertest';
import app from './app';
import { adminService } from './services/admin.service';
import { ocorrenciaService } from './services/ocorrencia.service';
import { generateAdminToken } from './config/jwt';

jest.mock('./services/admin.service');
jest.mock('./services/ocorrencia.service');

describe('Administração e Autenticação (/api/admin e PATCH /api/ocorrencias/:id/status)', () => {
  const validToken = generateAdminToken({
    id: 1,
    nome: 'Administrador Teste',
    email: 'admin@activecommunity.com',
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('POST /api/admin/login', () => {
    it('deve retornar 200 e o token JWT quando as credenciais forem válidas', async () => {
      const mockResult = {
        token: 'fake-jwt-token',
        admin: {
          id: 1,
          nome: 'Administrador',
          email: 'admin@activecommunity.com',
        },
      };

      (adminService.login as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/admin/login')
        .send({ email: 'admin@activecommunity.com', senha: 'admin123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'fake-jwt-token');
      expect(response.body.admin).toHaveProperty(
        'email',
        'admin@activecommunity.com'
      );
    });

    it('deve retornar 400 se e-mail ou senha não forem fornecidos', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({ email: 'admin@activecommunity.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'E-mail e senha são obrigatórios.'
      );
    });

    it('deve retornar 401 se as credenciais forem inválidas', async () => {
      (adminService.login as jest.Mock).mockRejectedValue(
        new Error('Credenciais inválidas. Verifique seu e-mail e senha.')
      );

      const response = await request(app)
        .post('/api/admin/login')
        .send({ email: 'errado@email.com', senha: 'errada' });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Credenciais inválidas');
    });
  });

  describe('GET /api/admin/me', () => {
    it('deve retornar 401 se nenhum token for fornecido', async () => {
      const response = await request(app).get('/api/admin/me');

      expect(response.status).toBe(401);
    });

    it('deve retornar 200 com os dados do admin quando autenticado', async () => {
      (adminService.buscarPorId as jest.Mock).mockResolvedValue({
        id: 1,
        nome: 'Administrador Teste',
        email: 'admin@activecommunity.com',
      });

      const response = await request(app)
        .get('/api/admin/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty(
        'email',
        'admin@activecommunity.com'
      );
    });
  });

  describe('PATCH /api/ocorrencias/:id/status', () => {
    it('deve bloquear acesso sem token (401)', async () => {
      const response = await request(app)
        .patch('/api/ocorrencias/1/status')
        .send({ status: 'EM_ANALISE' });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain(
        'Acesso restrito a administradores'
      );
    });

    it('deve bloquear com token malformado (401)', async () => {
      const response = await request(app)
        .patch('/api/ocorrencias/1/status')
        .set('Authorization', 'TokenInvalido')
        .send({ status: 'EM_ANALISE' });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Formato de token inválido');
    });

    it('deve retornar 400 se o campo status não for enviado', async () => {
      const response = await request(app)
        .patch('/api/ocorrencias/1/status')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'O campo status é obrigatório.'
      );
    });

    it('deve retornar 400 se o ID for inválido', async () => {
      const response = await request(app)
        .patch('/api/ocorrencias/abc/status')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'EM_ANALISE' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain(
        'Identificador de ocorrência inválido'
      );
    });

    it('deve retornar 404 se a ocorrência não existir', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      (ocorrenciaService.atualizarStatus as jest.Mock).mockRejectedValue(
        new Error('Ocorrência não encontrada.')
      );

      const response = await request(app)
        .patch('/api/ocorrencias/999/status')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'RESOLVIDO' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Ocorrência não encontrada.');
    });

    it('deve retornar 200 e a ocorrência atualizada quando status for alterado com sucesso', async () => {
      const mockAtualizada = {
        id: 1,
        titulo: 'Buraco na rua',
        categoria: 'Buraco',
        descricao: 'Buraco fundo',
        local: 'Rua Principal',
        status: 'RESOLVIDO',
        createdAt: new Date().toISOString(),
      };

      (ocorrenciaService.atualizarStatus as jest.Mock).mockResolvedValue(
        mockAtualizada
      );

      const response = await request(app)
        .patch('/api/ocorrencias/1/status')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'RESOLVIDO' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'RESOLVIDO');
      expect(ocorrenciaService.atualizarStatus).toHaveBeenCalledWith(
        1,
        'RESOLVIDO'
      );
    });
  });
});
