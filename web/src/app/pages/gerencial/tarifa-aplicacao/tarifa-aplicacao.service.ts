import { Injectable } from "@angular/core";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { TarifaAplicacaoEntity } from "./tarifa-aplicacao.interface";
import { Validators } from "@angular/forms";
import { EnergiaAcumuladaEntity } from "../energia-acumulada/energia-acumulada.interface";

@Injectable({ providedIn: "root" })
export class TarifaAplicacaoService extends DefaultService<TarifaAplicacaoEntity> {
  constructor(protected http: HttpService) {
    super(http, "tarifa-aplicacao");
  }
}

export const TarifaAplicacaoControl: DefaultValues<TarifaAplicacaoEntity> = {
  id: ['', null],
  descConcessionaria: ['', null],
  concessionariaId: ['', [Validators.required]],
  numeroResolucao: ['', [Validators.required]],
  subGrupo: [0, [Validators.required]],
  segmento: [0, [Validators.required]],
  dataUltimoReajuste: [null, [Validators.required]],
  kwPonta: [0, [Validators.required]],
  kwForaPonta: [0, [Validators.required]],
  kWhPontaTUSD: [0, [Validators.required]],
  kWhForaPontaTUSD: [0, [Validators.required]],
  kWhPontaTE: [0, [Validators.required]],
  kWhForaPontaTE: [0, [Validators.required]],
  reatKWhPFTE: [0, [Validators.required]],
  ativo: [true, [Validators.required]]
};