import { ETipoEnergia } from "../enum/tipo-energia";

export interface IRelatorioMedicaoList {  
    contratoId: string;
    fornecedorId: string;
    dscGrupo: string;
    fase: string;
    descFornecedor: string;
    mesReferencia: string;
    dataEmissao: string;
}

export interface IRelatorioMedicao {  
    id: string;
    contratoId: string;
    descGrupo: string;
    numContrato: string;
    descFornecedor: string;
    fase: string;
    mesReferencia: string;
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
    valorCompraCurtoPrazo: number;
    valorVendaCurtoPrazo: number;
    icms: number;
    observacao?: string;
    observacaoValidacao?: string;
    validado?: boolean;
    usuarioResponsavelId?: string;
    valoresAnaliticos: IValorAnaliticoMedicao[];
}

export interface IValorAnaliticoMedicao
{
    empresaId: string;
    numCnpj: string;
    descEmpresa: string;
    descEndereco: string;
    totalMedido: number,
    proinfa: number;
    icms: number;
}

export interface IValoresMedicao
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
    resultadoFaturamento: IFaturamentoMedicao
}

export interface IValoresMedicaoAnalitico
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

export interface IFaturamentoMedicao {
    faturamento: string,
    quantidade: number,
    unidade: string,
    valorUnitario: number,
    valorICMS: number,
    valorProduto: number,
    valorNota: number
}