import { Injectable } from "@angular/core";
import { HttpService } from "../util/http.service";
import { IResponseInterface } from "../../data/response.interface";

@Injectable({ providedIn: "root" })
export class GerenciamentoMensalService {
  constructor(protected http: HttpService) {
    
  }
}