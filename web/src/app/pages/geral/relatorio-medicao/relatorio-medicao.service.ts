import { Injectable } from '@angular/core';
import { HttpService } from '../../../@core/services/util/http.service';
import { IRelatorioMedicaoList, IRelatorioMedicao } from '../../../@core/data/relatorio-medicao';
import { DefaultService } from '../../../@core/services/default-service';
import { IRelatorioFinal } from '../../../@core/data/geral/relatorio-economia/relatorio-final';
import { IResponseInterface } from '../../../@core/data/response.interface';

@Injectable({ providedIn: 'root' })
export class RelatorioMedicaoService extends DefaultService<IRelatorioMedicao> {
   
    constructor(protected http: HttpService) {
        super(http, "relatorio-medicao");
    }
   
    public async getRelatorios(relatorio: any): Promise<IResponseInterface<IRelatorioMedicaoList[]>> {
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
