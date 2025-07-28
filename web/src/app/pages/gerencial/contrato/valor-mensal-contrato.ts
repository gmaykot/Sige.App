import { Injectable } from "@angular/core";
import { IValorMensal } from "../../../@core/data/valor-mensal";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";


@Injectable({ providedIn: "root" })
export class ValorMensalContratoService extends DefaultService<IValorMensal> {
  constructor(protected http: HttpService) {
    super(http, "valor-mensal");
  }
}
