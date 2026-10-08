export type StatusOcorrencia = 'REGISTRADO' | 'EM_ANALISE' | 'RESOLVIDO';

export type CategoriaOcorrencia =
  | 'Buraco'
  | 'Lixo'
  | 'Iluminação'
  | 'Calçada'
  | 'Praça'
  | 'Entulho'
  | 'Outro';

export const CATEGORIAS_DISPONIVEIS: CategoriaOcorrencia[] = [
  'Buraco',
  'Lixo',
  'Iluminação',
  'Calçada',
  'Praça',
  'Entulho',
  'Outro',
];

export interface Ocorrencia {
  id: number;
  titulo: string;
  categoria: CategoriaOcorrencia | string;
  descricao: string;
  local: string;
  status: StatusOcorrencia;
  createdAt: string;
}

export interface CreateOcorrenciaDTO {
  titulo: string;
  categoria: string;
  descricao: string;
  local: string;
}
