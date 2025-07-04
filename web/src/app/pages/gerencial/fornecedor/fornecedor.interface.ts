import { IContato } from "../../../@core/data/contato";
import { BaseEntity } from "../../../@core/entity/base-entity.interface";

export class FornecedorEntity implements BaseEntity{
    id?: string;
    nome?: string;
    cnpj?: string;
    telefoneContato?: string;
    telefoneAlternativo?: string;
    ativo?: boolean;
    contatos?: IContato[];

    static SourceInstance(): FornecedorEntity {
        return {
            id: "",
            nome: "",
            cnpj: "",
            telefoneContato: "",
            telefoneAlternativo: "",
        };
    }
}