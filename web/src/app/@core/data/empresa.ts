import { IAgenteMedicao } from "./agente-medicao";
import { IContato } from "./contato";

export interface IEmpresa {
    id: string,
    gestorId: string,
    empresaMatrizId: string,
    ativo: boolean,
    cnpj: string,
    nome: string,
    nomeFantasia: string,
    dadosCtaUc: string,
    fonteEnergia: string,
    logradouro: string,
    cidade: string,
    estado: string,
    subMercado: string,
    conexao: string,
    cep: string,
    bairro: string,
    responsavelGestor: string,
    agentesMedicao?: IAgenteMedicao[]
    contatos: IContato[]
}