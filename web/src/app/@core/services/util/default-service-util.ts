import { DateService } from "./date.service";

export class DefaultServiceUtil<T> {

    protected formatMesReferencia(item: T): T {
        const datePattern = /^[0-9]{2}\/[0-9]{4}$/; // Validação do formato M0/0000
        // Verificar e formatar a propriedade "mesReferencia" se existir
        if ((item as any).mesReferencia && typeof (item as any).mesReferencia === 'string') {
            const value = (item as any).mesReferencia;
            if (datePattern.test(value)) {
                const ptBrString = `01/${value}`;
                const [dia, mes, ano] = ptBrString.split("/");
                (item as any).mesReferencia = `${ano}-${mes}-${dia}`;                
            }
        }
        return item;
    }

    protected transformMesReferencia(data: any): any {
        if (data) {
            if (Array.isArray(data)) {
                // Se o dado for uma lista
                return data.map((item) => {
                    return this.transformItem(item);
                });
            } else {
                // Se for um único objeto
                return this.transformItem(data);
            }    
        }
    }

    protected transformItem(item: any): any {
        const datePattern = /^(\d{4})-(\d{2})-(\d{2})(T\d{2}:\d{2}:\d{2})?$/;

        // Verificar e formatar a propriedade "mesReferencia" se existir
        if ((item as any).mesReferencia && typeof (item as any).mesReferencia === 'string') {
            const value = (item as any).mesReferencia;
            if (datePattern.test(value)) {
                const [ano, mes, dia] = value.split("-");
                (item as any).mesReferencia = `${mes}/${ano}`;
            }
        }
        return item;
    }
}