import { Injectable } from "@angular/core";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { ITarifaAplicacao } from "../../../@core/data/tarifa-aplicacao";

@Injectable({ providedIn: "root" })
export class TarifaAplicacaoService extends DefaultService<ITarifaAplicacao> {
  constructor(protected http: HttpService) {
    super(http, "tarifa-aplicacao");
  }
}