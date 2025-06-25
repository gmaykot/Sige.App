export interface ITarifaAplicacao {
    id: string,
    concessionariaId: string,
    descConcessionaria?: string,
    numeroResolucao: string,
    subGrupo : number,
    segmento : number,
    dataUltimoReajuste?: string,
    kwPonta: number,
    kwForaPonta: number,
    kWhPontaTUSD: number,
    kWhForaPontaTUSD: number,
    kWhPontaTE: number,
    kWhForaPontaTE: number,
    reatKWhPFTE: number,
    ativo: boolean
}