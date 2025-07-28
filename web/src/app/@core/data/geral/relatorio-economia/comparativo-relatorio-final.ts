import { ILancamentoComparativoFinal } from "./lancamento-comparativo-final";

export interface IComparativoRelatorioFinal
{
      titulo?: string;
      observacao?: string;
      lancamentos?: ILancamentoComparativoFinal[];    
}