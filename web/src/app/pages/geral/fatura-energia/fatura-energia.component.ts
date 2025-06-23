import { Component, OnInit, ViewChild } from "@angular/core";
import { IDropDown } from "../../../@core/data/drop-down";
import { LocalDataSource } from "ng2-smart-table";
import { FormBuilder, Validators } from "@angular/forms";
import {
  settingsFatura,
  settingsLancamentos,
  settingsLancamentosSemDelete,
} from "../../../@shared/table-config/fatura-energia.config";
import { PontoMedicaoService } from "../../../@core/services/gerencial/ponto-medicao.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { ConcessionariaService } from "../../../@core/services/gerencial/concessionaria.service";
import { DateService } from "../../../@core/services/util/date.service";
import { FaturaEnergiaService } from "../../../@core/services/geral/fatura-energia.service";
import { IFaturaEnergia } from "../../../@core/data/fatura.energia";
import { DatePipe } from "@angular/common";
import { AlertService } from "../../../@core/services/util/alert.service";
import * as uuid from 'uuid';


@Component({
  selector: "ngx-fatura-energia",
  templateUrl: "./fatura-energia.component.html",
  styleUrls: ["./fatura-energia.component.scss"],
})
export class FaturaEnergiaComponent implements OnInit {
  public stepperIndex: number = 0;
  public settings = settingsFatura;
  public settingsLancamentos = settingsLancamentos;
  public settingsLancamentosSemDelete = settingsLancamentosSemDelete;
  public source: LocalDataSource = new LocalDataSource();
  
  public faturas: Array<IFaturaEnergia> = [];
  public pontosMedicao: Array<IDropDown> = [];
  public concessionarias: Array<IDropDown> = [];
  public pontoMedicao: IDropDown = null;
  public editLabel: string = null;
  public lancamentos: any[] = [];
  public selected: boolean = false;
  public loading: boolean = false;
  public mesReferencia: any;
  public lancamento: any = null;

  public control = this.novoFormControl(); 

  public lancamentoControl = this.formBuilder.group({
    id: [null],
    faturaEnergiaId: [null],
    descricao: [null, Validators.required],
    valor: [null, Validators.required],
    tipo: [null, Validators.required],
    naturezaMercado: [null, Validators.required],
    contabilizaFatura: [true, Validators.required],
    tipoCCEE: [false, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private pontoMedicaoService: PontoMedicaoService,
    private concessionariaService: ConcessionariaService,
    private dateService: DateService,
    private faturaEnergiaService: FaturaEnergiaService,
    private datePipe: DatePipe,
    private alertService: AlertService
  ) { }

  novoFormControl(){
    return this.formBuilder.group({
      id: [null],
      pontoMedicaoId: [''],
      pontoMedicaoDesc: [null],
      concessionariaId: [''],
      concessionariaDesc: [null],
      mesReferencia: [''],
      dataVencimento: [''],
      segmento: [''],
      validado: [false],
    
      // Demanda
      valorDemandaContratadaPonta: [0, [Validators.required, Validators.min(0)]],
      valorDemandaContratadaForaPonta: [0, [Validators.required, Validators.min(0)]],
      valorDemandaFaturadaPontaConsumida: [0, [Validators.required, Validators.min(0)]],
      valorDemandaFaturadaForaPontaConsumida: [0, [Validators.required, Validators.min(0)]],
      valorDemandaFaturadaPontaNaoConsumida: [0, [Validators.required, Validators.min(0)]],
      valorDemandaFaturadaForaPontaNaoConsumida: [0, [Validators.required, Validators.min(0)]],
      valorDemandaUltrapassagemPonta: [0, [Validators.required, Validators.min(0)]],
      valorDemandaUltrapassagemForaPonta: [0, [Validators.required, Validators.min(0)]],
      valorDemandaReativaPonta: [0, [Validators.required, Validators.min(0)]],
      valorDemandaReativaForaPonta: [0, [Validators.required, Validators.min(0)]],
    
      // Consumo
      valorConsumoTUSDPonta: [0, [Validators.required, Validators.min(0)]],
      valorConsumoTUSDForaPonta: [0, [Validators.required, Validators.min(0)]],
      valorConsumoTEPonta: [0, [Validators.required, Validators.min(0)]],
      valorConsumoTEForaPonta: [0, [Validators.required, Validators.min(0)]],
      valorConsumoMedidoReativoPonta: [0, [Validators.required, Validators.min(0)]],
      valorConsumoMedidoReativoForaPonta: [0, [Validators.required, Validators.min(0)]],
    
      // Adicional Bandeira e Desconto TUSD
      valorAdicionalBandeiraPonta: [0, [Validators.required, Validators.min(0)]],
      valorAdicionalBandeiraForaPonta: [0, [Validators.required, Validators.min(0)]],
      valorDescontoTUSD: [0, [Validators.required, Validators.min(0)]],
    
      lancamentosAdicionais: [null]
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.selected = false;
    this.mesReferencia = new Date().toISOString().split("T")[0];
    await this.loadFaturas();
    this.loading = false;
  }

  async getPontosMedicao() {
    this.loading = true;
    this.concessionarias = [];
    await this.pontoMedicaoService
      .getDropDownComSegmento()
      .then((response: IResponseInterface<IDropDown[]>) => {        
        if (response.success) {
          this.pontosMedicao = response.data;
        } else {
          this.alertService.showError(response.message, 20000)
          this.source.load([]);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async onItemSelected(selectedItem: IDropDown) {
    if (selectedItem) {
      this.loading = true;
      this.pontoMedicao = selectedItem;
      this.control.get("pontoMedicaoId").setValue(selectedItem.id);
      this.control.get("pontoMedicaoDesc").setValue(selectedItem.descricao);
      this.control.get("segmento").setValue(selectedItem.obs);

      await this.concessionariaService
        .getPorPontoMedicao(selectedItem.id)
        .then((response: IResponseInterface<IDropDown[]>) => {
          if (response.success && response.data.length > 0) {
            this.concessionarias = response.data;
            if (response.data.length == 1) {
              this.control.get("concessionariaId").setValue(response.data[0]?.id);
              this.control.get("concessionariaDesc").setValue(response.data[0]?.descricao);
            }
          } else {
            this.source.load([]);
          }
        })
        .finally(() => {
          this.loading = false;
          this.onNext(selectedItem.id);
        });
    }
  }

  loadLancamento(event) {
    this.lancamentoControl.patchValue(event.data);
    this.lancamento = event.data;
  }

  showLancamento(){
    return this.lancamentoControl.get("id")?.value != null;
  }  

  resetLancamento(){
    this.lancamentoControl.reset();
    this.lancamento = null;
  }  

  excluirLancamento() {
    const lancamentoIndex = this.lancamentos.findIndex(
      (l) => l.id === this.lancamento?.id
    );
    if (lancamentoIndex !== -1) {
      this.lancamentos.splice(lancamentoIndex, 1);
    }
    this.source.load(this.lancamentos);
    this.resetLancamento();
  }

  async emitirFatura() {
    this.loading = true;
    await this.faturaEnergiaService.post(this.populateModel(this.control.value)).then(async (response: IResponseInterface<IFaturaEnergia>) => {
      if (response.success) {
        this.alertService.showSuccess("Fatura emitida com sucesso.", 20000);
        this.onSelect();
      } else {
        this.alertService.showError(response.message, 20000);
      }
      await this.ngOnInit();
    }).catch((error) => {
      this.alertService.showError(error.message, 20000);
    }).finally(async () => {
      this.loading = false;
    });
  }

  async selecionarFatura($event: any) {    
    if ($event.data.validado == true)
      this.stepperIndex = 3;

    this.selected = !this.selected;
    this.editLabel = $event.data.pontoMedicaoDesc;
    this.lancamentos = $event.data.lancamentosAdicionais;
    this.populateForm($event.data);
  }

  async onNext(pontoMedicaoId?: any) {
    this.loading = true;
    const mesRef = this.getControlValues("mesReferencia");
    if (!mesRef) {
      this.alertService.showWarning("Selecione um mês de referência.", 20000);
      this.loading = false;
      return;
    }
    const [month, year] = mesRef.split('/');
    const mesReferencia = new Date(+year, +month - 1, 1);
    await this.faturaEnergiaService
      .obterFaturas(mesReferencia ? this.datePipe.transform(mesReferencia, 'yyyy-MM-dd') : this.mesReferencia, pontoMedicaoId)
      .then((response: IResponseInterface<IFaturaEnergia[]>) => {
        if (response.success) {
          this.alertService.showWarning("Fatura já cadastrada no sistema.", 20000);
          if (response.data[0].validado == true)
            this.stepperIndex = 3;

          this.selected = true;
          this.editLabel = response.data[0].pontoMedicaoDesc;
          this.lancamentos = response.data[0].lancamentosAdicionais;
          this.populateForm(response.data[0]);
        } else {
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async onDelete() {
    this.loading = true;
    await this.faturaEnergiaService.delete(this.getControlValues("id")).then(async (response: IResponseInterface<IFaturaEnergia>) => {
      if (response.success) {
        this.selected = false;
        this.alertService.showSuccess("Fatura excluida com sucesso.", 20000);
        this.onSelect();
      } else {
        this.alertService.showError(response.message, 20000);
      }
      await this.ngOnInit();
    }).catch((error) => {
      this.alertService.showError(error.message, 20000);
    });
    this.loading = false;
  }

  async onValid(valid: boolean) {
    var fatura = this.faturas.find(f => f.id == this.getControlValues("id"));
    fatura.validado = valid;
    await this.faturaEnergiaService.put(fatura).then(async (response: IResponseInterface<IFaturaEnergia>) => {
      if (response.success) {
        this.alertService.showSuccess("Validação alterada com sucesso.", 20000);
        this.control.patchValue({
          validado: valid
        });
        await this.ngOnInit();
      } else {
        this.alertService.showError(response.message, 20000);
      }
    }).catch((error) => {
      this.alertService.showError(error.message, 20000);
    });
  }

  adicionarLancamento() {
    this.lancamentoControl.value.id = uuid.v4();
    this.lancamentoControl.value.faturaEnergiaId = this.getControlValues("id");
    this.lancamentos.push(this.lancamentoControl.value);
    this.source.load(this.lancamentos.sort((a, b) => a.descricao.localeCompare(b.descricao)));
    this.lancamentoControl.reset();
    this.excluirLancamento();
  }

  getControlValues(controlName: string) {
    return this.control.get(controlName)?.value;
  }

  getPontoMedicaoDesc(){
    var pontoMedicao = this.pontosMedicao.find(p => p.id == this.getControlValues("pontoMedicaoId"));
    return pontoMedicao ? " - " + pontoMedicao.descricao : '';
  }

  habilitaFatura() {
    return (
      this.getControlValues("dataVencimento") != '' &&
      this.getControlValues("concessionariaId") != '' &&
      this.getControlValues("mesReferencia") != ''
    );
  }

  getMeses() {
    return this.dateService.getMesesReferencia(6);
  }

  showInput(){
    return this.getControlValues("segmento") != "0";
  }

  async onSearch($event: any) {
    this.loading = true;
    this.mesReferencia = $event;
    await this.loadFaturas();
    this.loading = false;
  }

  async onSelect() {
    this.selected = true;
    this.control = this.novoFormControl();
    this.editLabel = null;
    this.lancamentos = [];
    this.source.load([]);    
    await this.populateForm(null);
  }

  async onCancel() {
    this.lancamentos = [];
    this.pontoMedicao = null;
    this.control = this.novoFormControl();
    this.editLabel = null;
    this.selected = false;
    await this.loadFaturas();
  }

  async loadFaturas() {
    this.loading = true;
    await this.faturaEnergiaService
      .obterFaturas(this.mesReferencia)
      .then((response: IResponseInterface<IFaturaEnergia[]>) => {
        if (response.success) {
          this.faturas = response.data;
          this.source.load(response.data);
        } else {
          this.source.load([]);
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async populateForm(dto: IFaturaEnergia): Promise<void> {
    this.loading = true;
    await this.getPontosMedicao();
    if (dto == null) {
      this.control = this.novoFormControl();
    } else {
      const dtoWithParsedDates = Object.keys(this.control.controls).reduce((acc, key) => {
        if (typeof dto[key] === 'string' && !isNaN(Date.parse(dto[key]))) {          
          acc[key] = this.datePipe.transform(dto[key], key === "mesReferencia" ? "MM/yyyy" : "dd/MM/yyyy");
        } else {
          acc[key] = dto[key];
        }
        return acc;
      }, {});
  
      this.control.patchValue(dtoWithParsedDates);
      this.editLabel = dto.pontoMedicaoDesc;
      this.concessionarias = [
        { id: dto.concessionariaId, descricao: dto.concessionariaDesc },
      ];
  
      this.source.load(dto.lancamentosAdicionais.sort((a, b) => a.descricao.localeCompare(b.descricao)));
  
      this.loading = false;
    }
  }
  
  populateLancamentos(){
    this.source.getAll().then((itemsArray: any[]) => {
      this.control.patchValue({
        lancamentosAdicionais: itemsArray
      });
    });
    this.populateModel(this.control.value);
  }

  populateModel(formValue): IFaturaEnergia {
    const dto: any = Object.keys(formValue).reduce((acc, key) => {
      const value = formValue[key];      
      if (key === "mesReferencia") {
        const [month, year] = value.split('/');
        acc[key] = `${year}-${month}-01`;
      } else if (key === "dataVencimento") {
        const [day, month, year] = value.split('/');
        acc[key] = `${year}-${month}-${day}`;
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});  
    return dto as IFaturaEnergia;
  }

  bloquearMenos(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === '+' || event.code === 'Minus') {
      event.preventDefault();
    }
  }

  public totalizador(contabilizaFatura: boolean, tipoCCEE: boolean): number {
    return this.lancamentos
      .filter(lanc => lanc.contabilizaFatura == contabilizaFatura && lanc.tipoCCEE == tipoCCEE)
      .reduce((soma, lanc) => soma + (lanc.valor || 0)*(lanc.tipo == 0 ? -1 : 1), 0);
  }

  filtrarLancamentos(contabilizaFatura: boolean, tipoCCEE: boolean) {
    return this.lancamentos.filter(lanc =>
      lanc.contabilizaFatura === contabilizaFatura &&
      lanc.tipoCCEE === tipoCCEE
    );
  }
  
  onValueChange(value: string, controlName: string) {
    this.control.patchValue({
      [controlName]: value
    });
  }
}
