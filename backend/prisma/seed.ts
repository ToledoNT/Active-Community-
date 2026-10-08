import { PrismaClient, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o povoamento do banco de dados (seed)...');

  // Limpa ocorrências existentes para garantir idempotência durante testes/demonstrações
  await prisma.ocorrencia.deleteMany();

  const ocorrenciasExemplo = [
    {
      titulo: 'Buraco na Rua das Flores',
      categoria: 'Buraco',
      descricao: 'Buraco grande próximo à praça.',
      local: 'Rua das Flores',
      status: Status.EM_ANALISE,
    },
    {
      titulo: 'Poste sem iluminação',
      categoria: 'Iluminação',
      descricao: 'Poste sem iluminação durante a noite.',
      local: 'Avenida Central',
      status: Status.REGISTRADO,
    },
    {
      titulo: 'Lixo acumulado',
      categoria: 'Lixo',
      descricao: 'Acúmulo de lixo próximo à praça.',
      local: 'Praça do Bairro',
      status: Status.RESOLVIDO,
    },
  ];

  for (const ocorrencia of ocorrenciasExemplo) {
    const criada = await prisma.ocorrencia.create({
      data: ocorrencia,
    });
    console.log(`Ocorrência criada: [ID ${criada.id}] ${criada.titulo} (${criada.status})`);
  }

  // Criação ou atualização do usuário administrador padrão
  const senhaPadraoHash = bcrypt.hashSync('admin123', 10);
  const adminPadrao = await prisma.admin.upsert({
    where: { email: 'admin@activecommunity.com' },
    update: { senha: senhaPadraoHash },
    create: {
      nome: 'Administrador',
      email: 'admin@activecommunity.com',
      senha: senhaPadraoHash,
    },
  });
  console.log(`Administrador configurado: ${adminPadrao.email} (senha: admin123)`);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
