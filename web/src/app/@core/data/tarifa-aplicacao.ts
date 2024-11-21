export interface ITarifaAplicacao {
    id: string,
    concessionariaId: string,
    descConcessionaria?: string,
    numeroResolucao: string,
    subGrupo : string,
    modalidade : string,
    dataUltimoReajuste?: string,
    kwPonta: number,
    kwForaPonta: number,
    kWhPontaTUSD: number,
    kWhForaPontaTUSD: number,
    kWhPontaTE: number,
    kWhForaPontaTE: number,
    reatKWhPFTE: number
}