import { ILancamentoAdicional } from "./lancamento-adicional";

export interface IFaturaEnergia {
  id: string;
  concessionariaId: string;
  pontoMedicaoId: string;
  mesReferencia: string;
  dataVencimento: string;
  descConcessionaria: string;
  descPontoMedicao: string;
  valorContratadoPonta: number;
  valorContratadoForaPonta: number;
  valorFaturadoPonta: number;
  valorFaturadoForaPonta: number;
  valorUltrapassagemForaPonta: number;
  valorReativoPonta: number;
  valorReativoForaPonta: number;
  valorConsumoTUSDPonta: number;
  valorConsumoTUSDForaPonta: number;
  valorConsumoTEPonta: number;
  valorConsumoTEForaPonta: number;
  valorBandeiraPonta: number;
  valorBandeiraForaPonta: number;
  valorMedidoReativoPonta: number;
  valorMedidoReativoForaPonta: number;
  valorSubvencaoTarifaria: number;
  lancamentosAdicionais: ILancamentoAdicional[];
}
