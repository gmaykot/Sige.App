export interface IMedicao {
    id?: string;
    empresaId?: string;
    pontoMedicaoId: string;
    descEmpresa?: string;
    descAgente?: string;
    codAgente?: string;
    dataMedicao?: string;
    dataVigenciaInicial?: string;
    dataVigenciaFinal?: string;
    periodo?: string;
    faseMedicao?: string;
    statusMedicao?: string;
    pontoMedicao?: string;
    descPontoMedicao?: string;
    icms?: number;
    proinfa?: number;
}

export interface IColetaMedicao {
    periodo: string;
    medicoes: IMedicao[];
}