import { Injectable } from '@angular/core';
import { IResponseIntercace } from '../../data/response.interface';
import { IAnaliseViabilidade } from '../../data/analise-viabilidade';
import { HttpService } from '../util/http.service';

@Injectable({ providedIn: 'root' })
export class AnailseViabilidadeService {
   
    constructor(private http: HttpService) {}

    public async post(analise: IAnaliseViabilidade): Promise<IResponseIntercace<IAnaliseViabilidade[]>[]>
    {
        return await this.http.post<IResponseIntercace<IAnaliseViabilidade[]>[]>("/analise-viabilidade", analise);
    }
}
