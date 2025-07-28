import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-ajuda-operacao',
  templateUrl: './ajuda-operacao.component.html',
  styleUrls: ['./ajuda-operacao.component.scss']
})
export class AjudaOperacaoComponent implements AfterViewInit{
  @ViewChild('ajudaOperacao') ajudaOperacaoTemplate!: TemplateRef<any>;
  @ViewChild('ajudaFaturamento') ajudaFaturamentoTemplate!: TemplateRef<any>;
  @ViewChild('ajudaRelatorio') ajudaRelatorioTemplate!: TemplateRef<any>;
  @ViewChild('ajudaRelatorioEconomia') ajudaRelatorioEconomiaTemplate!: TemplateRef<any>;
  @Input() tipoAjuda: string = '';

  templateAjuda!: TemplateRef<any>;

  ngAfterViewInit() {
    this.setTemplateAjuda();
  }

  setTemplateAjuda() {
    switch (this.tipoAjuda) {
      case 'ajuda-operacao':
        this.templateAjuda = this.ajudaOperacaoTemplate;
        break;
      case 'faturamento-coenel':
        this.templateAjuda = this.ajudaFaturamentoTemplate;
        break;  
      case 'relatorio-medicao':
        this.templateAjuda = this.ajudaRelatorioTemplate;
        break;
      case 'relatorio-economia':
        this.templateAjuda = this.ajudaRelatorioEconomiaTemplate;
        break;
      default:
        this.templateAjuda = this.ajudaOperacaoTemplate;
    }
  }
  
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
