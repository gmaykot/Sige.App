export interface IRelatorioEconomia {
  success: boolean;
  status: number;
  data: {
    cabecalho: {
      titulo: string;
      subTitulo: string;
      unidade: string;
      subMercado: string;
      conexao: string;
      concessao: string;
      dataAnalise: string;
      mesReferencia: string;
      numerorDiasMes: number;
      periodoHoroSazonal: string;
    };
    grupos: Grupo[];
  };
  message: string;
  errors: any[];
}

interface Grupo {
  ordem: number;
  titulo: string;
  colunaQuantidade: string;
  colunaValor: string;
  colunaTotal: string;
  subGrupos: SubGrupo[];
}

interface SubGrupo {
  lancamentos: Lancamento[];
  total: Total;
}

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
