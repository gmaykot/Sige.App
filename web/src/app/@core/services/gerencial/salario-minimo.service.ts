import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { ISalarioMinimo } from "../../data/gerencial/salario-minimo";

@Injectable({ providedIn: "root" })
export class SalarioMinimoService extends DefaultService<ISalarioMinimo> {
  constructor(protected http: HttpService) {
    super(http, "salario-minimo");
  }
}