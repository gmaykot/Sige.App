import { Injectable } from '@angular/core';
import { IResponseIntercace } from '../../data/response.interface';
import { IColetaMedicao, IMedicao } from '../../data/medicao';
import { IMedicaoValores, IResultadoMedicao } from '../../data/resultado-medicao';
import { IIntegracaoCCEE } from '../../data/integracao-ccee.response';
import { IAgenteMedicao } from '../../data/agente-medicao';
import { HttpService } from '../util/http.service';

@Injectable({ providedIn: 'root' })
export class MedicaoService {
   
    constructor(private http: HttpService) {}

    public async post(medicao: IMedicao): Promise<IResponseIntercace<IResultadoMedicao>>
    {
        return await this.http.post<IResponseIntercace<IResultadoMedicao>>("/medicao", medicao);
    }

    public async postValores(medicaoValores: IMedicaoValores): Promise<IResponseIntercace<any>>
    {
        return await this.http.post<IResponseIntercace<any>>("/medicao/valores", medicaoValores);
    }

    public async coletar(medicao: IColetaMedicao): Promise<IResponseIntercace<IIntegracaoCCEE>>
    {
        return await this.http.post<IResponseIntercace<IIntegracaoCCEE>>("/medicao/coletar", medicao);
    }

    public async coletarResultado(medicao: IMedicao): Promise<IResponseIntercace<IIntegracaoCCEE>>
    {
        return await this.http.post<IResponseIntercace<IIntegracaoCCEE>>("/medicao/resultado", medicao);
    }

    public async medicaoPorContrato(contratoId: string, competencia: string): Promise<IResponseIntercace<any[]>>
    {
        let query = '?';
        if (contratoId && contratoId != null)
            query += 'contratoId='+contratoId+'&';
        if (competencia && competencia != null)
            query += 'competencia='+competencia+'&';
        return await this.http.get<IResponseIntercace<any[]>>(`/medicao/medicao-contrato${query}`);
    }

    public async get(empresaId: string, periodo: string, faseMedicao: string, statusMedicao: string): Promise<IResponseIntercace<IMedicao[]>> {
        let query = '?';
        if (empresaId && empresaId != null)
            query += 'empresaId='+empresaId+'&';
        if (faseMedicao && faseMedicao != null)
            query += 'faseMedicao='+faseMedicao+'&';
        if (statusMedicao && statusMedicao != null)
            query += 'statusMedicao='+statusMedicao+'&';
        if (periodo && periodo != null)
            query += 'periodo='+periodo;
                return await this.http.get<IResponseIntercace<IMedicao[]>>(`/medicao${query}`);
    }
    
    public async getAgentes(empresaId: string): Promise<IResponseIntercace<IAgenteMedicao[]>> {
        let query = '?';
        if (empresaId && empresaId != null)
            query += 'empresaId='+empresaId;
                return await this.http.get<IResponseIntercace<IAgenteMedicao[]>>("/medicao/agentes"+query);
    }
}
