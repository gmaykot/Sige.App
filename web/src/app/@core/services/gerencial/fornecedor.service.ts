import { Injectable } from "@angular/core";
import { IFornecedor } from "../../data/fornecedor";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class FornecedorService extends DefaultService<IFornecedor> {
  constructor(protected http: HttpService) {
    super(http, "fornecedor");
  }
}
