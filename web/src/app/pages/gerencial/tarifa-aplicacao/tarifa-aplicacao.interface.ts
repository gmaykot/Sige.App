import { BaseEntity } from "../../../@core/entity/base-entity.interface";

export class TarifaAplicacaoEntity implements BaseEntity {
    id?: string;
    concessionariaId?: string;
    descConcessionaria?: string;
    numeroResolucao?: string;
    subGrupo?: number;
    segmento?: number;
    dataUltimoReajuste?: string;
    kwPonta?: number;
    kwForaPonta?: number;
    kWhPontaTUSD?: number;
    kWhForaPontaTUSD?: number;
    kWhPontaTE?: number;
    kWhForaPontaTE?: number;
    reatKWhPFTE?: number;
    ativo?: boolean;

    static SourceInstance(): TarifaAplicacaoEntity {
        return {
          id: "",
          descConcessionaria: "",
          subGrupo: 0,
          segmento: 0,
          dataUltimoReajuste: "",
          numeroResolucao: ""
        };
    };
}