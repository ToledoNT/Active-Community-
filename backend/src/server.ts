import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Servidor Active Community iniciado com sucesso!`);
  console.log(`📍 URL local: http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   GET  http://localhost:${PORT}/api/ocorrencias`);
  console.log(`   GET  http://localhost:${PORT}/api/ocorrencias/:id`);
  console.log(`   POST http://localhost:${PORT}/api/ocorrencias`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
