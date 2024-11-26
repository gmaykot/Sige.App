import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { FormBuilder } from "@angular/forms";
import { IValorMensal } from "../../@core/data/valor-mensal";
import { IValorAnual } from "../../@core/data/valor-anual";
import { DatePipe } from "@angular/common";
import { DateService } from "../../@core/services/util/date.service";

@Component({
  selector: "ngx-valor-mensal-component",
  template: `
    <form [formGroup]="control">
      <nb-card accent="warning">
        <input hidden id="id" type="text" formControlName="id" />
        <nb-card-header>Cadastro de Valor Mensal</nb-card-header>
        <nb-card-body>
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label for="inputFirstName" class="label">Vigência*</label>
                <nb-select
                  fullWidth
                  placeholder="Selecione"
                  formControlName="valorAnualContratoId"
                >
                  <nb-option *ngFor="let valor of valoresAnuais" value="{{ valor.id }}">{{getVigencia(valor)}}</nb-option>
                </nb-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label for="inputFirstName" class="label">Competência*</label>
                <input
                  type="text"
                  nbInput
                  fullWidth
                  id="inputFirstName"
                  mask="M0/0000" placeholder="__/____" [dropSpecialCharacters]="false"
                  formControlName="competencia"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label for="inputFirstName" class="label">Horas/Mês*</label>
                <input
                  type="number"
                  nbInput
                  fullWidth
                  id="inputFirstName"
                  formControlName="horasMes"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <div class="form-group">
                <label for="inputFirstName" class="label"
                  >Energia Contratada*</label
                >
                <input
                  type="number"
                  nbInput
                  fullWidth
                  id="inputFirstName"
                  formControlName="energiaContratada"
                />
              </div>
            </div>
          </div>
        </nb-card-body>
        <nb-card-footer>
          <div class="text-center">
            <button nbButton status="warning" (click)="submit()">
              Confirmar
            </button>
            <button
              nbButton
              status="basic"
              style="margin-left: 2.5rem;"
              (click)="cancel()"
            >
              Cancelar
            </button>
          </div>
        </nb-card-footer>
      </nb-card>
    </form>
  `,
})
export class ValorMensalComponent implements OnInit {
  @Input() valor: IValorMensal;
  @Input() valoresAnuais: IValorAnual[];
  @Input() datePipe: DatePipe;
  @Input() dateService: DateService
  public control = this.formBuilder.group({
    id: "",
    competencia: "",
    horasMes: 0,
    energiaContratada: 0,
    valorAnualContratoId: "",
    vigencia: "",
  });

  constructor(
    protected dialogRef: NbDialogRef<ValorMensalComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getValores();
  }

  getValores() {
    this.control = this.formBuilder.group({
      id: this.valor.id,
      competencia: this.dateService.usStringToPtBrString(this.valor.competencia, 'MM/yyyy'),
      horasMes: this.valor.horasMes,
      energiaContratada: this.valor.energiaContratada,
      valorAnualContratoId: this.valor.valorAnualContratoId,
      vigencia: '',
    });
  }

  getVigencia(valorAnual: IValorAnual) {
    return `${this.datePipe.transform(valorAnual.dataVigenciaInicial, 'dd/MM/yyyy')} - ${this.datePipe.transform(valorAnual.dataVigenciaFinal, 'dd/MM/yyyy')}`
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {    
    this.valor.id = this.control.value.id;
    this.valor.competencia = this.dateService.ptBrStringToUsString(`01/${this.control.value.competencia}`, "yyyy-MM-dd");
    this.valor.valorAnualContratoId = this.control.value.valorAnualContratoId;
    this.valor.horasMes = this.control.value.horasMes;
    this.valor.energiaContratada = this.control.value.energiaContratada;
    var valorAnual = this.valoresAnuais.find((v) => v.id == this.control.value.valorAnualContratoId);
    if (valorAnual) {
      this.valor.vigencia = this.getVigencia(valorAnual);
    }
    this.dialogRef.close(this.valor);
  }
}
