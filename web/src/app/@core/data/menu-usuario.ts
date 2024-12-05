export interface IMenuUsuario {
    id?: string,
    menuSistemaId: string,
    menuSistemaDesc?: string,
    usuarioId: string,
    tipoPerfil: string,
    descMenu?: string
    descPredecessor?: string
    menuAtivo?: boolean
}