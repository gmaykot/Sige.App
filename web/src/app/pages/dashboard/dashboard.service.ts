import { Injectable } from "@angular/core";
import { IChecklist } from "../../@core/data/administrativo/checklist";
import { IConsumoMeses } from "../../@core/data/administrativo/consumo-meses";
import { IContratosFinalizados } from "../../@core/data/administrativo/contratos-finalizados";
import { IStatusMedicao } from "../../@core/data/administrativo/status-medicao";
import { IResponseInterface } from "../../@core/data/response.interface";
import { DefaultService } from "../../@core/services/default-service";
import { HttpService } from "../../@core/services/util/http.service";

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