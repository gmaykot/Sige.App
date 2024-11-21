import { Injectable } from "@angular/core";
import { IValorPadrao } from "../../data/valor-padrao";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class ValorPadraoService extends DefaultService<IValorPadrao> {
  constructor(protected http: HttpService) {
    super(http, "valor-padrao");
  }
}