export interface ILancamentoRelatorioFinal {
  ordem: number;
  descricao: string;
  observacao?: string;

  montante?: number;
  tipoMontante?: string;

  tarifa?: number;
  tipoTarifa?: string;

  total?: number;

  tipoLancamento: string;

  subTotalizador: boolean;
  totalizador: boolean;
}