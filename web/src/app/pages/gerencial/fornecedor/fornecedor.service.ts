import { Injectable } from "@angular/core";
import { FornecedorEntity } from "./fornecedor.interface";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";
import { Validators } from "@angular/forms";

@Injectable({ providedIn: "root" })
export class FornecedorService extends DefaultService<FornecedorEntity> {
  constructor(protected http: HttpService) {
    super(http, "fornecedor");
  }
}

export const FornecedorControl: DefaultValues<FornecedorEntity> = {
  id: ["", null],
  nome: ["", [Validators.required]],
  cnpj: ["", [Validators.required]],
  telefoneContato: ["", [Validators.required]],
  telefoneAlternativo: ["", null],
  ativo: [true, null],
};