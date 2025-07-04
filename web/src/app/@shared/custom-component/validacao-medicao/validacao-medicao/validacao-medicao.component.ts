import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-validacao-medicao',
  templateUrl: './validacao-medicao.component.html',
  styleUrls: ['./validacao-medicao.component.scss']
})
export class ValidacaoMedicaoComponent implements OnInit {
  @Input() observacao: string = '';
  @Input() tipoRelatorio: string = 'Medição';
  @Input() validado: boolean = null;
  
  public control = this.formBuilder.group({
    validado: [null as boolean | null],
    observacao: [null],
  });

  constructor(
    protected dialogRef: NbDialogRef<ValidacaoMedicaoComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.control.patchValue({ observacao: this.observacao }, { emitEvent: false });
    this.control.patchValue({ validado: this.validado }, { emitEvent: false });
  }
  
  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.control.value);
  }
}
