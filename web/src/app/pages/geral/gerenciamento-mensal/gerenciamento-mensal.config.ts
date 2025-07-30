import { descontoTusd, encargosCcee, impostosSettings } from "../../../@shared/table-config/geral/lancamentos-mensais.config";
import { proinfaSettings } from "../../../@shared/table-config/geral/lancamentos-mensais.config";

export class GerenciamentoMensalConfigSettings {
    public impostosSettings = impostosSettings;
    public proinfaSettings = proinfaSettings;
    public descontoTusdSettings = descontoTusd;
    public encargosCceeSettings = encargosCcee;
}