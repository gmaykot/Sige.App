import { IFaturamentoCoenel } from "../../../@core/data/geral/faturamento-coenel";
import { DefaultComponent } from "../../../@shared/custom-component/default/default-component";
import { faturamentoSettings } from "../../../@shared/table-config/geral/faturamento-concessionaria.config";

export class FaturamentoCoenelConfigSettings extends DefaultComponent<IFaturamentoCoenel> {
    public settings = faturamentoSettings;
}