import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbLayoutScrollService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { IResponseIntercace } from '../../../@core/data/response.interface';
import { CustomDeleteConfirmationComponent } from '../../../@shared/custom-component/custom-delete-confirmation.component';
import { ContratoService } from '../../../@core/services/gerencial/contrato.service';
import { IContrato } from '../../../@core/data/contrato';
import { EmpresaService } from '../../../@core/services/gerencial/empresa.service';
import { FornecedorService } from '../../../@core/services/gerencial/fornecedor.service';
import { ConcessionariaService } from '../../../@core/services/gerencial/concessionaria.service';
import { ValorAnualContratoService } from '../../../@core/services/gerencial/valor-anual-contrato';
import { ValorMensalContratoService } from '../../../@core/services/gerencial/valor-mensal-contrato';
import { SEGMENTO, STATUS_CONTRATO, TIPO_ENERGIA } from '../../../@core/enum/status-contrato';
import { IDropDown } from '../../../@core/data/drop-down';
import { DatePipe } from '@angular/common';
import { ContratoConfigSettings } from './contrato.config.settings';
import { IValorAnual } from '../../../@core/data/valor-anual';
import { IValorMensal } from '../../../@core/data/valor-mensal';
import { IEmpresa } from '../../../@core/data/empresa';
import { IContratoEmpresas } from '../../../@core/data/contrato-empresas';
import { ValorAnualComponent } from '../../../@shared/custom-component/valor-anual.component';
import { ValorMensalComponent } from '../../../@shared/custom-component/valor-mensal.component';
import { GrupoEmpresaComponent } from '../../../@shared/custom-component/grupo-empresa.component';
import { DateService } from '../../../@core/services/util/date.service';
import { AlertService } from '../../../@core/services/util/alert.service';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';

@Component({
  selector: 'ngx-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss']
})
export class ContratoComponent extends ContratoConfigSettings implements OnInit {
  valoresAnuais = [];
  valoresMensais = [];
  concessionarias = [];
  fornecedores = [];
  empresas = [];
  grupoEmpresas = [];
  empresaDropdown = [];
  public edit = false;
  public selected = false;
  status = STATUS_CONTRATO;
  tipoEnergia = TIPO_ENERGIA;
  segmento = SEGMENTO
  source: LocalDataSource = new LocalDataSource();
  sourceValoresAnuais: LocalDataSource = new LocalDataSource();
  sourceValoresMensais: LocalDataSource = new LocalDataSource();
  sourceEmpresas : LocalDataSource = new LocalDataSource();
  public control = this.formBuilder.group({
    id: '', 
    numero: ["", Validators.required], 
    tipoEnergia: ["", Validators.required],
    dscGrupo: ["", Validators.required],
    dataBase: ["", Validators.required],
    dataVigenciaInicial: ["", Validators.required],
    dataVigenciaFinal: ["", Validators.required],
    takeMinimo: [0, Validators.required],
    takeMaximo: [0, Validators.required],
    status: ["", Validators.required],
    concessionariaId: ["", Validators.required],
    fornecedorId: ["", Validators.required],
    ativo: true
  });
  public loading = true;
  public habilitaOperacoes: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private contratoService: ContratoService,
    private empresaService: EmpresaService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private fornecedorService: FornecedorService,
    private concessionariaService: ConcessionariaService,
    private valorAnualContratoService: ValorAnualContratoService,
    private valorMensalContratoService: ValorMensalContratoService,
    private dialogService: NbDialogService,
    private alertService: AlertService,
    private scroolService: NbLayoutScrollService
  ) { super();}

  async ngOnInit() {
    await this.getContratos();
    await this.getConcessionarias();
    await this.getFornecedores();
    await this.getEmpresaDropdown();
    await this.getEmpresas();
    this.limparFormulario();
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
  }
  
  async getFornecedores() {
    this.loading = true;
    await this.fornecedorService
      .getDropDown()
      .then((response: IResponseIntercace<IDropDown[]>) => {
        if (response.success) {
          this.fornecedores = response.data;
        }
        this.loading = false;
      });
  }

  async getConcessionarias() {
    this.loading = true;
    await this.concessionariaService
      .getDropDown()
      .then((response: IResponseIntercace<IDropDown[]>) => {
        if (response.success) {
          this.concessionarias = response.data;
        }                
        this.loading = false;
      });
  }

  async getEmpresaDropdown() {
    this.loading = true;
    await this.empresaService
      .getDropDown()
      .then((response: IResponseIntercace<IDropDown[]>) => {
        if (response.success) {
          this.empresaDropdown = response.data; 
        }                        
        this.loading = false;
      });
  }

  async getEmpresas()
  {
    await this.empresaService.get()
    .then( (response: IResponseIntercace<IEmpresa[]>) =>
    {
      if (response.success) {
        this.grupoEmpresas = response.data;
      }        
    });   
  }

  async getContratos() {
    this.loading = true;
    await this.contratoService
      .get()
      .then((response: IResponseIntercace<IContrato[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }      
        this.loading = false;
      }).catch((e) => {
        this.loading = false;
        this.alertService.showError(e);
      });    
  }
  
  onEdit() {
    this.edit = !this.edit;
  }

  private getContrato(): IContrato {
    var contrato = this.control.value as IContrato;
    contrato.dataBase = this.dateService.ptBrStringToUsString(contrato.dataBase);
    contrato.dataVigenciaInicial = this.dateService.ptBrStringToUsString(contrato.dataVigenciaInicial);
    contrato.dataVigenciaFinal = this.dateService.ptBrStringToUsString(contrato.dataVigenciaFinal);
    return contrato
  }

  onSelect(event): void {
    this.limparFormulario();
    const cont = event.data as IContrato;
    this.control = this.formBuilder.group({
      id: cont.id, 
      numero: cont.numero, 
      tipoEnergia: cont.tipoEnergia.toString(), 
      dscGrupo: cont.dscGrupo,
      dataBase: [this.datePipe.transform(cont.dataBase, 'dd/MM/yyyy')],
      dataVigenciaInicial: [this.datePipe.transform(cont.dataVigenciaInicial, 'dd/MM/yyyy')],
      dataVigenciaFinal: [this.datePipe.transform(cont.dataVigenciaFinal, 'dd/MM/yyyy')],
      takeMinimo: cont.takeMinimo,
      takeMaximo: cont.takeMaximo,
      status: cont.status.toString(),
      fornecedorId: cont.fornecedorId,
      concessionariaId: cont.concessionariaId,
      ativo: cont.ativo
    });
    this.edit = true;
    this.selected = true;
    this.valoresAnuais = [];
    this.valoresMensais = [];
    this.empresas = [];
    this.empresas = cont.contratoEmpresas;
    this.valoresAnuais = cont.valoresAnuaisContrato;
    this.sourceValoresAnuais.load(this.valoresAnuais);  
    cont.valoresAnuaisContrato.map(valor => valor.valoresMensaisContrato.map(mensal => { mensal.vigencia = `${this.datePipe.transform(valor.dataVigenciaInicial, 'dd/MM/yyyy')} - ${this.datePipe.transform(valor.dataVigenciaFinal, 'dd/MM/yyyy')}`; this.valoresMensais.push(mensal)}));
    this.sourceValoresMensais.load(this.valoresMensais);
    this.sourceEmpresas.load(this.empresas);
    this.scroolService.scrollTo(0,0);  
  }

  async onDeleteConfirm() {
    this.dialogService
      .open(CustomDeleteConfirmationComponent)
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          await this.contratoService
          .delete(this.getContrato().id)
          .then(async () => {
            this.limparFormulario();
            this.alertService.showSuccess("Contrato excluído com sucesso.");
            await this.getContratos();
          }).catch(() => {
            this.alertService.showError("Não foi possível excluir o contrato neste momento.");
          });
        }
      });
  }

  onSubmit(): void {
    this.changeContrato();
  }

  onClose(): void {
  }

  private async changeContrato() {
    const contrato = this.getContrato();
    if (contrato.id == null || contrato.id == "") {
      await this.post(contrato);
    } else {
      await this.put(contrato);
    }
  }

  private async post(contrato: IContrato) {
    await this.contratoService.post(contrato).then(async (res: IResponseIntercace<IContrato>) =>
    {
      this.onSelect(res);
      await this.getContratos();
      this.alertService.showSuccess("Contrato cadastrado com sucesso.");
    }).catch(() => {
      this.alertService.showError("Não foi possível cadastrar o contrato neste momento.");
    });
  }

  private async put(contrato: IContrato) {
    await this.contratoService.put(contrato).then(async () => {
      await this.getContratos();
      this.alertService.showSuccess("Contrato alterado com sucesso.");
    }).catch(() => {
      this.alertService.showError("Não foi possível alterar o contrato neste momento.");
    });
  }

  limparFormulario(): void {
    this.control.reset();
    this.edit = false;
    this.selected = false;
  }

  async onGrupoEmpresaConfirm() {
    this.dialogService
      .open(GrupoEmpresaComponent, { context: { contratoId: this.getContrato()?.id, valor: {} as IContratoEmpresas, grupoEmpresas: this.grupoEmpresas, empresaDropdown: this.empresaDropdown } })
      .onClose.subscribe(async (valor) => {
        if(valor) {
          this.contratoService.vinculaEmpresa(valor).then(async (response: IResponseIntercace<IContratoEmpresas>) => 
            {
              if (response.success){
                valor.id = response.data.id;
                this.empresas.push(valor);
                this.sourceEmpresas.load(this.empresas);
                this.alertService.showSuccess("Empresa cadastrada com sucesso.");
              } else {
                response.errors.map((x) => this.alertService.showError(x.value));
              }
            }).catch((e) => {
              this.alertService.showError("Não foi possível cadastrar a empresa neste momento.");
            });
        }
      });
  }

  async onGrupoEmpresaDelete() {
    if (this.empresasChecked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente desvincular as empresas selecionadas?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          this.empresasChecked.forEach(emp => {
            this.contratoService.removeEmpresa(emp.id).then(() => {
              this.sourceEmpresas.load(this.empresas.sort((a, b) => a.nome - b.nome));            
              this.empresas = this.empresas.filter(a => a.id != emp.id);
              this.alertService.showSuccess("Empresas desvinculadas com sucesso.");
            }).catch(() => {
              this.alertService.showError("Não foi possível desvincular as empresas neste momento.");
            });
          });
          this.empresasChecked = [];
        }
      });
    }
  }

  async onValorAnualConfirm() {
    this.dialogService
    .open(ValorAnualComponent, { context: { contratoId: this.getContrato()?.id, valor: {} as IValorAnual, dateService: this.dateService} })
      .onClose.subscribe(async (valor) => {
        if (valor) {
        this.valorAnualContratoService.post(valor).then(async (response: IResponseIntercace<IValorAnual>) =>
        {
          if (response.success){
            valor.id = response.data.id;
            this.valoresAnuais.push(valor);
            this.sourceValoresAnuais.load(this.valoresAnuais.sort((a, b) => new Date(a.dataVigenciaInicial).getTime() - new Date(b.dataVigenciaInicial).getTime()));            
            this.alertService.showSuccess("Valores Anuais cadastrados com sucesso.");  
          } else {
            response.errors.map((x) => this.alertService.showError(x.value));
          }
        }).catch((e) => {
          this.alertService.showError("Não foi possível cadastrar Valores Anuais neste momento.");
        });
      }
      });
      this.valoresAnuaisChecked =  [];
  }

  async onValorAnualEdit() {
    if(this.valoresAnuaisChecked.length > 0) {
      this.dialogService
      .open(ValorAnualComponent, { context: { valor: this.valoresAnuaisChecked[0], contratoId: this.getContrato()?.id, dateService: this.dateService } })
      .onClose.subscribe(async (valor) => {
        if (valor) {
          this.valorAnualContratoService.put(valor).then(() => {
          this.valoresAnuaisChecked = this.valoresAnuais.filter(a => a.id != valor.id);
          this.valoresAnuaisChecked.push(valor);
          this.sourceValoresAnuais.load(this.valoresAnuaisChecked.sort((a, b) => new Date(a.dataVigenciaInicial).getTime() - new Date(b.dataVigenciaInicial).getTime()));            
          this.alertService.showSuccess("Valores Anuais editados com sucesso.");

          }).catch(() => {
            this.alertService.showError("Não foi possível editar Valores Anuais neste momento.");

          });
        }
      });
      this.valoresAnuaisChecked =  [];
    }    
  }

  async onValorAnualDelete() {
    if (this.valoresAnuaisChecked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir os valores anuais selecionados?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          this.valoresAnuaisChecked.forEach(valor => {
            this.valoresAnuais = this.valoresAnuais.filter(a => a.id != valor.id);
            this.valorAnualContratoService.delete(valor.id).then(() => {
              this.sourceValoresAnuais.load(this.valoresAnuais.sort((a, b) => new Date(a.dataVigenciaInicial).getTime() - new Date(b.dataVigenciaInicial).getTime()));                          
              this.alertService.showSuccess("Valores Anuais excluídos com sucesso.");
            }).catch(() => {
              this.alertService.showError("Não foi possível excluir Valores Anuais neste momento.");
            });
          });
          this.valoresAnuaisChecked = [];
        }
      });
    }
  }

  async onValorMensalConfirm() {
    this.dialogService
    .open(ValorMensalComponent, { context: { valor: { } as IValorMensal, valoresAnuais: this.valoresAnuais, datePipe: this.datePipe, dateService: this.dateService } })
      .onClose.subscribe(async (valor) => {
        if (valor) {
        this.valorMensalContratoService.post(valor).then(async (res: IResponseIntercace<IValorMensal>) =>
        {
          valor.id = res.data.id;
          this.valoresMensais.push(valor);
          this.sourceValoresMensais.load(this.valoresMensais.sort((a, b) => new Date(a.competencia).getTime() - new Date(b.competencia).getTime()));
          this.alertService.showSuccess("Valores Mensais cadastrados com sucesso.");
        }).catch(() => {
          this.alertService.showError("Não foi possível cadastrar Valores Mensais neste momento.");
        });
      }
      });
      this.valoresMensaisChecked =  [];
  }

  async onValorMensalEdit() {
    if(this.valoresMensaisChecked.length > 0) {
      this.dialogService
      .open(ValorMensalComponent, { context: { valor: this.valoresMensaisChecked[0], valoresAnuais: this.valoresAnuais, datePipe: this.datePipe, dateService: this.dateService} })
      .onClose.subscribe(async (valor) => {
        if (valor) {
          this.valorMensalContratoService.put(valor).then(() => {
          this.valoresMensaisChecked = this.valoresMensais.filter(a => a.id != valor.id);
          this.valoresMensaisChecked.push(valor);
          this.sourceValoresMensais.load(this.valoresMensaisChecked.sort((a, b) => new Date(a.competencia).getTime() - new Date(b.competencia).getTime()));        
          this.alertService.showSuccess("Valores mensais editados com sucesso.");
          }).catch(() => {
            this.alertService.showError("Não foi possível editar Valores Mensais neste momento.");
          });
        }
      });
      this.valoresMensaisChecked =  [];
    }    
  }

  async onValorMensalDelete() {
    if (this.valoresMensaisChecked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir os valores mensais selecionados?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          this.valoresMensaisChecked.forEach(valor => {
            this.valoresMensais = this.valoresMensais.filter(a => a.id != valor.id);
            this.valorMensalContratoService.delete(valor.id).then(() => {
              this.sourceValoresMensais.load(this.valoresMensais.sort((a, b) => new Date(a.competencia).getTime() - new Date(b.competencia).getTime()));                          
              this.alertService.showSuccess("Valores Mensais excluídos com sucesso.");
            }).catch(() => {
              this.alertService.showError("Não foi possível excluir Valores Mensais neste momento.");
            });
          });
          this.valoresMensaisChecked = [];
        }
      });
    }
  }
}
