import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnaliseViabilidadeComponent } from './analise-viabilidade/analise-viabilidade.component';
import { MedicaoComponent } from './medicao/medicao.component';
import { RelatorioEconomiaComponent } from './relatorio-economia/relatorio-economiacomponent';
import { RelatorioMedicaoComponent } from './relatorio-medicao/relatorio-medicao.component';
import { FaturamentoCoenelComponent } from './faturamento-coenel/faturamento-coenel.component';
import { FaturaEnergiaComponent } from './fatura-energia/fatura-energia.component';
import { GerenciamentoMensalComponent } from './gerenciamento-mensal/gerenciamento-mensal.component';
import { SAGuard } from '../../@core/guards/SAGuard';

const routes: Routes = [
  { path: 'analise-viabilidade', component: AnaliseViabilidadeComponent },
  { path: 'medicao', component: MedicaoComponent },
  { path: 'relatorio-economia', component: RelatorioEconomiaComponent },
  { path: 'relatorio-medicao', component: RelatorioMedicaoComponent },
  { path: 'faturamento-coenel', component: FaturamentoCoenelComponent },
  { path: 'fatura-energia', component: FaturaEnergiaComponent },
  { path: 'gerenciamento-mensal', component: GerenciamentoMensalComponent, canActivate: [SAGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeralRoutingModule {}
