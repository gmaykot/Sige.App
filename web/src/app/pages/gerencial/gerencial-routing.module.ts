import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmpresaComponent } from './empresa/empresa.component';
import { ConcessionariaComponent } from './concessionaria/concessionaria.component';
import { ContratoComponent } from './contrato/contrato.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { ValorConcessionariaComponent } from './valor-concessionaria/valor-concessionaria.component';
import { BandeiraTarifariaComponent } from './bandeira-tarifaria/bandeira-tarifaria.component';
import { SalarioMinimoComponent } from './salario-minimo/salario-minimo.component';
import { EnergiaAcumuladaComponent } from './energia-acumulada/energia-acumulada.component';
import TarifaAplicacaoComponent from './tarifa-aplicacao/tarifa-aplicacao.component';
import { SAGuard } from '../../@core/guards/SAGuard';

const routes: Routes = [
  { path: 'empresas', component: EmpresaComponent },
  { path: 'concessionarias', component: ConcessionariaComponent },
  { path: 'contratos', component: ContratoComponent },
  { path: 'fornecedores', component: FornecedorComponent },
  { path: 'valores-concessionarias', component: ValorConcessionariaComponent },
  { path: 'bandeira-tarifaria', component: BandeiraTarifariaComponent },
  { path: 'tarifas-aplicacao', component: TarifaAplicacaoComponent },
  { path: 'salario-minimo', component: SalarioMinimoComponent },
  { path: 'energia-acumulada', component: EnergiaAcumuladaComponent, canActivate: [SAGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerencialRoutingModule {}
