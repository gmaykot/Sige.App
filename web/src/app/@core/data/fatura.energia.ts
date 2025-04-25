import { ILancamentoAdicional } from "./lancamento-adicional";

export interface IFaturaEnergia {
  id: string | null;
  pontoMedicaoDesc: string | null;
  pontoMedicaoId: string | null;
  concessionariaId: string | null;
  concessionariaDesc: string | null;
  mesReferencia: string; // formato 'yyyy-MM-dd'
  dataVencimento: string; // formato 'yyyy-MM-dd'
  segmento: string;
  validado: boolean;

  // Demanda
  valorDemandaContratadaPonta: number | null;
  valorDemandaContratadaForaPonta: number;

  valorDemandaFaturadaPontaConsumida: number | null;
  valorDemandaFaturadaForaPontaConsumida: number;

  valorDemandaFaturadaPontaNaoConsumida: number | null;
  valorDemandaFaturadaForaPontaNaoConsumida: number;

  valorDemandaUltrapassagemPonta: number;
  valorDemandaUltrapassagemForaPonta: number;

  valorDemandaReativaPonta: number | null;
  valorDemandaReativaForaPonta: number;

  // Consumo
  valorConsumoTUSDPonta: number | null;
  valorConsumoTUSDForaPonta: number;

  valorConsumoTEPonta: number | null;
  valorConsumoTEForaPonta: number;

  valorConsumoMedidoReativoPonta: number | null;
  valorConsumoMedidoReativoForaPonta: number;

  // Adicional Bandeira, Subvenção e Desconto TUSD
  valorAdicionalBandeiraPonta: number | null;
  valorAdicionalBandeiraForaPonta: number;

  valorSubvencaoTarifaria: number;
  valorDescontoTUSD: number;

  lancamentosAdicionais?: ILancamentoAdicional[] | null;
}
