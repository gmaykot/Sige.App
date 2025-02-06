import { IContratoEmpresas } from "./contrato-empresas";
import { IValorAnual } from "./valor-anual";

export interface IContrato {
    id?: string, 
    numero?: string, 
    tipoEnergia?: string, 
    dscGrupo?: string, 
    dataBase?: string,
    dataVigenciaInicial?: string,
    dataVigenciaFinal?: string,
    takeMinimo?: number,
    takeMaximo?: number,
    energiaContratada?: number;
    status?: string,
    segmento?: string,
    ativo?: boolean,
    concessionariaId?: string,
    fornecedorId?: string,
    descFornecedor?: string,
    descConcessionaria?: string,
    contratoEmpresas?: IContratoEmpresas[],
    valoresAnuaisContrato?: IValorAnual[]
}