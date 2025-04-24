import { Component, OnInit } from "@angular/core";
import { IDropDown } from "../../../@core/data/drop-down";
import { LocalDataSource } from "ng2-smart-table";
import { FormBuilder, Validators } from "@angular/forms";
import { settingsFatura, settingsLancamentos } from "../../../@shared/table-config/fatura-energia.config";
import { PontoMedicaoService } from "../../../@core/services/gerencial/ponto-medicao.service";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { IPontoMedicao } from "../../../@core/data/ponto-medicao";
import { ConcessionariaService } from "../../../@core/services/gerencial/concessionaria.service";
import { IConcessionaria } from "../../../@core/data/concessionarias";
import { DateService } from "../../../@core/services/util/date.service";

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
    concessionariaId: [null],
    concessionariaDesc: [null],
    pontoMedicaoId: [null],
    pontoMedicaoDesc: [null],
    mesReferencia: [null],
    dataVencimento: [null],
    empresas: [null],
    demPta: [null],
    demForaPta: [null],
    demPtaFaturada: [null],
    demForaPtaFaturada: [null],
    demForaPtaUltrapassagem: [null],
    demPtaReativa: [null],
    demForaPtaReativa: [null],
    consPtaMedioTusd: [null],
    consForaPtaMedioTusd: [null],
    consPtaMedioTe: [null],
    consForaPtaMedioTe: [null],
    adBandTarVigPta: [null],
    adBandTarVigFPta: [null],
    consPtaMedidoReativo: [null],
    consForaPtaMedidoReativo: [null],
    subvencaoTarifaria: [null]
  });

  public lancamentoControl = this.formBuilder.group({
    id: [null],
    lancamento: [null],
    valor: [null],
    tipo: [null]
  })  

  constructor(private formBuilder: FormBuilder, private pontoMedicaoService: PontoMedicaoService, private concessionariaService: ConcessionariaService, private dateService: DateService) { }

  async ngOnInit() {
    
  }

  async getPontosMedicao() {
    this.loading = true;
    await this.pontoMedicaoService
      .getDropDownComSegmento()
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.pontosMedicao = response.data;
        } else {
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
      console.log(this.pontoMedicao);
      await this.concessionariaService
        .getPorPontoMedicao(selectedItem.id)
        .then((response: IResponseInterface<IDropDown[]>) => {
          if (response.success && response.data.length > 0) {
            this.concessionarias = response.data;
            if (response.data.length == 1) {
              this.control.get("concessionariaId").setValue(response.data[0]?.id);
              this.control.get("concessionariaDesc").setValue(response.data[0]?.descricao);
              this.control.get("pontoMedicaoId").setValue(selectedItem.id);
              this.control.get("pontoMedicaoDesc").setValue(selectedItem.descricao);
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
    const lancamentoIndex = this.lancamentos.findIndex(l => l.id === event.data?.id);
    if (lancamentoIndex !== -1) {
      this.lancamentos.splice(lancamentoIndex, 1);
      this.source.load(this.lancamentos);
    }
  }

  emitirFatura() {
    console.log("Emitindo fatura com os dados:", this.control.value);
  }

  adicionarLancamento() {
    this.lancamentoControl.value.id = this.lancamentos.length + 1;
    this.lancamentos.push(this.lancamentoControl.value);
    this.source.load(this.lancamentos);
    this.lancamentoControl.reset();
  }

  getControlValues(controlName: string) {
    return this.control.get(controlName).value;
  }

  selecionarFatura(event) {
    this.selected = true;
  }

  habilitaNovaFatura() {
    return this.controlSearch.get("mesReferencia").value != null && this.controlSearch.get("mesReferencia").value != '';
  }

  habilitaFatura() {
    return (this.getControlValues("dataVencimento") != null && this.getControlValues("concessionariaId") != null && this.getControlValues("mesReferencia") != null);
  }

  getMeses() {
    return this.dateService.getMesesReferencia(6);
  }

  async onSearch($event: any) {
    await this.loadFaturas();
  }

  async onSelect() {
    this.selected = !this.selected;
    await this.getPontosMedicao();
  }

  async loadFaturas(){
    this.loading = true;
    await this.pontoMedicaoService
      .getDropDownComSegmento()
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.pontosMedicao = response.data;
        } else {
          this.source.load([]);
        }        
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
