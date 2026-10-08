/**
 * Formata uma data ISO em formato legível brasileiro (DD/MM/AAAA às HH:mm).
 */
export function formatarData(dataIso: string | Date | undefined): string {
  if (!dataIso) return '';

  try {
    const data = typeof dataIso === 'string' ? new Date(dataIso) : dataIso;

    if (isNaN(data.getTime()) || data.getFullYear() < 1970) {
      return '';
    }

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  } catch {
    return '';
  }
}
