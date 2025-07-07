import { Injectable } from "@angular/core";
import { IAgenteMedicao } from "../../../@core/data/agente-medicao";
import { DefaultService } from "../../../@core/services/default-service";
import { HttpService } from "../../../@core/services/util/http.service";


@Injectable({ providedIn: "root" })
export class AgenteMedicaoService extends DefaultService<IAgenteMedicao> {
  constructor(protected http: HttpService) {
    super(http, "agente-medicao");
  }
}
