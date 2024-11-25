export interface IBandeiraTarifaria {
    id?: string, 
    dataVigenciaInicial?: string,
    dataVigenciaFinal?: string,
    takeMinimo?: number,
    valorBandeiraVerde?: number,
    valorBandeiraAmarela?: number,
    valorBandeiraVermelha1?: number,
    valorBandeiraVermelha2?: number,    
    ativo?: boolean
}