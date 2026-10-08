import { Router } from 'express';
import { ocorrenciaController } from '../controllers/ocorrencia.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/ocorrencias - Listar todas as ocorrências
router.get('/', (req, res) => ocorrenciaController.listar(req, res));

// GET /api/ocorrencias/:id - Buscar ocorrência por ID
router.get('/:id', (req, res) => ocorrenciaController.buscarPorId(req, res));

// POST /api/ocorrencias - Registrar nova ocorrência
router.post('/', (req, res) => ocorrenciaController.criar(req, res));

// PATCH /api/ocorrencias/:id/status - Atualizar status da ocorrência (restrito a admin)
router.patch('/:id/status', authMiddleware, (req, res) =>
  ocorrenciaController.atualizarStatus(req, res)
);

export default router;
