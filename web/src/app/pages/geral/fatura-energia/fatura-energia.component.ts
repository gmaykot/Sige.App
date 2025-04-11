import { Component } from "@angular/core";
import { IDropDown } from "../../../@core/data/drop-down";
import { LocalDataSource } from "ng2-smart-table";
import { FormBuilder } from "@angular/forms";
import { settingsFaturaEnergia } from "../../../@shared/table-config/fatura-energia.config";

@Component({
  selector: "ngx-fatura-energia",
  templateUrl: "./fatura-energia.component.html",
  styleUrls: ["./fatura-energia.component.scss"],
})
export class FaturaEnergiaComponent {
  public settings = settingsFaturaEnergia;
  public source: LocalDataSource = new LocalDataSource();

  public empresas: Array<IDropDown> = [];
  public concessionarias: Array<IDropDown> = [];
  public editLabel: string = null;
  public tipoSegmento: boolean;
  public lancamentos: any[] = [];

  public control = this.formBuilder.group({
    concessionariaId: [null],
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
    lancamento: [null],
    valor: [null],
    tipo: [null]
  })

  constructor(private formBuilder: FormBuilder) {}

  onItemSelected(selectedItem: IDropDown) {
    if (selectedItem) {
      this.control.get("empresas").setValue(selectedItem?.descricao);
    }
  }

  selecionarColeta(event) {
    
  }

  emitirFatura() {
      console.log("Emitindo fatura com os dados:", this.control.value);
  }

  adicionarLancamento() {
    this.lancamentos.push(this.lancamentoControl.value);
    this.source.load(this.lancamentos);
    console.log("Lançamento adicionado:", this.lancamentos);
  }

  getControlValues(controlName: string) {
    return this.control.get(controlName).value;
  }
}
