export interface IEmailData {
    contratoId?: string;
    relatorioMedicaoId?: string;
    contato: IContatoEmail;
    mesReferencia: string;
    descMesReferencia?: string;
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