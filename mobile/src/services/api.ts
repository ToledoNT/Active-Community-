import { Platform } from 'react-native';
import { CreateOcorrenciaDTO, Ocorrencia, StatusOcorrencia } from '../types/ocorrencia';
import { AdminAuthResponse } from '../types/admin';

/**
 * Define a URL base da API a partir de variável de ambiente ou fallback inteligente.
 * Em emuladores Android, '10.0.2.2' mapeia para o 'localhost' da máquina hospedeira.
 */
const getDefaultApiUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  if (envUrl) {
    // Se estiver rodando no Android e a URL apontar para localhost,
    // ajusta para 10.0.2.2 (alias do emulador para a máquina host)
    if (Platform.OS === 'android' && envUrl.includes('localhost')) {
      return envUrl.replace('localhost', '10.0.2.2');
    }
    return envUrl;
  }

  // Fallback para desenvolvimento local caso a variável não esteja preenchida
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }

  return 'http://localhost:3001';
};

export const API_BASE_URL = getDefaultApiUrl();

/**
 * Realiza requisições HTTP com controle de timeout e tratamento uniforme de erros.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        `Erro na requisição (${response.status}): ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('A conexão expirou. O servidor demorou muito para responder.');
    }

    if (error.message?.includes('Network request failed')) {
      throw new Error(
        'Não foi possível conectar ao servidor. Verifique sua conexão ou se a API está em execução.'
      );
    }

    throw error;
  }
}

export const apiService = {
  /**
   * GET /api/ocorrencias
   * Retorna a lista completa de ocorrências.
   */
  async getOcorrencias(): Promise<Ocorrencia[]> {
    return request<Ocorrencia[]>('/api/ocorrencias', {
      method: 'GET',
    });
  },

  /**
   * GET /api/ocorrencias/:id
   * Retorna os detalhes de uma ocorrência específica.
   */
  async getOcorrenciaById(id: number): Promise<Ocorrencia> {
    return request<Ocorrencia>(`/api/ocorrencias/${id}`, {
      method: 'GET',
    });
  },

  /**
   * POST /api/ocorrencias
   * Cria uma nova ocorrência com os dados fornecidos.
   */
  async createOcorrencia(dados: CreateOcorrenciaDTO): Promise<Ocorrencia> {
    return request<Ocorrencia>('/api/ocorrencias', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  /**
   * POST /api/admin/login
   * Autentica o administrador e retorna o token de acesso.
   */
  async loginAdmin(email: string, senha: string): Promise<AdminAuthResponse> {
    return request<AdminAuthResponse>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  },

  /**
   * PATCH /api/ocorrencias/:id/status
   * Atualiza o status da ocorrência (requer token do administrador).
   */
  async updateOcorrenciaStatus(
    id: number,
    status: StatusOcorrencia,
    token: string
  ): Promise<Ocorrencia> {
    return request<Ocorrencia>(`/api/ocorrencias/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  },
};
