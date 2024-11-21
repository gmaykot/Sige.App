import { NbMenuItem } from "@nebular/theme";

export interface IMenuSistema extends NbMenuItem{
    id: string,
    menuPredecessorId?: string,
    descPredecessor?: string,
    title: string,
    link: string,
    icon: string,
    expanded: boolean,
    ordem: number
}