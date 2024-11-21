export interface IAnaliseViabilidade {
    tipoSegmento?: string,
    clienteId: string,
    concessionariaId: string,
    pchKWhFornecedorZero: number,
    pchKWhFornecedorCinquenta: number,
    pchKWhFornecedorCem: number,
    encConexao: number,
    essEncServicoSist: number,
    demPta: number,
    demFPta: number,
    kWhPta: number,
    kWhFPta: number    
}