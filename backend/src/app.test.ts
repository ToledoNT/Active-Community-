import request from 'supertest';
import app from './app';
import { ocorrenciaService } from './services/ocorrencia.service';

jest.mock('./services/ocorrencia.service');

describe('API REST Endpoints (/api/ocorrencias)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('deve retornar status 200 e confirmação de saúde da API', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/ocorrencias', () => {
    it('deve retornar lista de ocorrências com status 200', async () => {
      const mockOcorrencias = [
        {
          id: 1,
          titulo: 'Buraco na Rua das Flores',
          categoria: 'Buraco',
          descricao: 'Buraco grande próximo à praça.',
          local: 'Rua das Flores',
          status: 'EM_ANALISE',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          titulo: 'Poste apagado',
          categoria: 'Iluminação',
          descricao: 'Poste sem luz',
          local: 'Av Central',
          status: 'REGISTRADO',
          createdAt: new Date().toISOString(),
        },
      ];

      (ocorrenciaService.listarTodas as jest.Mock).mockResolvedValue(mockOcorrencias);

      const response = await request(app).get('/api/ocorrencias');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].titulo).toBe('Buraco na Rua das Flores');
    });

    it('deve retornar 500 caso o serviço lance um erro inesperado', async () => {
      (ocorrenciaService.listarTodas as jest.Mock).mockRejectedValue(
        new Error('Falha no banco')
      );

      const response = await request(app).get('/api/ocorrencias');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        'message',
        'Não foi possível carregar as ocorrências.'
      );
    });
  });

  describe('GET /api/ocorrencias/:id', () => {
    it('deve retornar a ocorrência correspondente quando o ID existir', async () => {
      const mockOcorrencia = {
        id: 1,
        titulo: 'Buraco na Rua das Flores',
        categoria: 'Buraco',
        descricao: 'Buraco grande próximo à praça.',
        local: 'Rua das Flores',
        status: 'EM_ANALISE',
        createdAt: new Date().toISOString(),
      };

      (ocorrenciaService.buscarPorId as jest.Mock).mockResolvedValue(mockOcorrencia);

      const response = await request(app).get('/api/ocorrencias/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.titulo).toBe('Buraco na Rua das Flores');
      expect(ocorrenciaService.buscarPorId).toHaveBeenCalledWith(1);
    });

    it('deve retornar 400 se o ID não for um número válido', async () => {
      const response = await request(app).get('/api/ocorrencias/invalido');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'Identificador de ocorrência inválido.'
      );
    });

    it('deve retornar 404 se a ocorrência não for encontrada', async () => {
      (ocorrenciaService.buscarPorId as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/ocorrencias/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Ocorrência não encontrada.'
      );
    });
  });

  describe('POST /api/ocorrencias', () => {
    it('deve criar ocorrência e retornar status 201 com dados salvos', async () => {
      const novoRegistro = {
        titulo: 'Calçada danificada',
        categoria: 'Calçada',
        descricao: 'Lajotas soltas',
        local: 'Rua das Palmeiras, 100',
      };

      const mockCriado = {
        id: 4,
        ...novoRegistro,
        status: 'REGISTRADO',
        createdAt: new Date().toISOString(),
      };

      (ocorrenciaService.criar as jest.Mock).mockResolvedValue(mockCriado);

      const response = await request(app)
        .post('/api/ocorrencias')
        .send(novoRegistro);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 4);
      expect(response.body.status).toBe('REGISTRADO');
      expect(ocorrenciaService.criar).toHaveBeenCalledWith(novoRegistro);
    });

    it('deve retornar 400 caso algum campo obrigatório não seja fornecido', async () => {
      const response = await request(app)
        .post('/api/ocorrencias')
        .send({
          titulo: '',
          categoria: 'Buraco',
          descricao: 'Descrição',
          local: 'Rua das Flores',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'Preencha todos os campos obrigatórios.'
      );
    });
  });

  describe('Rotas inexistentes', () => {
    it('deve retornar 404 para rotas desconhecidas', async () => {
      const response = await request(app).get('/api/rota-inexistente');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Rota não encontrada.');
    });
  });
});
