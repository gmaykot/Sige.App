import { IContato } from "./contato";

export interface IFornecedor {
    id: string,
    gestorId?: string,
    nome: string,
    cnpj: string,
    telefoneContato: string,
    telefoneAlternativo: string,
    ativo: boolean,
    contatos: IContato[]
}