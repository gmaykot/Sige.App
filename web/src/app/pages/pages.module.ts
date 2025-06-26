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
import { RelatorioEconomiaPdfService } from './geral/relatorio-economia/relatorio-economia-pdf.service';
import { MoedaParentesesPipe } from '../@core/pipe/moeda-parenteses.pipe';
import { EnergiaAcumuladaComponent } from './gerencial/energia-acumulada/energia-acumulada.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { AcompanhamentoEmailComponent } from './administrativo/acompanhamento-email/acompanhamento-email.component';
import { IntegracaoCceeComponent } from './administrativo/integracao-ccee/integracao-ccee.component';
import { SharedModule } from '../@shared/shared.module';
import { GerenciamentoMensalComponent } from './geral/gerenciamento-mensal/gerenciamento-mensal.component';
import { ValorMensalPontoMedicaoComponent } from './geral/valor-mensal-ponto-medicao/valor-mensal-ponto-medicao.component';

@NgModule({
  imports: [
    ChartModule,
    CommonModule,
    DashboardModule,
    MatTableModule,
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbAutocompleteModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbMenuModule,
    NbProgressBarModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbStepperModule,
    NbTabsetModule,
    NbToggleModule,
    NbTooltipModule,
    NbTreeGridModule,
    NbUserModule,
    Ng2SmartTableModule,
    NgxEchartsModule,
    ReactiveFormsModule,
    ThemeModule,
    PagesRoutingModule,
    SharedModule,
    // Módulos com .forRoot()
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot(),
    NbWindowModule.forRoot(),
    NgxMaskModule.forRoot()

  ],
  declarations: [
    AgenteMedicaoComponent,
    AlterarSenhaComponent,
    AnaliseViabilidadeComponent,
    AlertComponent,
    AutoCompleteComponent,
    BandeiraTarifariaComponent,
    BandeiraTarifariaVigenteComponent,
    ChartjsBarComponent,
    CheckboxComponent,
    ConcessionariaComponent,
    ContatoComponent,
    ContratoComponent,
    CustomDeleteConfirmationComponent,
    DateFilterComponent,
    DateInputComponent,
    DeleteActionLinkComponent,
    EmpresaComponent,
    EnvioEmailComponent,
    EnergiaAcumuladaComponent,
    FaturaEnergiaComponent,
    FaturamentoCoenelComponent,
    FornecedorComponent,
    GhostComponent,
    GrupoEmpresaComponent,
    HistoricoMedicaoComponent,
    ImpostoConcessionariaComponent,
    ListaContatoComponent,
    MedicaoComponent,
    MenuSistemaComponent,
    MenuUsuarioComponent,
    MoedaParentesesPipe,
    PagesComponent,
    PontoMedicaoComponent,
    RadioButtonComponent,
    RelatorioEconomiaComponent,
    RelatorioMedicaoComponent,
    SalarioMinimoComponent,
    SelectPeriodoComponent,
    SelectStatusComponent,
    TarifaAplicacaoComponent,
    UsuarioComponent,
    ValidacaoMedicaoComponent,
    ValorAnualComponent,
    ValorConcessionariaComponent,
    ValorMensalComponent,
    AcompanhamentoEmailComponent,
    IntegracaoCceeComponent,
    GerenciamentoMensalComponent,
    ValorMensalPontoMedicaoComponent
  ],
  providers: [
    AlertService,
    CapitalizePipe,
    CurrencyPipe,
    DecimalPipe,
    RelatorioEconomiaPdfService,
    RelatorioMedicaoPdfService,
  ]
})
export class PagesModule {
}
