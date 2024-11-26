import { Injectable } from "@angular/core";
import { IImpostoConcessionaria } from "../../data/imposto-concessionaria";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class ImpostoConcessionariaService extends DefaultService<IImpostoConcessionaria> {
  constructor(protected http: HttpService) {
    super(http, "imposto-concessionaria");
  }
}