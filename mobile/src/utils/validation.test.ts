import { validarOcorrencia } from './validation';

describe('Validação do Formulário de Ocorrências (validarOcorrencia)', () => {
  const dadosValidos = {
    titulo: 'Buraco na rua',
    categoria: 'Buraco',
    descricao: 'Existe um buraco grande próximo à praça.',
    local: 'Rua das Flores, 120',
  };

  it('deve retornar valido: true quando todos os campos obrigatórios estiverem preenchidos', () => {
    const resultado = validarOcorrencia(dadosValidos);

    expect(resultado.valido).toBe(true);
    expect(resultado.mensagem).toBeUndefined();
  });

  it('deve falhar se o título estiver vazio ou contiver apenas espaços', () => {
    const resVazio = validarOcorrencia({ ...dadosValidos, titulo: '' });
    expect(resVazio.valido).toBe(false);
    expect(resVazio.mensagem).toBe('Preencha todos os campos obrigatórios.');

    const resEspacos = validarOcorrencia({ ...dadosValidos, titulo: '   ' });
    expect(resEspacos.valido).toBe(false);
    expect(resEspacos.mensagem).toBe('Preencha todos os campos obrigatórios.');
  });

  it('deve falhar se a categoria estiver vazia', () => {
    const res = validarOcorrencia({ ...dadosValidos, categoria: '' });
    expect(res.valido).toBe(false);
    expect(res.mensagem).toBe('Preencha todos os campos obrigatórios.');
  });

  it('deve falhar se a descrição estiver vazia ou contiver apenas espaços', () => {
    const res = validarOcorrencia({ ...dadosValidos, descricao: '    ' });
    expect(res.valido).toBe(false);
    expect(res.mensagem).toBe('Preencha todos os campos obrigatórios.');
  });

  it('deve falhar se o local estiver vazio ou contiver apenas espaços', () => {
    const res = validarOcorrencia({ ...dadosValidos, local: '' });
    expect(res.valido).toBe(false);
    expect(res.mensagem).toBe('Preencha todos os campos obrigatórios.');
  });
});
