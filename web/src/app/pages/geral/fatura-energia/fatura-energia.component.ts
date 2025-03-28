import { Component } from "@angular/core";
import { IDropDown } from "../../../@core/data/drop-down";
import { LocalDataSource } from "ng2-smart-table";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "ngx-fatura-energia",
  templateUrl: "./fatura-energia.component.html",
  styleUrls: ["./fatura-energia.component.scss"],
})
export class FaturaEnergiaComponent {
  public empresas: Array<IDropDown> = [];
  public concessionarias: Array<IDropDown> = [];
  public editLabel: string = null;
  public source: LocalDataSource = new LocalDataSource();

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

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      empresa: {
        title: "Lançamento",
        type: "string",
      },
      concessionaria: {
        title: "Valor (R$)",
        type: "string",
      },
      valor: {
        title: "Tipo",
        type: "string",
      },
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  };

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
    console.log("Adicionado lançamentos:", this.lancamentoControl.value);
  }
}
