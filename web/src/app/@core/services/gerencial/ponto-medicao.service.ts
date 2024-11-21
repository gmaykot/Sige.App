import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { IPontoMedicao } from "../../data/ponto-medicao";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class PontoMedicaoService extends DefaultService<IPontoMedicao> {
  constructor(protected http: HttpService) {
    super(http, "ponto-medicao");
  }
}
