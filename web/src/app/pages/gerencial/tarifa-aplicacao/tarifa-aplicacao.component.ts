import { Component, Injector, OnInit } from '@angular/core';
import { IDropDown } from '../../../@core/data/drop-down';
import { ConcessionariaService } from '../../../@core/services/gerencial/concessionaria.service';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { TarifaAplicacaoService } from './tarifa-aplicacao.service';
import { DefaultComponent } from '../../../@shared/custom-component/default/default-component';
import { Classes } from '../../../@core/enum/classes.const';
import { SEGMENTO, TIPO_CONEXAO } from '../../../@core/enum/status-contrato';
import { TarifaAplicacaoEntity } from './tarifa-aplicacao.interface';
import { SmartTableConfigService } from '../../../@core/services/util/smart-table-config.service';

@Component({
  selector: 'ngx-tarifa-aplicacao',
  templateUrl: './tarifa-aplicacao.component.html',
  styleUrls: ['./tarifa-aplicacao.component.scss']
})
export default class TarifaAplicacaoComponent extends DefaultComponent<TarifaAplicacaoEntity> implements OnInit {
  public concessionarias?: IDropDown[];
  public conexoes = TIPO_CONEXAO;
  public segmentos = SEGMENTO;
  
  constructor(
    private concessionariaService: ConcessionariaService,
    protected service: TarifaAplicacaoService,
    protected injector: Injector,
    private smartService: SmartTableConfigService
  ) {
    super(injector, service, Classes.TARIFA_APLICACAO, true);
  }
  
  async ngOnInit() {
    this.settings = this.smartService.generateTableSettingsFromObject(TarifaAplicacaoEntity.SourceInstance(), {
      exibirStatus: true,
      permitirDelete: true,
    });    
    await super.ngOnInit();
    await this.getConcessionarias();
  }
  
  async getConcessionarias() {
    this.loading = true;
    await this.concessionariaService
      .getDropDown()
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.concessionarias = response.data;
        }
      });
    this.loading = false;
  }
}
