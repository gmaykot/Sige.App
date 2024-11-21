export interface IEmailData {
    contratoId?: string;
    contato: IContatoEmail;
    competencia: string;
    descCompetencia?: string;
    descEmpresa?:string;
    totalNota: string;
    relatorios?: string[];
    contatosCCO?: IContatoEmail[]
}

export interface IContatoEmail {
    id?: number;
    emailContato: string;
    nomeContato: string;
    tipoFornecedor: boolean;
}