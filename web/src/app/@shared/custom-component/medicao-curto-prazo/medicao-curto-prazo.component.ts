import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-medicao-curto-prazo',
  templateUrl: './medicao-curto-prazo.component.html',
  styleUrls: ['./medicao-curto-prazo.component.scss']
})
export class MedicaoCurtoPrazoComponent  implements OnInit {
  @Input() medicao: any = null;
  @Input() icms: number = 17;

  public control = this.formBuilder.group({
    faturamento: [null],
    quantidade: [null],
    valorUnitario: [null],
    valorICMS: [null],
    valorProduto: [null],
    valorNota: [null]
  });

  constructor(
    protected dialogRef: NbDialogRef<MedicaoCurtoPrazoComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Preenche os valores iniciais
    if (this.medicao) {
      this.control.patchValue(this.medicao, { emitEvent: false });
    }

    // Observa mudanças e recalcula
    this.control.get('quantidade')?.valueChanges.subscribe(() => this.recalcularLinha());
    this.control.get('valorUnitario')?.valueChanges.subscribe(() => this.recalcularLinha());
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close(this.control.value);
  }

  public recalcularLinha(): void {
    const quantidade = this.control.get('quantidade')?.value ?? 0;
    const valorUnitario = this.control.get('valorUnitario')?.value ?? 0;

    const valorProduto = quantidade * valorUnitario;
    const valorICMS = this.icms * valorProduto / 100;
    const valorNota = valorProduto + valorICMS;

    this.control.patchValue({
      valorProduto,
      valorICMS,
      valorNota
    }, { emitEvent: false });
    console.log(this.control.value);
  }
}
