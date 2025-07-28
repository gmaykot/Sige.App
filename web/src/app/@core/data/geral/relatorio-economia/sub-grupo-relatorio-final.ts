import { ILancamentoRelatorioFinal } from "./lancamento-relatorio-final";

export interface ISubGrupoRelatorioFinal {
    lancamentos: ILancamentoRelatorioFinal[];
    total: ILancamentoRelatorioFinal;
  }