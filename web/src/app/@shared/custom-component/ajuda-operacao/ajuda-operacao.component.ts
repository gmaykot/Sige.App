import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-ajuda-operacao',
  templateUrl: './ajuda-operacao.component.html',
  styleUrls: ['./ajuda-operacao.component.scss']
})
export class AjudaOperacaoComponent {
  @Input() tipoAjuda: string = 'ajuda-operacao';
  constructor(private router: Router, private ref: NbDialogRef<AjudaOperacaoComponent>) {}

  abrirNovaAba(url: string) {
    const urlNova = this.router.serializeUrl(
      this.router.createUrlTree([url])
    );
    window.open(urlNova, '_blank');
  }

  onClose() {
    this.ref.close();
  }
}
