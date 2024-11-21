import { Injectable } from "@angular/core";
import { IValorConcessionaria } from "../../data/valores-concessionarias";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class ValorConcessionariaService extends DefaultService<IValorConcessionaria> {
  constructor(protected http: HttpService) {
    super(http, "valor-concessionaria");
  }
}
