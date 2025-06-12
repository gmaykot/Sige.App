export interface IGraficoRelatorioFinal {
    titulo?: string;
    linhas?: LinhaGraficoFinal[]; 
}

export interface LinhaGraficoFinal {
    label?: string;
    valor?: number;
}