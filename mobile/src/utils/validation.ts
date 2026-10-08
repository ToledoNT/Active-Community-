export interface FormOcorrenciaInput {
  titulo: string;
  categoria: string;
  descricao: string;
  local: string;
}

export interface ValidacaoResultado {
  valido: boolean;
  mensagem?: string;
}

/**
 * Valida os campos obrigatórios para o cadastro de uma ocorrência.
 */
export function validarOcorrencia(input: FormOcorrenciaInput): ValidacaoResultado {
  if (
    !input.titulo?.trim() ||
    !input.categoria?.trim() ||
    !input.descricao?.trim() ||
    !input.local?.trim()
  ) {
    return {
      valido: false,
      mensagem: 'Preencha todos os campos obrigatórios.',
    };
  }

  return { valido: true };
}
