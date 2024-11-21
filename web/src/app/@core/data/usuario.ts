import { ETipoPerfil } from "../enum/ETipoPerfil";

export interface Usuario {
    id: string;
    name: string;
    picture: string;
}

export interface IUsuario {
    id: string;
    nome: string;
    apelido: string;
    email: string;
    senha: string;
    contraSenha: string;
    ativo: boolean
}

export interface IUsuarioSenha {
    id: string;
    novaSenha: string;
    senhaAntiga: string;
}