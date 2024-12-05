export interface Usuario {
    id: string;
    name: string;
    su: string;
    picture: string;
}

export interface IUsuario {
    id: string;
    nome: string;
    apelido: string;
    email: string;
    senha: string;
    contraSenha: string;
    ativo: boolean;
    superUsuario: boolean;
}

export interface IUsuarioSenha {
    id: string;
    novaSenha: string;
    senhaAntiga: string;
}