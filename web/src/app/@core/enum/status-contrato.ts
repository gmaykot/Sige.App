export const STATUS_CONTRATO = 
[
    { id: 0, desc: 'ATIVO'}, 
    { id: 1, desc: 'INATIVO'}, 
    { id: 2, desc: 'PENDENTE'},
    { id: 3, desc: 'ENCERRADO'}, 
    { id: 4, desc: 'FINALIZADO'}, 
]

export const TIPO_ENERGIA = 
[
    { id: 0, desc: 'i0 - LP'}, 
    { id: 1, desc: 'i1 - LP'},
    { id: 2, desc: 'i5 - LP'}, 
    { id: 3, desc: 'CONVENCIONAL - LP'}, 
]

export const TIPO_LANCAMENTO = 
[
    { id: 0, desc: 'Débito'}, 
    { id: 1, desc: 'Crédito'},
]

export const SEGMENTO = 
[
    { id: 0, desc: 'VERDE'},
    { id: 1, desc: 'AZUL'}
]

export const NATUREZA_MERCADO = 
[
    { id: 0, desc: 'CATIVO'},
    { id: 1, desc: 'LIVRE'},
    { id: 2, desc: 'CATIVO/LIVRE'}
]

export const TIPO_CONEXAO = [
    { id: 0, desc: "A1 (≥ 230 kV)" },
    { id: 1, desc: "A2 (88 - 138 kV)" },
    { id: 2, desc: "A3 (69 kV)" },
    { id: 3, desc: "A3a (30 - 44 kV)" },
    { id: 4, desc: "A4 (2.3 - 25 kV)" },
    { id: 5, desc: "AS (Subterrâneo)" },
];