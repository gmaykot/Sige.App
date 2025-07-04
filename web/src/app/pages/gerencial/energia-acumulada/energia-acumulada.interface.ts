import { BaseEntity } from "../../../@core/entity/base-entity.interface";

export class EnergiaAcumuladaEntity implements BaseEntity{
  id?: string; 
  pontoMedicaoId?: string;
  pontoMedicaoDesc?: string;
  mesReferencia?: string;
  valorMensalAcumulado?: number;
  valorTotalAcumulado?: number;

  static SourceInstance(): EnergiaAcumuladaEntity {
    return {
      id: "",
      pontoMedicaoDesc: "",
      mesReferencia: "",
      valorMensalAcumulado: 0,
      valorTotalAcumulado: 0,
    };
  }

  static SourceHistoricoInstance(): EnergiaAcumuladaEntity {
    return {
      id: "",
      mesReferencia: "",
      valorMensalAcumulado: 0,
      valorTotalAcumulado: 0,
    };
  }
}