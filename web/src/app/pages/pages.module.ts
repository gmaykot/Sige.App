import { NgModule } from '@angular/core';
import { NbAccordionModule, NbActionsModule, NbAlertModule, NbAutocompleteModule, NbButtonGroupModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbMenuModule, NbProgressBarModule, NbRadioModule, NbSelectModule, NbSpinnerModule, NbStepperModule, NbTabsetModule, NbToastrModule, NbToggleModule, NbTooltipModule, NbTreeGridModule, NbUserModule, NbWindowModule } from '@nebular/theme';
import { ChartModule } from 'angular2-chartjs';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { UsuarioComponent } from './administrativo/usuario/usuario.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AlterarSenhaComponent } from './administrativo/alterar-senha/alterar-senha.component';
import { CustomDeleteConfirmationComponent } from '../@shared/custom-component/custom-delete-confirmation.component';
import { MenuSistemaComponent } from './administrativo/menu-sistema/menu-sistema.component';
import { MatTableModule } from '@angular/material/table';
import { CheckboxComponent } from '../@shared/custom-component/checkbox-component';
import { SelectPeriodoComponent } from '../@shared/custom-component/select-periodo.component';
import { AgenteMedicaoComponent } from '../@shared/custom-component/agente-medicao.component';
import { PontoMedicaoComponent } from '../@shared/custom-component/ponto-medicao.component';
import { ContatoComponent } from '../@shared/custom-component/contato.component';
import { SelectStatusComponent } from '../@shared/custom-component/select-status.component';
import { RadioButtonComponent } from '../@shared/custom-component/radiobutton-component';
import { AnaliseViabilidadeComponent } from './geral/analise-viabilidade/analise-viabilidade.component';
import { MedicaoComponent } from './geral/medicao/medicao.component';
import { RelatorioEconomiaComponent } from './geral/relatorio-economia/relatorio-economiacomponent';
import { ConcessionariaComponent } from './gerencial/concessionaria/concessionaria.component';
import { ContratoComponent } from './gerencial/contrato/contrato.component';
import { EmpresaComponent } from './gerencial/empresa/empresa.component';
import { FornecedorComponent } from './gerencial/fornecedor/fornecedor.component';
import { ValorConcessionariaComponent } from './gerencial/valor-concessionaria/valor-concessionaria.component';
import { ValorAnualComponent } from '../@shared/custom-component/valor-anual.component';
import { ValorMensalComponent } from '../@shared/custom-component/valor-mensal.component';
import { NgxMaskModule } from 'ngx-mask';
import { HistoricoMedicaoComponent } from '../@shared/custom-component/historico-medicao.component';
import { EnvioEmailComponent } from '../@shared/custom-component/envio-email/envio-email.component';
import { ListaContatoComponent } from '../@shared/custom-component/contato/contato.subcomponent';
import { AlertComponent } from '../@shared/custom-component/alert-component/alert-component';
import { ChartjsBarComponent } from '../@shared/charts/chartjs-bar.component';
import { CapitalizePipe } from '../@theme/pipes';
import { RelatorioMedicaoPdfService } from './geral/relatorio-medicao/relatorio-medicao-pdf.service';
import { RelatorioMedicaoComponent } from './geral/relatorio-medicao/relatorio-medicao.component';
import { AlertService } from '../@core/services/util/alert.service';
import { ValidacaoMedicaoComponent } from '../@shared/custom-component/validacao-medicao/validacao-medicao/validacao-medicao.component';
import { GrupoEmpresaComponent } from '../@shared/custom-component/grupo-empresa.component';
import { DateFilterComponent } from '../@shared/custom-component/filters/date-filter.component';
import TarifaAplicacaoComponent from './gerencial/tarifa-aplicacao/tarifa-aplicacao.component';
import { DateInputComponent } from '../@shared/custom-component/date-input/date-input.component';
import { MenuUsuarioComponent } from '../@shared/custom-component/menu-usuario/menu-usuario.component';
import { BandeiraTarifariaComponent } from './gerencial/bandeira-tarifaria/bandeira-tarifaria.component';
import { ImpostoConcessionariaComponent } from '../@shared/custom-component/imposto-concessionaria/imposto-concessionaria.component';
import { FaturamentoCoenelComponent } from './geral/faturamento-coenel/faturamento-coenel.component';
import { SalarioMinimoComponent } from './gerencial/salario-minimo/salario-minimo.component';
import { AutoCompleteComponent } from '../@shared/custom-component/auto-complete/auto-complete.component';
import { BandeiraTarifariaVigenteComponent } from '../@shared/custom-component/bandeira-tarifaria-vigente/bandeira-tarifaria-vigente.component';
import { DeleteActionLinkComponent } from '../@shared/custom-component/delete-action-link/delete-action-link.component';
import { FaturaEnergiaComponent } from './geral/fatura-energia/fatura-energia.component';
import { GhostComponent } from './administrativo/ghost/ghost.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbTooltipModule,
    DashboardModule,
    NbCardModule,
    ThemeModule,
    NbIconModule, 
    NbInputModule, 
    NbTreeGridModule,
    NbLayoutModule,
    NbButtonModule,
    NbSelectModule,
    Ng2SmartTableModule,
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    NbStepperModule,
    NbAlertModule,
    NbSpinnerModule,
    NbAccordionModule,
    MatTableModule,
    NbCheckboxModule,
    NbActionsModule,
    NbToggleModule,
    NbRadioModule,
    NgxMaskModule.forRoot(),
    NbListModule,
    NbUserModule,
    NbWindowModule.forRoot(),
    ChartModule,
    NbToastrModule.forRoot(),
    NbTabsetModule,
    NbButtonGroupModule,
    NbAutocompleteModule,
    NbProgressBarModule,
  ],
  declarations: [
    PagesComponent,
    ConcessionariaComponent,
    EmpresaComponent,
    UsuarioComponent,
    ValorConcessionariaComponent,
    AnaliseViabilidadeComponent,
    FornecedorComponent,
    ContratoComponent,
    RelatorioEconomiaComponent,
    AlterarSenhaComponent,
    CustomDeleteConfirmationComponent,
    MenuSistemaComponent,
    CheckboxComponent,
    RadioButtonComponent,
    MedicaoComponent,
    SelectPeriodoComponent,
    PontoMedicaoComponent,
    AgenteMedicaoComponent,
    ContatoComponent,
    SelectStatusComponent,
    ValorAnualComponent,
    ValorMensalComponent,
    HistoricoMedicaoComponent,
    EnvioEmailComponent,
    ListaContatoComponent,
    AlertComponent,
    ChartjsBarComponent,
    RelatorioMedicaoComponent,
    ValidacaoMedicaoComponent,
    GrupoEmpresaComponent,
    DateFilterComponent,
    TarifaAplicacaoComponent,
    DateInputComponent,
    MenuUsuarioComponent,
    BandeiraTarifariaComponent,
    ImpostoConcessionariaComponent,
    FaturamentoCoenelComponent,
    SalarioMinimoComponent,
    AutoCompleteComponent,
    BandeiraTarifariaVigenteComponent,
    DeleteActionLinkComponent,
    FaturaEnergiaComponent,
    GhostComponent
  ],
  providers: [DecimalPipe, CurrencyPipe, CapitalizePipe, DecimalPipe, RelatorioMedicaoPdfService, AlertService]
})
export class PagesModule {
}
