import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { IValorMensal } from "../../data/valor-mensal";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class ValorMensalContratoService extends DefaultService<IValorMensal> {
  constructor(protected http: HttpService) {
    super(http, "valor-mensal");
  }
}
