import { Component, OnInit } from "@angular/core";
import { IDropDown } from "../../../@core/data/drop-down";
import { LocalDataSource } from "ng2-smart-table";
import { FormBuilder, Validators } from "@angular/forms";
import {
  settingsFatura,
  settingsLancamentos,
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
  public settings = settingsFatura;
  public settingsLancamentos = settingsLancamentos;
  public source: LocalDataSource = new LocalDataSource();

  public pontosMedicao: Array<IDropDown> = [];
  public concessionarias: Array<IDropDown> = [];
  public pontoMedicao: IDropDown = null;
  public editLabel: string = null;
  public lancamentos: any[] = [];
  public selected: boolean = false;
  public loading: boolean = false;

  public controlSearch = this.formBuilder.group({
    mesReferencia: ["", Validators.required],
  });

   public control = this.formBuilder.group({
    id: [null],
    pontoMedicaoId: [null],
    pontoMedicaoDesc: [null],
    concessionariaId: [null],
    concessionariaDesc: [null],
    mesReferencia: [''], // string em formato yyyy-MM-dd
    dataVencimento: [''],
    segmento: [''],
    validado: [false],
    // Demanda
    valorDemandaContratadaPonta: [null],
    valorDemandaContratadaForaPonta: [0],
    valorDemandaFaturadaPontaConsumida: [null],
    valorDemandaFaturadaForaPontaConsumida: [0],
    valorDemandaFaturadaPontaNaoConsumida: [null],
    valorDemandaFaturadaForaPontaNaoConsumida: [0],
    valorDemandaUltrapassagemPonta: [0],
    valorDemandaUltrapassagemForaPonta: [0],
    valorDemandaReativaPonta: [null],
    valorDemandaReativaForaPonta: [0],
    // Consumo
    valorConsumoTUSDPonta: [null],
    valorConsumoTUSDForaPonta: [0],
    valorConsumoTEPonta: [null],
    valorConsumoTEForaPonta: [0],
    valorConsumoMedidoReativoPonta: [null],
    valorConsumoMedidoReativoForaPonta: [0],
    // Adicional Bandeira, Subvenção e Desconto TUSD
    valorAdicionalBandeiraPonta: [null],
    valorAdicionalBandeiraForaPonta: [0],
    valorSubvencaoTarifaria: [0],
    valorDescontoTUSD: [0],
    lancamentosAdicionais: [null]
  });

  public lancamentoControl = this.formBuilder.group({
    id: [null],
    faturaEnergiaId: [null],
    descricao: [null],
    valor: [null],
    tipo: [null],
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

  async ngOnInit() {
    this.selected = false;
    await this.loadFaturas();
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
        });
    }
  }

  excluirLancamento(event) {
    const lancamentoIndex = this.lancamentos.findIndex(
      (l) => l.id === event.data?.id
    );
    if (lancamentoIndex !== -1) {
      this.lancamentos.splice(lancamentoIndex, 1);
    }
    this.source.load(this.lancamentos);
  }

  emitirFatura() {
    console.log("Emitindo fatura com os dados:", this.populateModel(this.control.value));
  }

  adicionarLancamento() {
    this.lancamentoControl.value.id = uuid.v4();
    this.lancamentoControl.value.faturaEnergiaId = this.getControlValues("id");
    this.lancamentos.push(this.lancamentoControl.value);
    this.source.load(this.lancamentos);
    this.lancamentoControl.reset();
  }

  getControlValues(controlName: string) {
    return this.control.get(controlName)?.value;
  }

  getPontoMedicaoDesc(){
    var pontoMedicao = this.pontosMedicao.find(p => p.id == this.getControlValues("pontoMedicaoId"));
    return pontoMedicao ? " - " + pontoMedicao.descricao : '';
  }

  async selecionarFatura($event: any) {
    this.selected = !this.selected;
    this.editLabel = $event.data.pontoMedicaoDesc;
    this.lancamentos = $event.data.lancamentosAdicionais;
    this.populateForm($event.data);
  }

  habilitaFatura() {
    return (
      this.getControlValues("dataVencimento") != null &&
      this.getControlValues("concessionariaId") != null &&
      this.getControlValues("mesReferencia") != null
    );
  }

  getMeses() {
    return this.dateService.getMesesReferencia(6);
  }

  showInput(){
    return this.getControlValues("segmento") != "0";
  }

  async onSearch($event: any) {
    await this.loadFaturas();
  }

  async onSelect() {
    this.selected = !this.selected;
    this.lancamentos = [];
    this.source.load([]);
    await this.populateForm(null);
  }

  async onCancel() {
    this.selected = false;
    this.lancamentos = [];
    this.pontoMedicao = null;
    this.control.reset();
    this.editLabel = null;
    await this.loadFaturas();
  }

  async loadFaturas() {
    this.loading = true;
    await this.faturaEnergiaService
      .get()
      .then((response: IResponseInterface<IFaturaEnergia[]>) => {
        if (response.success) {
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
      this.control.reset();    
      } else {
      // Mapeando as propriedades e tratando as datas
      const dtoWithParsedDates = Object.keys(this.control.controls).reduce((acc, key) => {
        // Verificando se o campo é uma data e fazendo o parse        
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
  
      this.source.load(dto.lancamentosAdicionais);
  
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

  populateModel(formValue): any {
    const dto: any = Object.keys(formValue).reduce((acc, key) => {
      const value = formValue[key];

      if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        // Detecta se o campo é uma data no formato esperado
        if (key === 'mesReferencia') {
          const [month, year] = value.split('/');
          acc[key] = new Date(Number(year), Number(month) - 1, 1); // mês começa em 0
        } else {
          const [day, month, year] = value.split('/');
          acc[key] = new Date(Number(year), Number(month) - 1, Number(day));
        }
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});
  
  return dto;
}
  
  getSettingsLancamentos(){   
    var settingsLancamentosEmissao = settingsLancamentos;
    settingsLancamentosEmissao.actions.delete = false;
    return settingsLancamentosEmissao;
  }

  onFirstSubmit() {
    this.control.markAsDirty();
  }
}
