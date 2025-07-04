import { Injectable } from "@angular/core";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { TarifaAplicacaoEntity } from "./tarifa-aplicacao.interface";

@Injectable({ providedIn: "root" })
export class TarifaAplicacaoService extends DefaultService<TarifaAplicacaoEntity> {
  constructor(protected http: HttpService) {
    super(http, "tarifa-aplicacao");
  }
}