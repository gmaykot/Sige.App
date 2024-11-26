import { Injectable } from '@angular/core';
import { IResponseInterface } from '../../data/response.interface';
import { HttpService } from '../util/http.service';
import { IRelatorioEconomia, IRelatorioEconomiaList, IRelatorioEconomiaRequest } from '../../data/relatorio-economia';

@Injectable({ providedIn: 'root' })
export class RelatorioEconomiaService {
   
    constructor(private http: HttpService) {}
   
    public async getRelatorios(relatorio: IRelatorioEconomiaRequest): Promise<IResponseInterface<IRelatorioEconomiaList[]>> {
        return await this.http.post<IResponseInterface<IRelatorioEconomiaList[]>>("/relatorio-economia", relatorio);
    }

    public async get(contratoId: string, competencia: string): Promise<IResponseInterface<IRelatorioEconomia>> {
        let query = '?';
        if (contratoId && contratoId != null)
            query += 'contratoId='+contratoId+'&';
        if (competencia && competencia != null)
            query += 'competencia='+competencia;
        return await this.http.get<IResponseInterface<IRelatorioEconomia>>(`/relatorio-economia${query}`);
    }
}
