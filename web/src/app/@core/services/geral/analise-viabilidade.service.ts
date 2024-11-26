import { Injectable } from '@angular/core';
import { IResponseInterface } from '../../data/response.interface';
import { IAnaliseViabilidade } from '../../data/analise-viabilidade';
import { HttpService } from '../util/http.service';

@Injectable({ providedIn: 'root' })
export class AnailseViabilidadeService {
   
    constructor(private http: HttpService) {}

    public async post(analise: IAnaliseViabilidade): Promise<IResponseInterface<IAnaliseViabilidade[]>[]>
    {
        return await this.http.post<IResponseInterface<IAnaliseViabilidade[]>[]>("/analise-viabilidade", analise);
    }
}
