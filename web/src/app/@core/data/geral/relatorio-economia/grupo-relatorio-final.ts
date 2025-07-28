import { ILancamentoRelatorioFinal } from "./lancamento-relatorio-final";
import { ISubGrupoRelatorioFinal } from "./sub-grupo-relatorio-final";

export interface IGrupoRelatorioFinal {
  ordem?: number;
  titulo: string;
  colunaQuantidade: string;
  colunaValor: string;
  colunaTotal: string;
  subGrupos?: ISubGrupoRelatorioFinal[];
  total?: ILancamentoRelatorioFinal;
}
