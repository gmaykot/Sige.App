import { Injectable } from "@angular/core";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { ISalarioMinimo } from "../../../@core/data/gerencial/salario-minimo";

@Injectable({ providedIn: "root" })
export class SalarioMinimoService extends DefaultService<ISalarioMinimo> {
  constructor(protected http: HttpService) {
    super(http, "salario-minimo");
  }
}