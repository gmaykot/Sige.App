import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { IValorAnual } from "../../data/valor-anual";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class ValorAnualContratoService extends DefaultService<IValorAnual> {
  constructor(protected http: HttpService) {
    super(http, "valor-anual");
  }
}
