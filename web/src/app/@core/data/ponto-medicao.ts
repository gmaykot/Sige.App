export interface IPontoMedicao {
    id: string,
    nome: string,
    codigo: string,
    agenteMedicao: string,
    agenteMedicaoId?: string,
    segmento?: string,
    conexao?: string,
    concessionariaId?: string,
    descConcessionaria?: string,
    acumulacaoLiquida: boolean,
    ativo: boolean
}