import { Injectable } from '@angular/core';
import { IResponseInterface } from '../../data/response.interface';
import { IColetaMedicao, IMedicao } from '../../data/medicao';
import { IMedicaoValores, IResultadoMedicao } from '../../data/resultado-medicao';
import { IIntegracaoCCEE } from '../../data/integracao-ccee.response';
import { IAgenteMedicao } from '../../data/agente-medicao';
import { HttpService } from '../util/http.service';

@Injectable({ providedIn: 'root' })
export class MedicaoService {
   
    constructor(private http: HttpService) {}

    public async post(medicao: IMedicao): Promise<IResponseInterface<IResultadoMedicao>>
    {
        return await this.http.post<IResponseInterface<IResultadoMedicao>>("/medicao", medicao);
    }

    public async postValores(medicaoValores: IMedicaoValores): Promise<IResponseInterface<any>>
    {
        return await this.http.post<IResponseInterface<any>>("/medicao/valores", medicaoValores);
    }

    public async coletar(medicao: IColetaMedicao): Promise<IResponseInterface<IIntegracaoCCEE>>
    {
        return await this.http.post<IResponseInterface<IIntegracaoCCEE>>("/medicao/coletar", medicao);
    }

    public async coletarResultado(medicao: IMedicao): Promise<IResponseInterface<IIntegracaoCCEE>>
    {
        return await this.http.post<IResponseInterface<IIntegracaoCCEE>>("/medicao/resultado", medicao);
    }

    public async medicaoPorContrato(contratoId: string, mesReferencia: string): Promise<IResponseInterface<any[]>>
    {
        let query = '?';
        if (contratoId && contratoId != null)
            query += 'contratoId='+contratoId+'&';
        if (mesReferencia && mesReferencia != null)
            query += 'mesReferencia='+mesReferencia+'&';
        return await this.http.get<IResponseInterface<any[]>>(`/medicao/medicao-contrato${query}`);
    }

    public async get(empresaId: string, periodo: string, faseMedicao: string, statusMedicao: string): Promise<IResponseInterface<IMedicao[]>> {
        let query = '?';
        if (empresaId && empresaId != null)
            query += 'empresaId='+empresaId+'&';
        if (faseMedicao && faseMedicao != null)
            query += 'faseMedicao='+faseMedicao+'&';
        if (statusMedicao && statusMedicao != null)
            query += 'statusMedicao='+statusMedicao+'&';
        if (periodo && periodo != null)
            query += 'periodo='+periodo;
                return await this.http.get<IResponseInterface<IMedicao[]>>(`/medicao${query}`);
    }
    
    public async getAgentes(empresaId: string): Promise<IResponseInterface<IAgenteMedicao[]>> {
        let query = '?';
        if (empresaId && empresaId != null)
            query += 'empresaId='+empresaId;
                return await this.http.get<IResponseInterface<IAgenteMedicao[]>>("/medicao/agentes"+query);
    }
}
