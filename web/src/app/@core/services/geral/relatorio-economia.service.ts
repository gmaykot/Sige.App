import { Injectable } from '@angular/core';
import { IResponseInterface } from '../../data/response.interface';
import { HttpService } from '../util/http.service';
import { DefaultService } from '../default-service';
import { IRelatorioFinal } from '../../data/geral/relatorio-economia/relatorio-final';

@Injectable({ providedIn: 'root' })
export class RelatorioEconomiaService extends DefaultService<IRelatorioFinal> {
   
    constructor(protected http: HttpService) {
        super(http, "relatorio-economia");
    }
   
    public async getFinal(): Promise<IResponseInterface<IRelatorioFinal>> {
        return await this.http.get<IResponseInterface<IRelatorioFinal>>(`/${this.urlBase}/final`);
    }
}
