import { Injectable } from "@angular/core";
import { IAnaliseViabilidade } from "../../../@core/data/analise-viabilidade";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { HttpService } from "../../../@core/services/util/http.service";


@Injectable({ providedIn: 'root' })
export class AnailseViabilidadeService {
   
    constructor(private http: HttpService) {}

    public async post(analise: IAnaliseViabilidade): Promise<IResponseInterface<IAnaliseViabilidade[]>[]>
    {
        return await this.http.post<IResponseInterface<IAnaliseViabilidade[]>[]>("/analise-viabilidade", analise);
    }
}
