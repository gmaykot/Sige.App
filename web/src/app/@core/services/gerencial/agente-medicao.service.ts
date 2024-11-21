import { Injectable } from "@angular/core";
import { DefaultService } from "../default-service";
import { IAgenteMedicao } from "../../data/agente-medicao";
import { HttpService } from "../util/http.service";

@Injectable({ providedIn: "root" })
export class AgenteMedicaoService extends DefaultService<IAgenteMedicao> {
  constructor(protected http: HttpService) {
    super(http, "agente-medicao");
  }
}
