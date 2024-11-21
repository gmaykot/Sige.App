import { ETipoEnergia } from "../enum/tipo-energia";

export interface IRelatorioEconomiaList {  
    contratoId: string;
    fornecedorId: string;
    dscGrupo: string;
    fase: string;
    descFornecedor: string;
    competencia: string;
    dataEmissao: string;
}

export interface IRelatorioEconomia {  
    id: string;
    contratoId: string,
    descGrupo: string;
    numContrato: string;
    descFornecedor: string;
    fase: string;
    competencia: string;
    dataEmissao: string;
    dataMedicao: string;
    dataBase: string;
    dataVigenciaInicial: string;
    dataVigenciaFinal: string;
    energiaContratada: number;
    valorUnitarioKwh: number;
    horasMes: number;
    takeMinimo: number;
    takeMaximo: number;
    totalMedido: number;
    tipoEnergia: ETipoEnergia;
    proinfa: number;
    icms: number;
    observacao: string;
    valoresAnaliticos: IValorAnaliticosEconomia[];
}

export interface IValorAnaliticosEconomia
{
    empresaId: string;
    numCnpj: string;
    descEmpresa: string;
    descEndereco: string;
    totalMedido: number,
    proinfa: number;
    icms: number;
}

export interface IRelatorioEconomiaRequest
{

}

export interface IValoresEconomia
{
    valorConsumoTotal: number,
    valorProduto: number,
    valorPerdas: number,
    faturarLongoPrazo: number,
    comprarCurtoPrazo: number,
    venderCurtoPrazo: number,
    takeMinimo: number,
    takeMaximo: number,
    dentroTake: boolean,
    resultadoFaturamento: IFaturamentoEconomia
}

export interface IValoresEconomiaAnalitico
{
    numCnpj: string,
    descEmpresa: string,
    descEndereco: string,
    quantidade: number,
    unidade: string,
    valorUnitario: number,
    valorICMS: number,
    valorProduto: number,
    valorNota: number,
    comprarCurtoPrazo: number,
    venderCurtoPrazo: number
}

export interface IFaturamentoEconomia {
    faturamento: string,
    quantidade: number,
    unidade: string,
    valorUnitario: number,
    valorICMS: number,
    valorProduto: number,
    valorNota: number
}