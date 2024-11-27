export interface IBandeiraTarifaria {
    id?: string, 
    vigenciaInicial: string,
    vigenciaFinal?: string,
    takeMinimo: number,
    valorBandeiraVerde: number,
    valorBandeiraAmarela: number,
    valorBandeiraVermelha1: number,
    valorBandeiraVermelha2: number,    
    ativo?: boolean
}