import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-validacao-medicao',
  templateUrl: './validacao-medicao.component.html',
  styleUrls: ['./validacao-medicao.component.scss']
})
export class ValidacaoMedicaoComponent {
  habilitaValidar: boolean = false;
  constructor(
    protected dialogRef: NbDialogRef<ValidacaoMedicaoComponent>,
    private formBuilder: FormBuilder
  ) {}
  
  public control = this.formBuilder.group({
    validado: "false",
    observacao: "",
  });

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.control.value);
  }

  updateSingleSelectGroupValue(value): void {
    this.habilitaValidar = true;
  }
}
