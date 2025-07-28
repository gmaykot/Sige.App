import { Injectable } from "@angular/core";
import { IValorAnual } from "../../../@core/data/valor-anual";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";

@Injectable({ providedIn: "root" })
export class ValorAnualContratoService extends DefaultService<IValorAnual> {
  constructor(protected http: HttpService) {
    super(http, "valor-anual");
  }
}
