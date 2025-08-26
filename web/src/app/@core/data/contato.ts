import { BaseEntity } from "../entity/base-entity.interface";

export class IContato implements BaseEntity {
    id?: string;
    fornecedorId?: string;
    empresaId?: string;
    nome?: string;
    telefone?: string;
    email?: string;
    cargo?: string;
    recebeEmail?: boolean;
    ativo?: boolean;

    static SourceInstance(): IContato {
        return {
           nome: "",
           telefone: "",
           email: "",
           cargo: "",
           recebeEmail: true,
        };
    }
}