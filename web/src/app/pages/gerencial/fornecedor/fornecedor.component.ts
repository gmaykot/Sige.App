import { Component, Injector, OnInit } from '@angular/core';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { FornecedorEntity } from './fornecedor.interface';
import { FornecedorService } from './fornecedor.service';
import { IContato } from '../../../@core/data/contato';
import { ContatoService } from '../../../@core/services/gerencial/contato.service';
import { DefaultComponent } from '../../../@shared/custom-component/default/default-component';
import { Classes } from '../../../@core/enum/classes.const';
import { SmartTableConfigService } from '../../../@core/services/util/smart-table-config.service';

@Component({
  selector: 'ngx-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent extends DefaultComponent<FornecedorEntity> implements OnInit {
  public contatos = [];
  public settingsContato: any;
  contatosChecked: IContato[] = [];

  constructor(
    protected service: FornecedorService,
    private contatoService: ContatoService,
    protected injector: Injector,
    private smartService: SmartTableConfigService
  ) { super(injector, service, Classes.FORNECEDOR, true); }

  async ngOnInit() {
    this.settings = this.smartService.generateTableSettingsFromObject(FornecedorEntity.SourceInstance(), {
      exibirStatus: true,
      permitirDelete: true,
    }, this.service);
    this.settingsContato = this.smartService.generateTableSettingsFromObject(IContato.SourceInstance(), {
      exibirStatus: true,
      permitirDelete: true,
    }, this.contatoService);
    
    await super.ngOnInit();
  }

  async onLoad(event: any): Promise<void> {
    await super.onLoad(event);
    await this.loadContatos(event.data.id);
  }

  async loadContatos(id: any){
    this.loading = true;
    await this.contatoService.getPorFornecedor(id).then((res: IResponseInterface<IContato[]>) => {
      if (res.success) {
        this.contatos = res.data;
      } else {
        this.contatos = [];
      }
    });
    this.loading = false;
  }

  async onRefresh(event: any) {
    if (event && event === true){
      await this.loadContatos(this.selectedObject.id);
    }
  }
}