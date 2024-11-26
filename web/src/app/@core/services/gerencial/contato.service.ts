import { Injectable } from "@angular/core";
import { IContato } from "../../data/contato";
import { DefaultService } from "../default-service";
import { HttpService } from "../util/http.service";
import { IResponseInterface } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class ContatoService extends DefaultService<IContato> {
  constructor(protected http: HttpService) {
    super(http, "contato");
  }

  public async getPorFornecedor(idFornecedor: string): Promise<IResponseInterface<IContato[]>> 
  {
      return await this.http.get<IResponseInterface<IContato[]>>(`/contato/fornecedor/${idFornecedor}`);
  }
}
