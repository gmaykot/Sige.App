import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IEmpresa } from '../../@core/data/empresa';
import { IDropDown } from '../../@core/data/drop-down';
import { IContratoEmpresas } from '../../@core/data/contrato-empresas';

@Component({
  selector: 'nb-name-prompt',
  template: `
<form [formGroup]="control">
    <nb-card accent="warning">
        <input hidden id="id" type="text" formControlName="id">
        <nb-card-header>Cadastro de Empresa</nb-card-header>
        <nb-card-body>
            <div class="row">
                <div class="col-sm-12">
                    <div class="form-group">
                      <label for="inputFirstName" class="label">Empresa*</label>
                      <input
                        fullWidth
                        fieldSize="small"
                        formControlName="empresa"
                        nbInput
                        type="text"
                        placeholder="Pesquise pelo nome da empresa"
                        [nbAutocomplete]="autoControl" />

                      <nb-autocomplete #autoControl>
                        <nb-option *ngFor="let option of filteredControlOptions$ | async" [value]="option">
                          {{ option }}
                        </nb-option>
                      </nb-autocomplete>
                    </div>
                </div>          
            </div>
        </nb-card-body>
        <nb-card-footer>
            <div class="text-center">
                <button nbButton status="warning" (click)="submit()" [disabled]="!control.valid">Confirmar</button>
                <button nbButton status="basic" style="margin-left: 2.5rem;" (click)="cancel()">Cancelar</button>
            </div>
        </nb-card-footer>  
    </nb-card>
</form>
  `,
})
export class GrupoEmpresaComponent implements OnInit {
  @Input() grupoEmpresas: IEmpresa[];
  @Input() empresaDropdown: IDropDown[];
  @Input() contratoId: string;
  @Input() valor: IContratoEmpresas;

  public control = this.formBuilder.group({
    id: ["", Validators.required],
    empresa: ["", Validators.required]
  });

  options: string[];
  filteredControlOptions$: Observable<string[]>;

  constructor(protected dialogRef: NbDialogRef<GrupoEmpresaComponent>, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.getValores();
  }

  getValores() {
    this.options = this.empresaDropdown.map((x: any) => x.descricao);
    this.filteredControlOptions$ = of(this.options);

    const idMap = new Map(this.empresaDropdown.map(x => [x.descricao, x.id]));

    this.filteredControlOptions$ = this.control.get('empresa').valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );

    this.control.get('empresa').valueChanges.subscribe(value => {
      const id = idMap.get(value);
      if (id) {
        this.control.patchValue({ id: id }, { emitEvent: false });
      }
    });
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    const selectedEmpresa = this.grupoEmpresas.find(x => x.id === this.control.value.id);

    this.valor.contratoId = this.contratoId;
    this.valor.empresaId = selectedEmpresa.id;
    this.valor.dscEmpresa = selectedEmpresa.nome;
    this.valor.cnpjEmpresa = selectedEmpresa.cnpj;
  
    this.dialogRef.close(this.valor);
  }
}
