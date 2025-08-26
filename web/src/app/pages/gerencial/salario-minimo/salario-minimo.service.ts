import { Injectable } from "@angular/core";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { SalarioMinimoEntity } from "./salario-minimo.interface";
import { Validators } from "@angular/forms";

@Injectable({ providedIn: "root" })
export class SalarioMinimoService extends DefaultService<SalarioMinimoEntity> {
  constructor(protected http: HttpService) {
    super(http, "salario-minimo");
  }
}

export const SalarioMinimoControl: DefaultValues<SalarioMinimoEntity> = {
  id: ['', null],
  vigenciaInicial: ['', [Validators.required]],
  vigenciaFinal: ['', null],
  valor: [0, [Validators.required]],
  ativo: [true, null]
};