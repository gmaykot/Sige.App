import { Injectable } from '@angular/core';
import { IResponseInterface } from '../../data/response.interface';
import { HttpService } from '../util/http.service';
import { IRelatorioMedicaoRequest, IRelatorioMedicaoList, IRelatorioMedicao } from '../../data/relatorio-medicao';
import { DefaultService } from '../default-service';
import { IRelatorioFinal } from '../../data/geral/relatorio-economia/relatorio-final';

@Injectable({ providedIn: 'root' })
export class RelatorioMedicaoService extends DefaultService<IRelatorioMedicao> {
   
    constructor(protected http: HttpService) {
        super(http, "relatorio-medicao");
    }
   
    public async getRelatorios(relatorio: IRelatorioMedicaoRequest): Promise<IResponseInterface<IRelatorioMedicaoList[]>> {
        return await this.http.post<IResponseInterface<IRelatorioMedicaoList[]>>(`/${this.urlBase}`, relatorio);
    }

    public async getFinal(): Promise<IResponseInterface<IRelatorioFinal>> {
        return await this.http.get<IResponseInterface<IRelatorioFinal>>(`/${this.urlBase}/final`);
    }

    public async getRelatorio(contratoId: string, mesReferencia: string): Promise<IResponseInterface<IRelatorioMedicao>> {
        let query = '?';
        if (contratoId && contratoId != null)
            query += 'contratoId='+contratoId+'&';
        if (mesReferencia && mesReferencia != null)
            query += 'mesReferencia='+mesReferencia;
        const ret = await this.http.get<IResponseInterface<IRelatorioMedicao>>(`/${this.urlBase}${query}`);
        const formattedReq = this.formatPosGet(ret.data);
        return { ...ret, data: formattedReq };
    }
}
