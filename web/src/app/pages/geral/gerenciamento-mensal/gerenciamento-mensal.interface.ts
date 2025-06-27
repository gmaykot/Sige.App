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
    icms: number
}

export interface IBandeiraTarifariaVigente {
    id: string,
    bandeiraTarifariaId: string,
    mesReferencia: string,
    bandeira: string
}