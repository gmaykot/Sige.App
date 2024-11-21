import { IMedicao } from "./medicao";

export interface IIntegracaoCCEE {
    totais: IIntegracaoCCEETotais;
    listaMedidas: IIntegracaoCCEEMedidas[];
    listaValoresGrafico: IValoresGrafico[];
    medicao?: IMedicao;
}

export interface IIntegracaoCCEETotais {
    mediaGeracaoAtiva: number;
    mediaGeracaoReativo: number;
    mediaConsumoAtivo: number;
    mediaConsumoReativo: number;
    somaGeracaoAtiva: number;
    somaGeracaoReativo: number;
    somaConsumoAtivo: number;
    totalConsumoHCC: number;
    totalConsumoHIF: number;
    somaConsumoAtivostr: string;
    somaConsumoAtivo3str: string;
    percPerdastr: string;
    somaConsumoReativo: number;
    somaConsumoReativostr: string;
    diasConsumoHCC: number;
    diasConsumoHIF: number;
}

export interface IIntegracaoCCEEMedidas {
    periodoFinal: string;
    pontoMedicao: string;
    subTipo: string;
    status: string;
    geracaoAtiva: number;
    geracaoReativo: number;
    consumoAtivo: number;
    consumoReativo: number;
}

export interface IValoresGrafico {
    dia: string;
    totalConsumoHIF: number;
    totalConsumoHCC: number;
}