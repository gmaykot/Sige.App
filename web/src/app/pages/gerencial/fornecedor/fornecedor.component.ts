import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';
import { IFornecedor } from '../../../@core/data/fornecedor';
import { FornecedorService } from '../../../@core/services/gerencial/fornecedor.service';
import { settingsFornecedor } from '../../../@shared/table-config/fornecedor.config';
import { IContato } from '../../../@core/data/contato';
import { ContatoComponent } from '../../../@shared/custom-component/contato.component';
import { FornecedorConfigSettings } from './fornecedor.config.settings';
import { ContatoService } from '../../../@core/services/gerencial/contato.service';
import { AlertService } from '../../../@core/services/util/alert.service';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';

@Component({
  selector: 'ngx-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent extends FornecedorConfigSettings implements OnInit {
  settingsFornecedor = settingsFornecedor; 
  contatos = [];
  public edit = false;
  public selected = false;
  source: LocalDataSource = new LocalDataSource();
  sourceContato: LocalDataSource = new LocalDataSource();
  public control = this.formBuilder.group({
    id: '',
    gestorId: '',
    nome: ["", Validators.required],
    cnpj: ["", Validators.required],
    telefoneContato: ["", Validators.required],
    telefoneAlternativo: '',
    ativo: true
  });
  public loading = true;
  telefoneMask: string;
  public habilitaOperacoes: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private contatoService: ContatoService,
    private dialogService: NbDialogService,
    private alertService: AlertService,
    private scroolService: NbLayoutScrollService
  ) { super(); }

  async ngOnInit() {
    await this.getFornecedores();
    this.limparFormulario();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
  }

  async getFornecedores() {
    this.loading = true;
    await this.fornecedorService
      .get()
      .then((response: IResponseInterface<IFornecedor[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }      
        this.loading = false;
      });
  }

  private getFornecedor(): IFornecedor {
    return this.control.value as IFornecedor;
  }

  onSelect(event): void {
    this.limparFormulario();
    const forn = event.data as IFornecedor;
    this.control = this.formBuilder.group({
      id: forn.id,
      gestorId: forn.gestorId,
      nome: forn.nome,
      cnpj: forn.cnpj,
      telefoneContato: forn.telefoneContato,
      telefoneAlternativo: forn.telefoneAlternativo,
      ativo: forn.ativo
    });
    this.contatos = forn.contatos ? forn.contatos : [];
    this.sourceContato.load(this.contatos);
    this.edit = true;
    this.selected = true;
    this.scroolService.scrollTo(0,0);
  }

  async onDeleteConfirm() {
    this.dialogService
      .open(CustomDeleteConfirmationComponent)
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          await this.fornecedorService
          .delete(this.getFornecedor().id)
          .then();
        {
          this.limparFormulario();
          this.alertService.showSuccess("Fornecedor excluído com sucesso.");
          await this.getFornecedores();
        }
        }
      });
  }

  onSubmit(): void {
    this.changeFornecedor();
  }

  onClose(): void {
  }

    onEdit() {
    this.edit = !this.edit;
  }

  private async changeFornecedor() {
    const fornecedor = this.getFornecedor();
    fornecedor.contatos = this.contatos;
    if (fornecedor.id == null || fornecedor.id == "") {
      await this.post(fornecedor);
    } else {
      await this.put(fornecedor);
    }
    this.edit = true;
    this.selected = true;
  }

  private async post(req: IFornecedor) {
    await this.fornecedorService.post(req).then(async (res: IResponseInterface<IFornecedor>) =>
    {
      this.onSelect(res);
      await this.getFornecedores();
      this.alertService.showSuccess("Fornecedor cadastrado com sucesso.");
    });
  }

  private async put(req: IFornecedor) {
    await this.fornecedorService.put(req).then();
    {
      await this.getFornecedores();
      this.alertService.showSuccess("Fornecedor alterado com sucesso.");
    }
  }

  limparFormulario(): void {
    this.control.reset();
    this.edit = false;
    this.selected = false;
    this.contatos = [];
    this.contatosChecked = [];
    this.sourceContato.load(this.contatos);
  }

  onContatoConfirm(){
    const fornecedor = this.getFornecedor();
    this.dialogService
    .open(ContatoComponent, { context: { contato: { fornecedorId: fornecedor.id, empresaId: null } as IContato }, })
    .onClose.subscribe(async (contato) => {
      if (contato) {   
        await this.contatoService.post(contato).then(async (res: IResponseInterface<IContato>) =>
        {
          contato.id = res.data.id;
          this.contatos = this.contatos.filter(a => a.id != contato.id);
          this.contatos.push(contato);
          this.sourceContato.load(this.contatos);   
          this.alertService.showSuccess("Contato cadastrado com sucesso.");
          this.getFornecedores();
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
          contato.fornecedorId = this.getFornecedor().id;
          contato.empresaId = null;
          await this.contatoService.put(contato).then()
          {
            this.contatos = this.contatos.filter(a => a.id != contato.id);
            this.contatos.push(contato);
            this.sourceContato.load(this.contatos);   
            this.alertService.showSuccess("Contato alterado com sucesso.");
            this.getFornecedores();
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
              this.getFornecedores(); 
            };            
          });
          this.alertService.showSuccess("Contato excluído com sucesso.");
        }
      });          
    }
  }
}