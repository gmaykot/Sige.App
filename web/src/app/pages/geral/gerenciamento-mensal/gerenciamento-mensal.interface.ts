export interface IPisCofinsMensal {
    id: string,
    mesReferencia: string,
    descConcessionaria: string,
    concessionariaId: string,
    pis: number,
    cofins: number
}

export interface IProinfaIcmsMensal {
    id: string,
    mesReferencia: string,
    descPontoMedicao: string,
    proinfa: number,
    icms: number,
    valorDescontoRETUSD: number
}

export interface IBandeiraTarifariaVigente {
    id: string,
    bandeiraTarifariaId: string,
    mesReferencia: string,
    bandeira: string
}

export interface IDescontoTusdMensal {
    id: string,
    mesReferencia: string,
    descFornecedor: string,
    fornecedorId: string,
    tipoEnergia: string,
    valorDescontoTUSD: number,
    valorDescontoRETUSD: number
}