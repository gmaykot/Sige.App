export interface ILancamentoAdicional {
    id: number;
    faturaEnergiaId: string;
    descricao: string;
    valor: number;
    tipo: string;
    naturezaMercado: string;
    contabilizaFatura: boolean;
    tipoCCEE: boolean;
}