import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/admin/login - Login de administrador
router.post('/login', (req, res) => adminController.login(req, res));

// GET /api/admin/me - Perfil do administrador autenticado
router.get('/me', authMiddleware, (req, res) => adminController.me(req, res));

export default router;
