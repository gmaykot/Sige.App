import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { FormBuilder } from "@angular/forms";
import { IValorConcessionaria } from "../../../@core/data/valores-concessionarias";
import { ValorConcessionariaService } from "../../../@core/services/gerencial/valor-concessionaria.service";
import { ConcessionariaService } from "../../../@core/services/gerencial/concessionaria.service";
import { settingsValorConcessionaria } from "../../../@shared/table-config/valor.concessionaria.config";
import { NbDialogService } from "@nebular/theme";
import { CustomDeleteConfirmationComponent } from "../../../@shared/custom-component/custom-delete-confirmation.component";
import { IDropDown } from "../../../@core/data/drop-down";

@Component({
  selector: "ngx-valor-concessionaria",
  templateUrl: "./valor-concessionaria.component.html",
  styleUrls: ["./valor-concessionaria.component.scss"],
})
export class ValorConcessionariaComponent implements OnInit {
  concessionarias?: IDropDown[];
  settings = settingsValorConcessionaria;
  public loading = true;
  public successMesage = null;
  public edit = false;
  source: LocalDataSource = new LocalDataSource();
  public control = this.formBuilder.group({
    id: "",
    ativo: false,
    concessionariaId: "",
    numeroResolucao: "",
    subGrupo: "",
    dataUltimoReajuste: null,
    kWhPSVerde: 0,
    kWhFPSVerde: 0,
    demVerde: 0,
    kWhPSAzul: 0,
    kWhFPSAzul: 0,
    demPAzul: 0,
    demFPAzul: 0,
    kWhBT: 0,
    tusdFPKWhAzul0: 0,
    cusdFPAzul50: 0,
    tusdFPAzul100: 0,
    tusdPAzul100: 0,
    tusdPKWhCalcVerde0: 0,
    tusdPVerde0: 0,
    cusdPCalcVerde50: 0,
    tusdVerde100: 0,
  });

  constructor(
    private formBuilder: FormBuilder,
    private valorConcessionariaService: ValorConcessionariaService,
    private concessionariaService: ConcessionariaService,
    private dialogService: NbDialogService
  ) {}

  async ngOnInit() {
    await this.getConcessionarias();
    await this.getValoresConcessionarias();
  }

  async getValoresConcessionarias() {
    this.loading = true;
    await this.valorConcessionariaService
      .get()
      .then((response: IResponseInterface<IValorConcessionaria[]>) => {
        if (response.success) {
          this.source.load(response.data);
        } 
        this.loading = false;
      });
  }

  async getConcessionarias() {
    await this.concessionariaService
      .getDropDown()
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.concessionarias = response.data;
        }         
      });
  }

  private getValor(): IValorConcessionaria {
    return this.control.value as IValorConcessionaria;
  }

  private async changeValor() {
    const valor = this.getValor();
    if (valor.id == null || valor.id == "") {
      await this.post(valor);
    } else {
      await this.put(valor);
    }
    this.limparFormulario();
  }

  private async post(valor: IValorConcessionaria) {
    await this.valorConcessionariaService.post(valor).then();
    {
      await this.getValoresConcessionarias();
      this.setSuccessMesage("Valor cadastrado com sucesso.");
    }
  }

  private async put(valor: IValorConcessionaria) {
    await this.valorConcessionariaService.put(valor).then();
    {
      await this.getValoresConcessionarias();
      this.setSuccessMesage("Valor alterado com sucesso.");
    }
  }

  async onDeleteConfirm() {
    this.dialogService
      .open(CustomDeleteConfirmationComponent)
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          await this.valorConcessionariaService
            .delete(this.getValor().id)
            .then();
          {
            this.limparFormulario();
            this.setSuccessMesage("Valor excluído com sucesso.");
            await this.getValoresConcessionarias();
          }
        }
      });
  }

  onSelect(event): void {
    this.limparFormulario();
    const val = event.data as IValorConcessionaria;
    this.control = this.formBuilder.group({
      id: val.id,
      ativo: val.ativo,
      concessionariaId: val.concessionariaId,
      subGrupo: val.subGrupo,
      cusdFPAzul50: val.cusdFPAzul50,
      cusdPCalcVerde50: val.cusdPCalcVerde50,
      dataUltimoReajuste: val.dataUltimoReajuste,
      demFPAzul: val.demFPAzul,
      demPAzul: val.demPAzul,
      demVerde: val.demVerde,
      kWhBT: val.kWhBT,
      kWhFPSAzul: val.kWhFPSAzul,
      kWhFPSVerde: val.kWhFPSVerde,
      kWhPSAzul: val.kWhPSAzul,
      kWhPSVerde: val.kWhPSVerde,
      numeroResolucao: val.numeroResolucao,
      tusdFPAzul100: val.tusdFPAzul100,
      tusdFPKWhAzul0: val.tusdFPKWhAzul0,
      tusdPAzul100: val.tusdPAzul100,
      tusdPKWhCalcVerde0: val.tusdPKWhCalcVerde0,
      tusdPVerde0: val.tusdPVerde0,
      tusdVerde100: val.tusdVerde100,
    });
    this.edit = true;
  }

  onSubmit(): void {
    this.changeValor();
  }

  private setSuccessMesage(mensagem): void {
    this.successMesage = mensagem;
    setTimeout(() => {
      this.successMesage = null;
    }, 10000);
  }

  limparFormulario(): void {
    this.control.reset();
    this.edit = false;
  }
}
