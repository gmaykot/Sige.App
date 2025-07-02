import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ValidacaoMedicaoComponent } from '../validacao-medicao/validacao-medicao/validacao-medicao.component';

@Component({
  selector: 'ngx-edit-medicao',
  templateUrl: './edit-medicao.component.html',
  styleUrls: ['./edit-medicao.component.scss']
})
export class EditMedicaoComponent implements OnInit {
  @Input() medicao: any = null;
  
  
  public control = this.formBuilder.group({
    consumoAtivo: [null],
    mediaConsumoAtivo: [null],
    status: [null],
    descPontoMedicao: [null],
    descEmpresa: [null],
  });

  constructor(
    protected dialogRef: NbDialogRef<EditMedicaoComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.control.patchValue({ consumoAtivo: this.medicao.consumoAtivo }, { emitEvent: false });
    this.control.patchValue({ mediaConsumoAtivo: this.medicao.mediaConsumoAtivo }, { emitEvent: false });
    this.control.patchValue({ status: this.medicao.status }, { emitEvent: false });
    this.control.patchValue({ descPontoMedicao: this.medicao.pontoMedicao }, { emitEvent: false });
    this.control.patchValue({ descEmpresa: this.medicao.descPontoMedicao }, { emitEvent: false });
  }
  
  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.control.value);
  }
  
  delete() {
    this.dialogRef.close(this.control.value);
  }
}
