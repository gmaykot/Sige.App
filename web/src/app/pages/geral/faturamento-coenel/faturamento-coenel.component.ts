import { Component, OnInit } from "@angular/core";
import { FaturamentoCoenelConfigSettings } from "./faturamento-coenel.config";
import { Classes } from "../../../@core/enum/classes.const";
import { NbLayoutScrollService, NbDialogService } from "@nebular/theme";
import { FaturamentoCoenelService } from "../../../@core/services/geral/faturamento-coenel.service";
import { AlertService } from "../../../@core/services/util/alert.service";
import { FormBuilderService } from "../../../@core/services/util/form-builder.service";
import { EmpresaService } from "../../../@core/services/gerencial/empresa.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { IDropDown } from "../../../@core/data/drop-down";
import { Observable } from "rxjs";
import { PontoMedicaoService } from "../../../@core/services/gerencial/ponto-medicao.service";
import { LocalDataSource } from "ng2-smart-table";
import { IFaturamentoCoenel } from "../../../@core/data/geral/faturamento-coenel";
import { CustomDeleteConfirmationComponent } from "../../../@shared/custom-component/custom-delete-confirmation.component";

@Component({
  selector: 'ngx-faturamento-coenel',
  templateUrl: './faturamento-coenel.component.html',
  styleUrls: ['./faturamento-coenel.component.scss']
})
export class FaturamentoCoenelComponent extends FaturamentoCoenelConfigSettings implements OnInit {
  public empresas: Array<IDropDown> = []
  public pontosMedicao: Array<IDropDown> = []
  public sourceHistoricos: LocalDataSource = new LocalDataSource();
  public editLabel: string = null;
  private tempLabel: string = null;
  private tempPontoLabel: string = null;

  constructor(
    protected service: FaturamentoCoenelService,
    protected formBuilderService: FormBuilderService,
    protected alertService: AlertService,
    protected scroolService: NbLayoutScrollService,
    protected dialogService: NbDialogService,
    private empresaService: EmpresaService,
    private pontoMedicaoService: PontoMedicaoService
  ) 
  {
    super(Classes.FATURAMENTO_COENEL, formBuilderService, service, alertService, scroolService, dialogService);
  }

  async onSubmitCustom() {
    if (!this.selected)
      this.control.patchValue({ pontoMedicaoId: this.control.get('pontoMedicaoId').value.id }, { emitEvent: false });

    super.onSubmit();
    this.editLabel = this.tempLabel;
    this.control.patchValue({ descPontoMedicao: this.tempPontoLabel }, { emitEvent: false });
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
        this.sourceHistoricos.load(response.data);
      }
    });    
  }

  async onEdit() {
    this.editLabel = null;
    super.onEdit();
  }

  onHelp() {
    
  }

  onItemSelected(selectedItem: IDropDown) {
    this.control.get('pontoMedicaoId').setValue(null);
    if (selectedItem) {
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
          var erroExcluir = false;
          this.historicosChecked.forEach(historico => {
            this.service.delete(historico.id).then(async (res: IResponseInterface<any>) => {
              if (res.success){
                this.loadSourceHistorico(this.control.get('pontoMedicaoId').value);
                this.historicosChecked = [];      
                this.alertService.showSuccess("Histórico excluído com sucesso.");
              } else 
              {
                erroExcluir = true;
                res.errors.map((x) => this.alertService.showError(`Histórico ${historico.id} - ${x.value}`));
              }
            });            
          });
        }
      });          
    }
  }
}
