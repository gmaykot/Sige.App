import { IValorMensal } from "./valor-mensal";

export interface IValorAnual {
    id: string;
    dataVigenciaInicial: string;
    dataVigenciaFinal: string;
    valorUnitarioKwh: number;
    contratoId: string;
    valoresMensaisContrato: IValorMensal[]
}