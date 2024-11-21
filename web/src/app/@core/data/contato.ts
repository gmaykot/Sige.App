export interface IContato {
    id: string,
    fornecedorId?: string,
    empresaId?: string,
    nome: string,
    telefone: string,
    email: string,
    cargo: string,
    recebeEmail: boolean,
    ativo: boolean
}