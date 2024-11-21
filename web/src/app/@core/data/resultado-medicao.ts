import { IContrato } from "./contrato";

export interface IResultadoMedicao {  
    empresaId: string;
    dataMedicao: string;
    contrato: IContrato;
}

export interface IMedicaoValores {  
    id: string;
    icms: number;
    proinfa: number;
}