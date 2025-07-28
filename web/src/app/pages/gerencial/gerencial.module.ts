import { NgModule } from '@angular/core';
import { SharedModule } from '../../@shared/shared.module';

import { GerencialRoutingModule } from './gerencial-routing.module';
import { BandeiraTarifariaComponent } from './bandeira-tarifaria/bandeira-tarifaria.component';
import { ConcessionariaComponent } from './concessionaria/concessionaria.component';
import { ContratoComponent } from './contrato/contrato.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { EnergiaAcumuladaComponent } from './energia-acumulada/energia-acumulada.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { SalarioMinimoComponent } from './salario-minimo/salario-minimo.component';

import TarifaAplicacaoComponent from './tarifa-aplicacao/tarifa-aplicacao.component';
import { ValorConcessionariaComponent } from './valor-concessionaria/valor-concessionaria.component';

@NgModule({
  declarations: [
    BandeiraTarifariaComponent,
    ConcessionariaComponent,
    ContratoComponent,
    EmpresaComponent,
    EnergiaAcumuladaComponent,
    FornecedorComponent,
    SalarioMinimoComponent,
    TarifaAplicacaoComponent,
    ValorConcessionariaComponent
  ],
  imports: [
    SharedModule,
    GerencialRoutingModule,
  ],
})
export class GerencialModule {}