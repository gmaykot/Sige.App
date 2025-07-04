import { BaseEntity } from "../../../@core/entity/base-entity.interface";

export class SalarioMinimoEntity implements BaseEntity {
  id?: string;
  vigenciaInicial?: Date;
  vigenciaFinal?: Date;
  valor?: number;
  ativo?: boolean;

  static SourceInstance(): SalarioMinimoEntity {
    return {
      id: "",
      vigenciaInicial: new Date(),
      vigenciaFinal: new Date(),
      valor: 0
    };
  }
}
