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
    concessionariaId: [null],
    concessionariaDesc: [null],
    pontoMedicaoId: [null],
    pontoMedicaoDesc: [""],
    mesReferencia: [null],
    dataVencimento: [null],
    valorContratadoPonta: [null],
    valorContratadoForaPonta: [null],
    valorFaturadoPonta: [null],
    valorFaturadoForaPonta: [null],
    valorUltrapassagemForaPonta: [null],
    valorReativoPonta: [null],
    valorReativoForaPonta: [null],
    valorConsumoTUSDPonta: [null],
    valorConsumoTUSDForaPonta: [null],
    valorConsumoTEPonta: [null],
    valorConsumoTEForaPonta: [null],
    valorBandeiraPonta: [null],
    valorBandeiraForaPonta: [null],
    valorMedidoReativoPonta: [null],
    valorMedidoReativoForaPonta: [null],
    valorSubvencaoTarifaria: [null],
  });

  public lancamentoControl = this.formBuilder.group({
    id: [null],
    lancamento: [null],
    valor: [null],
    tipo: [null],
  });

  constructor(
    private formBuilder: FormBuilder,
    private pontoMedicaoService: PontoMedicaoService,
    private concessionariaService: ConcessionariaService,
    private dateService: DateService,
    private faturaEnergiaService: FaturaEnergiaService,
    private datePipe: DatePipe
  ) { }

  async ngOnInit() {
    await this.loadFaturas();
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
              this.control
                .get("concessionariaId")
                .setValue(response.data[0]?.id);
              this.control
                .get("concessionariaDesc")
                .setValue(response.data[0]?.descricao);
              this.control.get("pontoMedicaoId").setValue(selectedItem.id);
              this.control
                .get("pontoMedicaoDesc")
                .setValue(selectedItem.descricao);
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

  async selecionarFatura($event: any) {
    this.selected = !this.selected;
    this.populateForm($event.data);
  }

  habilitaNovaFatura() {
    return (
      this.controlSearch.get("mesReferencia").value != null &&
      this.controlSearch.get("mesReferencia").value != ""
    );
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

  async onSearch($event: any) {
    await this.loadFaturas();
  }

  async onSelect() {
    this.selected = !this.selected;
    await this.populateForm(null);
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

  desabilitaValoresPonta() {
    this.control.get("valorContratadoPonta")?.disable();
    this.control.get("valorFaturadoPonta")?.disable();
    this.control.get("valorReativoPonta")?.disable();
    this.control.get("valorConsumoTUSDPonta")?.disable();
    this.control.get("valorConsumoTEPonta")?.disable();
    this.control.get("valorBandeiraPonta")?.disable();
    this.control.get("valorMedidoReativoPonta")?.disable();
  }

  async populateForm(dto: IFaturaEnergia): Promise<void> {
    if (dto == null) {
      this.control.reset();
      await this.getPontosMedicao();
    } else {
      this.control.patchValue({
        id: dto.id,
        concessionariaId: dto.concessionariaId,
        concessionariaDesc: dto.descConcessionaria,
        pontoMedicaoId: dto.pontoMedicaoId,
        pontoMedicaoDesc: dto.descPontoMedicao,
        mesReferencia: this.datePipe.transform(dto.mesReferencia, "MM/yyyy"),
        dataVencimento: this.datePipe.transform(
          dto.dataVencimento,
          "dd/MM/yyyy"
        ),
        valorContratadoPonta: dto.valorContratadoPonta,
        valorContratadoForaPonta: dto.valorContratadoForaPonta,
        valorFaturadoPonta: dto.valorFaturadoPonta,
        valorFaturadoForaPonta: dto.valorFaturadoForaPonta,
        valorUltrapassagemForaPonta: dto.valorUltrapassagemForaPonta,
        valorReativoPonta: dto.valorReativoPonta,
        valorReativoForaPonta: dto.valorReativoForaPonta,
        valorConsumoTUSDPonta: dto.valorConsumoTUSDPonta,
        valorConsumoTUSDForaPonta: dto.valorConsumoTUSDForaPonta,
        valorConsumoTEPonta: dto.valorConsumoTEPonta,
        valorConsumoTEForaPonta: dto.valorConsumoTEForaPonta,
        valorBandeiraPonta: dto.valorBandeiraPonta,
        valorBandeiraForaPonta: dto.valorBandeiraForaPonta,
        valorMedidoReativoPonta: dto.valorMedidoReativoPonta,
        valorMedidoReativoForaPonta: dto.valorMedidoReativoForaPonta,
        valorSubvencaoTarifaria: dto.valorSubvencaoTarifaria,
      });

      this.pontosMedicao = [
        { id: dto.pontoMedicaoId, descricao: dto.descPontoMedicao },
      ];
      this.concessionarias = [
        { id: dto.concessionariaId, descricao: dto.descConcessionaria },
      ];

      this.desabilitaValoresPonta();
    }
  }
}
