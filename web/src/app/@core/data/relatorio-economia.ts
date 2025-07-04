interface Lancamento {
  ordem: number;
  descricao: string;
  observacao?: string;
  montante?: number;
  tipoMontante?: number;
  tarifa?: number;
  tipoTarifa?: number;
  total?: number;
  tipoLancamento: number;
  subTotalizador: boolean;
  totalizador: boolean;
}

interface Total {
  ordem: number;
  descricao: string;
  montante?: number;
  tipoMontante?: number;
  tarifa?: number;
  tipoTarifa?: number;
  total: number;
  tipoLancamento: number;
  subTotalizador: boolean;
  totalizador: boolean;
}
