import { Injectable } from '@angular/core';
import { IResponseInterface } from '../../data/response.interface';
import { HttpService } from '../util/http.service';
import { DefaultService } from '../default-service';
import { IRelatorioFinal } from '../../data/geral/relatorio-economia/relatorio-final';
import { IRelatorioEconomiaList, IRelatorioEconomiaRequest } from '../../data/gerencial/relatorio-economia';

@Injectable({ providedIn: 'root' })
export class RelatorioEconomiaService extends DefaultService<IRelatorioFinal> {
   
    constructor(protected http: HttpService) {
        super(http, "relatorio-economia");
    }

    public async getRelatorios(mesReferencia: string): Promise<IResponseInterface<IRelatorioEconomiaList[]>> {
        return await this.http.get<IResponseInterface<IRelatorioEconomiaList[]>>(`/${this.urlBase}/${mesReferencia ?? new Date().toISOString().split("T")[0]}`);
    }
   
    public async getFinal(pontoMedicaoId: string, mesReferencia: string): Promise<IResponseInterface<IRelatorioFinal>> {
        return await this.http.get<IResponseInterface<IRelatorioFinal>>(`/${this.urlBase}/final/${pontoMedicaoId}/${mesReferencia}`);
    }

    public async getFinalPdf(pontoMedicaoId: string, mesReferencia: string): Promise<IResponseInterface<IRelatorioFinal>> {
        return await this.http.get<IResponseInterface<IRelatorioFinal>>(`/${this.urlBase}/final/${pontoMedicaoId}/${mesReferencia}/pdf`);
    }
}
