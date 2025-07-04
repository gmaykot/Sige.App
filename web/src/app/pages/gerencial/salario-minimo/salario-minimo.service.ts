import { Injectable } from "@angular/core";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { SalarioMinimoEntity } from "./salario-minimo.interface";

@Injectable({ providedIn: "root" })
export class SalarioMinimoService extends DefaultService<SalarioMinimoEntity> {
  constructor(protected http: HttpService) {
    super(http, "salario-minimo");
  }
}