export class DefaultServiceUtil<T> {

    private datePatternMesANo = /^[0-9]{2}\/[0-9]{4}$/; // Validação do formato MM/yyyy
    private datePatternFullUs = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/; // Validação do formato dd/MM/yyyy
    private datePatternFullBr = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/; // Validação do formato yyyy-MM-ddTHH:mm:ss

    protected formatPrePost(item: T): T {
        this.transformPrePostField(item, 'mesReferencia', 'mesAno');
        this.transformPrePostField(item, 'vigenciaInicial', 'fullDate');
        this.transformPrePostField(item, 'vigenciaFinal', 'fullDate');
        this.transformPrePostField(item, 'dataUltimoReajuste', 'fullDate');
        this.transformPrePostField(item, 'dataEmissao', 'fullDate');
        return item;
    }

    protected formatPosGet(data: any): any {
        if (data) {
            if (Array.isArray(data)) {
                return data.map((item) => {
                    return this.transformItem(item);
                });
            } else {
                return this.transformItem(data);
            }    
        }
    }

    private transformItem(item: any): any {
        this.transformDateField(item, 'mesReferencia', 'mesAno');
        this.transformDateField(item, 'vigenciaInicial', 'fullDate');
        this.transformDateField(item, 'vigenciaFinal', 'fullDate');
        this.transformDateField(item, 'dataUltimoReajuste', 'fullDate');
        this.transformDateField(item, 'dataEmissao', 'fullDate');
        return item;
    }

    private transformDateToIso(value: string, formatType: 'mesAno' | 'fullDate'): string {
        if (this.datePatternFullBr.test(value)) {
            const [dia, mes, ano] = value.split("/");
            return `${ano}-${mes}-${dia}`;
        }

        if (formatType === 'mesAno' && this.datePatternMesANo.test(value)) {
            const [mes, ano] = value.split("/");
            return `${ano}-${mes}-01`;
        }
        return value;
    }

    private transformPrePostField(item: any, fieldName: string, formatType: 'mesAno' | 'fullDate'): void {
        if (item[fieldName] && typeof item[fieldName] === 'string') {
            item[fieldName] = this.transformDateToIso(item[fieldName], formatType);
        }
    }

    private transformDateField(item: any, fieldName: string, formatType: 'mesAno' | 'fullDate'): void {        
        if (item[fieldName] && typeof item[fieldName] === 'string') {
            const value = item[fieldName];
            if (this.datePatternFullUs.test(value)) {
                const datePart = value.split("T")[0];
                const [ano, mes, dia] = datePart.split("-");
                
                item[fieldName] = formatType === 'mesAno' 
                    ? `${mes}/${ano}`
                    : `${dia}/${mes}/${ano}`;
            }
        }
    }
}