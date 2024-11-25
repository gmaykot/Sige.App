import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuarioComponent } from './administrativo/usuario/usuario.component';
import { NotFoundComponent } from '../@core/pages/not-found/not-found.component';
import { GeralGuard } from '../@core/guards/GeralGuard';
import { AlterarSenhaComponent } from './administrativo/alterar-senha/alterar-senha.component';
import { MenuSistemaComponent } from './administrativo/menu-sistema/menu-sistema.component';
import { AnaliseViabilidadeComponent } from './geral/analise-viabilidade/analise-viabilidade.component';
import { MedicaoComponent } from './geral/medicao/medicao.component';
import { RelatorioEconomiaComponent } from './geral/relatorio-economia/relatorio-economiacomponent';
import { EmpresaComponent } from './gerencial/empresa/empresa.component';
import { ConcessionariaComponent } from './gerencial/concessionaria/concessionaria.component';
import { ContratoComponent } from './gerencial/contrato/contrato.component';
import { FornecedorComponent } from './gerencial/fornecedor/fornecedor.component';
import { ValorConcessionariaComponent } from './gerencial/valor-concessionaria/valor-concessionaria.component';
import { RelatorioMedicaoComponent } from './geral/relatorio-medicao/relatorio-medicao.component';
import TarifaAplicacaoComponent from './gerencial/tarifa-aplicacao/tarifa-aplicacao.component';
import { BandeiraTarifariaComponent } from './gerencial/bandeira-tarifaria/bandeira-tarifaria.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivate: [ GeralGuard ],
  children: [
    {
      path: 'alterar-senha',
      component: AlterarSenhaComponent,
    },
    {
      path: 'analise-viabilidade',
      component: AnaliseViabilidadeComponent,
    },
    {
      path: 'bandeira-tarifaria',
      component: BandeiraTarifariaComponent,
    },
    {
      path: 'concessionarias',
      component: ConcessionariaComponent,
    },
    {
      path: 'contratos',
      component: ContratoComponent,
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'empresas',
      component: EmpresaComponent,
    },
    {
      path: 'fornecedores',
      component: FornecedorComponent,
    },
    {
      path: 'medicao',
      component: MedicaoComponent,
    },
    {
      path: 'menu-sistema',
      component: MenuSistemaComponent,
    },
    {
      path: 'relatorio-economia',
      component: RelatorioEconomiaComponent,
    },
    {
      path: 'relatorio-medicao',
      component: RelatorioMedicaoComponent,
    },
    {
      path: 'tarifas-aplicacao',
      component: TarifaAplicacaoComponent,
    },
    {
      path: 'usuarios',
      component: UsuarioComponent,
    },
    {
      path: 'valores-concessionarias',
      component: ValorConcessionariaComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
