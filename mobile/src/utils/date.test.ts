import { formatarData } from './date';

describe('Formatação de Datas (formatarData)', () => {
  it('deve formatar corretamente uma data válida em string ISO', () => {
    // Usamos data com timezone local explícito para consistência
    const dataIso = '2026-10-06T15:30:00';
    const formatada = formatarData(dataIso);

    expect(formatada).toContain('06/10/2026');
    expect(formatada).toContain('às');
  });

  it('deve retornar string vazia para valores nulos ou indefinidos', () => {
    expect(formatarData(undefined)).toBe('');
    expect(formatarData('')).toBe('');
  });

  it('deve retornar string vazia caso a data fornecida seja inválida', () => {
    expect(formatarData('data-invalida-123')).toBe('');
  });
});
