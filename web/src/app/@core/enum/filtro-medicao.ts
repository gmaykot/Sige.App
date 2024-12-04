import { environment } from "../../../environments/environment";

export const FASES_MEDICAO = 
[
    { id: 0, desc: 'Medição' },
    { id: 1, desc: 'Relatório Medição' },
    { id: 2, desc: 'Envio E-Mail' },
    { id: 3, desc: 'Fatura Concessionária' },
    { id: 4, desc: 'Relatório Economia' },
];

export const STATUS_MEDICAO = 
[
    { id: 0, desc: 'Pendente Medição'}, 
    { id: 1, desc: 'Completa'}, 
    { id: 2, desc: 'Erro na Leitura'},
    { id: 3, desc: 'Validado'}, 
    { id: 4, desc: 'Concluído'}, 
    { id: 5, desc: 'Pendente PROINFA'}, 
    { id: 6, desc: 'Gerando PDF'}, 
    { id: 7, desc: 'Aguardando Validação'}, 
    { id: 8, desc: 'Contestado'},
    { id: 9, desc: 'Pendente do Relatório'}, 
    { id: 10, desc: 'Pronto para Envio'}, 
    { id: 11, desc: 'Enviado'}, 
    { id: 12, desc: 'Erro no envio'},
    { id: 13, desc: 'Pendente Fatura'}, 
    { id: 14, desc: 'Pendente Informações'}, 
    { id: 15, desc: 'Pendente Empresa'}, 
    { id: 16, desc: 'Pendente Fornecedor'}, 
    { id: 17, desc: 'Pendente ' + environment.gestor},
    { id: 18, desc: 'Incompleta'},
    { id: 19, desc: 'Valor Divergente'},
]

export const STATUS_FASE = 
[
    { id: 0, status: [ { id: 0, desc: 'Pendente Medição'}, { id: 1, desc: 'Completa'}, { id: 18, desc: 'Incompleta'}, { id: 19, desc: 'Valor Divergente'}, { id: 2, desc: 'Erro na Leitura'} ] },
    { id: 1, status: [ { id: 3, desc: 'Validado'}, { id: 4, desc: 'Concluído'}, { id: 0, desc: 'Pendente Medição'}, { id: 5, desc: 'Pendente PROINFA'}, { id: 6, desc: 'Gerando PFD'}, { id: 7, desc: 'Aguardando Validação'}, { id: 8, desc: 'Contestado'} ] },
    { id: 2, status: [ { id: 9, desc: 'Pendente do Relatório'}, { id: 10, desc: 'Pronto para Envio'}, { id: 11, desc: 'Enviado'}, { id: 12, desc: 'Erro no envio'} ] },
    { id: 3, status: [ { id: 13, desc: 'Pendente Fatura'}, { id: 4, desc: 'Concluído'} ] },
    { id: 4, status: [ { id: 14, desc: 'Pendente Informações'}, { id: 15, desc: 'Pendente Empresa'}, { id: 16, desc: 'Pendente Fornecedor'}, { id: 17, desc: 'Pendente ' + environment.gestor}, { id: 3, desc: 'Validado'}, { id: 4, desc: 'Concluído'} ] }
]
