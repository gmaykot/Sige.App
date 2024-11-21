import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { ITarifaAplicacao } from "../../data/tarifa-aplicacao";

@Injectable({ providedIn: "root" })
export class TarifaAplicacaoService extends DefaultService<ITarifaAplicacao> {
  constructor(protected http: HttpService) {
    super(http, "tarifa-aplicacao");
  }
}