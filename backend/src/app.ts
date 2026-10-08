import express from 'express';
import cors from 'cors';
import ocorrenciaRoutes from './routes/ocorrencia.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de saúde da API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas do domínio
app.use('/api/ocorrencias', ocorrenciaRoutes);
app.use('/api/admin', adminRoutes);

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

export default app;
