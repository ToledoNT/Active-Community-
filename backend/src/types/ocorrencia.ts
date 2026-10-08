import { Status } from '@prisma/client';

export type CategoriaTipo =
  | 'Buraco'
  | 'Lixo'
  | 'Iluminação'
  | 'Calçada'
  | 'Praça'
  | 'Entulho'
  | 'Outro';

export interface CreateOcorrenciaDTO {
  titulo: string;
  categoria: string;
  descricao: string;
  local: string;
}

export interface OcorrenciaResponse {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  local: string;
  status: Status;
  createdAt: Date;
}
