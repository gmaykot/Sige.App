import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { FaturamentoCoenelConfigSettings } from "./faturamento-coenel.config";
import { Classes } from "../../../@core/enum/classes.const";
import { NbTabsetComponent } from "@nebular/theme";
import { FaturamentoCoenelService } from "../../../@core/services/geral/faturamento-coenel.service";
import { EmpresaService } from "../../../@core/services/gerencial/empresa.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { IDropDown } from "../../../@core/data/drop-down";
import { PontoMedicaoService } from "../../../@core/services/gerencial/ponto-medicao.service";
import { LocalDataSource } from "ng2-smart-table";
import { IFaturamentoCoenel } from "../../../@core/data/geral/faturamento-coenel";
import { CustomDeleteConfirmationComponent } from "../../../@shared/custom-component/custom-delete-confirmation.component";
import { AjudaOperacaoComponent } from "../../../@shared/custom-component/ajuda-operacao/ajuda-operacao.component";

@Component({
  selector: 'ngx-faturamento-coenel',
  templateUrl: './faturamento-coenel.component.html',
  styleUrls: ['./faturamento-coenel.component.scss']
})
export class FaturamentoCoenelComponent extends FaturamentoCoenelConfigSettings implements OnInit {
  @ViewChild(NbTabsetComponent) tabset!: NbTabsetComponent;

  public empresas: Array<IDropDown> = []
  public pontosMedicao: Array<IDropDown> = []
  public sourceHistoricos: LocalDataSource = new LocalDataSource();
  public editLabel: string = null;
  private tempLabel: string = null;
  private tempPontoLabel: string = null;

  constructor(
    protected service: FaturamentoCoenelService,
    private empresaService: EmpresaService,
    private pontoMedicaoService: PontoMedicaoService,
    protected injector: Injector
  ) 
  {
    super(injector, service, Classes.FATURAMENTO_COENEL, true);
  }

  async onSubmitCustom() {
    if (!this.selected)
      this.control.patchValue({ pontoMedicaoId: this.control.get('pontoMedicaoId').value.id }, { emitEvent: false });
    await super.onSubmit();    
    this.editLabel = this.tempLabel;
    this.control.patchValue({ descPontoMedicao: this.tempPontoLabel }, { emitEvent: false });
    await this.loadSourceHistorico(this.control.get('pontoMedicaoId').value);
  }

  onSearch(event: IDropDown) {
    this.tempPontoLabel = event.descricao;    
  }

  async onSelectCustom(event: any) {
    super.onSelect(event);
    this.editLabel = event.data.descEmpresa;
    this.tempLabel = event.data.descEmpresa;
    this.tempPontoLabel = event.data.descPontoMedicao;
    await this.getPontosMedicao(event.data.empresaId);
    await this.loadSourceHistorico(event.data.pontoMedicaoId);
  }

  async ngOnInit() {
    if (this.isSuperUsuario){
      this.settingsHistoricos.columns.id.hide = false;
    }
    await super.ngOnInit();
    await this.getEmpresas();
  }

  private async getEmpresas() {
    await this.empresaService
    .getDropDown()
    .then((response: IResponseInterface<IDropDown[]>) => {
      if (response.success) {
        this.empresas = response.data;
      }
    });
  }

  async loadSourceHistorico(pontoMedicaoId: string) {
    this.sourceHistoricos.load([]);
    await this.service
    .getByPontoMedicao(pontoMedicaoId)
    .then((response: IResponseInterface<IFaturamentoCoenel[]>) => {
      if (response.success) {
        console.log(response.data);
        this.sourceHistoricos.load(response.data);
      }
    });    
  }

  async onDeleteCustom() {
    await super.onDelete();
    await super.loadSource()
  }

  async onEdit() {
    this.editLabel = null;
    super.onEdit();    
    await super.loadSource();
  }

  onHelp() {
    this.dialogService.open(AjudaOperacaoComponent, { context: { tipoAjuda: 'faturamento-coenel' } });
  }

  onItemSelected(selectedItem: IDropDown) {
    this.control.get('pontoMedicaoId').setValue(null);
    if (selectedItem) {
      this.selected = false;
      this.tempLabel = selectedItem.descricao;
      this.getPontosMedicao(selectedItem.id);    
    }
  }

  async getPontosMedicao(empresaId: string) {
    await this.pontoMedicaoService
      .getDropDownPorEmpresa(empresaId)
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.pontosMedicao = response.data;
        }
      });
  }

  async onHistoricoDelete() {
    if (this.historicosChecked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir os históricos selecionados?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir){
          this.historicosChecked.forEach(historico => {
            this.service.delete(historico.id).then(async (res: IResponseInterface<any>) => {
              if (res.success){
                this.loadSourceHistorico(this.control.get('pontoMedicaoId').value);
                this.historicosChecked = [];      
                this.alertService.showSuccess("Histórico excluído com sucesso.");
              } else 
              {
                res.errors.map((x) => this.alertService.showError(`Histórico ${historico.id} - ${x.value}`));
              }
            });            
          });
        }
      });          
    }
  }

  async onHistoricoConfirm() {
    this.control.patchValue({
      id: null,
      pontoMedicaoId: this.control.get('pontoMedicaoId').value,
      descPontoMedicao: this.tempPontoLabel,
      vigenciaInicial: null,
      vigenciaFinal: null,
      valorFixo: null,
      qtdeSalarios: null,
      porcentagem: null      
    });
    this.scrollService.scrollTo(0,0);  
    this.tabset?.selectTab(this.tabset.tabs.toArray()[0]);
  }
}
