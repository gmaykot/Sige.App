import { Component, Injector, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';
import { FornecedorEntity } from './fornecedor.interface';
import { FornecedorService } from './fornecedor.service';
import { IContato } from '../../../@core/data/contato';
import { ContatoComponent } from '../../../@shared/custom-component/contato.component';
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
  public sourceContato: LocalDataSource = new LocalDataSource();
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

  onContatoConfirm(){
    this.dialogService
    .open(ContatoComponent, { context: { contato: { fornecedorId: this.selectedObject.id, empresaId: null } as IContato }, })
    .onClose.subscribe(async (contato) => {
      if (contato) {   
        await this.contatoService.post(contato).then(async (res: IResponseInterface<IContato>) =>
        {
          contato.id = res.data.id;
          this.contatos = this.contatos.filter(a => a.id != contato.id);
          this.contatos.push(contato);
          this.sourceContato.load(this.contatos);   
          this.alertService.showSuccess("Contato cadastrado com sucesso.");
        });   
      }
    });
    this.contatosChecked = [];
  }

  onContatoEdit(){
    if (this.contatosChecked.length > 0){
      this.dialogService
      .open(ContatoComponent, { context: { contato: this.contatosChecked[0] }, })
      .onClose.subscribe(async (contato) => {
        if (contato) {   
          contato.fornecedorId = this.selectedObject.id;
          contato.empresaId = null;
          await this.contatoService.put(contato).then()
          {
            this.contatos = this.contatos.filter(a => a.id != contato.id);
            this.contatos.push(contato);
            this.sourceContato.load(this.contatos);   
            this.alertService.showSuccess("Contato alterado com sucesso.");
          }  
        }
      });
      this.contatosChecked = [];
    }
  }
  
  onContatoDelete(){
    if (this.contatosChecked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir os contatos selecionados?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir){                    
          this.contatosChecked.forEach(async contato => {
            await this.contatoService.delete(contato.id).then()
            {              
              this.contatos = this.contatos.filter(a => a.id != contato.id);
              this.sourceContato.load(this.contatos);         
              this.contatosChecked = [];    
            };            
          });
          this.alertService.showSuccess("Contato excluído com sucesso.");
        }
      });          
    }
  }
}