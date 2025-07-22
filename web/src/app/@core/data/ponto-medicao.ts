export interface IPontoMedicao {
    id: string,
    nome: string,
    codigo: string,
    agenteMedicao: string,
    agenteMedicaoId?: string,
    segmento?: string,
    tipoEnergia?: string,
    conexao?: string,
    concessionariaId?: string,
    descConcessionaria?: string,
    acumulacaoLiquida: boolean,
    incideICMS: boolean,
    ativo: boolean,
    dataExclusao?: string
}