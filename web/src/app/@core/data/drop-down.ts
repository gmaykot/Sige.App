export interface IDropDown {
    id?: string;
    descricao: string;
    obs?: string;
    subGrupo?: IDropDown[]
}