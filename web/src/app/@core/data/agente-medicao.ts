import { IPontoMedicao } from "./ponto-medicao";

export interface IAgenteMedicao {
    id: string,
    empresaId: string,
    nome: string,
    codigoPerfilAgente: string,
    ativo: boolean,
    pontosMedicao?: IPontoMedicao[],
    dataExclusao?: string
}