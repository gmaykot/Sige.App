import { NgModule } from '@angular/core';
import { SharedModule } from '../../@shared/shared.module';

import { GeralRoutingModule } from './geral-routing.module';
import { AnaliseViabilidadeComponent } from './analise-viabilidade/analise-viabilidade.component';
import { MedicaoComponent } from './medicao/medicao.component';
import { RelatorioEconomiaComponent } from './relatorio-economia/relatorio-economiacomponent';
import { RelatorioMedicaoComponent } from './relatorio-medicao/relatorio-medicao.component';
import { FaturamentoCoenelComponent } from './faturamento-coenel/faturamento-coenel.component';
import { FaturaEnergiaComponent } from './fatura-energia/fatura-energia.component';
import { GerenciamentoMensalComponent } from './gerenciamento-mensal/gerenciamento-mensal.component';

@NgModule({
  declarations: [
    AnaliseViabilidadeComponent,
    MedicaoComponent,
    RelatorioEconomiaComponent,
    RelatorioMedicaoComponent,
    FaturamentoCoenelComponent,
    FaturaEnergiaComponent,
    GerenciamentoMensalComponent,
  ],
  imports: [
    SharedModule,
    GeralRoutingModule,
  ],
})
export class GeralModule {}