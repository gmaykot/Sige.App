import { Injectable } from "@angular/core";
import { IResponseInterface } from "../../data/response.interface";
import { HttpService } from "../util/http.service";
import { IChecklist } from "../../data/administrativo/checklist";
import { IConsumoMeses } from "../../data/administrativo/consumo-meses";
import { IContratosFinalizados } from "../../data/administrativo/contratos-finalizados";
import { IStatusMedicao } from "../../data/administrativo/status-medicao";
import { DefaultService } from "../default-service";

@Injectable({ providedIn: "root" })
export class DashboardService extends DefaultService<any>{
    private numMeses = 6;
    private mesReferencia = new Date().toISOString();

    constructor(protected http: HttpService) {
        super(http, "dashboard");
    }

    public async obterChecklist(): Promise<IResponseInterface<IChecklist[]>> {
        return await this.http.get<IResponseInterface<IChecklist[]>>(
            `/${this.urlBase}/checklist/${this.mesReferencia}`
        );
    }

    public async obterConsumoMeses(): Promise<IResponseInterface<IConsumoMeses[]>> {
        return await this.http.get<IResponseInterface<IConsumoMeses[]>>(
            `/${this.urlBase}/consumo-meses/${this.mesReferencia}/meses/${this.numMeses}`
        );
    }

    public async obterContratosFinalizados(): Promise<IResponseInterface<IContratosFinalizados[]>> {
        var ret = await this.http.get<IResponseInterface<IContratosFinalizados[]>>(
            `/${this.urlBase}/contratos-finalizados/${this.mesReferencia}`
        );        
        const formattedReq = this.formatPosGet(ret?.data);
        return { ...ret, data: formattedReq };
    }

    public async obterStatusMedicoes(): Promise<IResponseInterface<IStatusMedicao[]>> {
        return await this.http.get<IResponseInterface<IStatusMedicao[]>>(
            `/${this.urlBase}/status-medicoes/${this.mesReferencia}`
        );
    }
}