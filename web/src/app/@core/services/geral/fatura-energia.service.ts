import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { IFaturaEnergia } from "../../data/fatura.energia";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class FaturaEnergiaService extends DefaultService<IFaturaEnergia> {
  constructor(protected http: HttpService) {
    super(http, "fatura-energia");
  }
}