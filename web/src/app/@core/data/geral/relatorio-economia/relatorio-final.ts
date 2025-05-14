import { ICabecalhoRelatorioFinal } from "./cabecalho-relatorio-final";
import { IComparativoRelatorioFinal } from "./comparativo-relatorio-final";
import { IGraficoRelatorioFinal } from "./grafico-relatorio-final";
import { IGrupoRelatorioFinal } from "./grupo-relatorio-final";

export interface IRelatorioFinal {
  cabecalho: ICabecalhoRelatorioFinal;
  grupos: IGrupoRelatorioFinal[];
  comparativo: IComparativoRelatorioFinal;
  grafico: IGraficoRelatorioFinal;
}