export interface IPontoMedicao {
    id: string,
    nome: string,
    codigo: string,
    agenteMedicao: string,
    agenteMedicaoId?: string,
    ativo: boolean
}