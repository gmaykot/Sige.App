// 📁 src/app/@shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxMaskModule } from 'ngx-mask';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatTableModule } from '@angular/material/table';
import { ChartModule } from 'angular2-chartjs';

import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonGroupModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbDialogModule,
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
  NbToastrModule,
  NbToggleModule,
  NbTooltipModule,
  NbTreeGridModule,
  NbUserModule,
  NbWindowModule,
} from '@nebular/theme';

// Components and Pipes
import { TableHeaderComponent } from './custom-component/table-header/table-header.component';
import { CustomRegistrationComponent } from './custom-component/custom-registration/custom-registration.component';
import { AjudaOperacaoComponent } from './custom-component/ajuda-operacao/ajuda-operacao.component';
import { ValidacaoMedicaoComponent } from './custom-component/validacao-medicao/validacao-medicao/validacao-medicao.component';
import { MoedaParentesesPipe } from '../@core/pipe/moeda-parenteses.pipe';
import { AgenteMedicaoComponent } from './custom-component/agente-medicao.component';
import { AlertComponent } from './custom-component/alert-component/alert-component';
import { AutoCompleteComponent } from './custom-component/auto-complete/auto-complete.component';
import { BandeiraTarifariaVigenteComponent } from './custom-component/bandeira-tarifaria-vigente/bandeira-tarifaria-vigente.component';
import { CheckboxComponent } from './custom-component/checkbox-component';
import { ContatoComponent } from './custom-component/contato.component';
import { ListaContatoComponent } from './custom-component/contato/contato.subcomponent';
import { CustomDeleteConfirmationComponent } from './custom-component/custom-delete-confirmation.component';
import { DateInputComponent } from './custom-component/date-input/date-input.component';
import { DeleteActionLinkComponent } from './custom-component/delete-action-link/delete-action-link.component';
import { EditMedicaoComponent } from './custom-component/edit-medicao/edit-medicao.component';
import { EnvioEmailComponent } from './custom-component/envio-email/envio-email.component';
import { DateFilterComponent } from './custom-component/filters/date-filter.component';
import { GrupoEmpresaComponent } from './custom-component/grupo-empresa.component';
import { HistoricoMedicaoComponent } from './custom-component/historico-medicao.component';
import { ImpostoConcessionariaComponent } from './custom-component/imposto-concessionaria/imposto-concessionaria.component';
import { MedicaoCurtoPrazoComponent } from './custom-component/medicao-curto-prazo/medicao-curto-prazo.component';
import { PontoMedicaoComponent } from './custom-component/ponto-medicao.component';
import { RadioButtonComponent } from './custom-component/radiobutton-component';
import { SelectPeriodoComponent } from './custom-component/select-periodo.component';
import { SelectStatusComponent } from './custom-component/select-status.component';
import { ValorAnualComponent } from './custom-component/valor-anual.component';
import { ValorMensalComponent } from './custom-component/valor-mensal.component';
import { ChartjsBarComponent } from './charts/chartjs-bar.component';
import { ThemeModule } from '../@theme/theme.module';

@NgModule({
  imports: [
    // Angular core modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,

    // Third-party modules
    Ng2SmartTableModule,
    NgxMaskModule.forRoot(),
    NgxEchartsModule,
    MatTableModule,
    ChartModule,

    // Nebular modules
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbAutocompleteModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
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
    NbToastrModule.forRoot(),
    NbToggleModule,
    NbTooltipModule,
    NbTreeGridModule,
    NbUserModule,
    NbWindowModule.forRoot(),
  ],
  declarations: [
    // Shared components
    AjudaOperacaoComponent,
    AgenteMedicaoComponent,
    AlertComponent,
    AutoCompleteComponent,
    BandeiraTarifariaVigenteComponent,
    ChartjsBarComponent,
    CheckboxComponent,
    ContatoComponent,
    CustomDeleteConfirmationComponent,
    CustomRegistrationComponent,
    DateFilterComponent,
    DateInputComponent,
    DeleteActionLinkComponent,
    EditMedicaoComponent,
    EnvioEmailComponent,    
    GrupoEmpresaComponent,
    HistoricoMedicaoComponent,
    ImpostoConcessionariaComponent,
    ListaContatoComponent,
    MedicaoCurtoPrazoComponent,
    MoedaParentesesPipe,
    PontoMedicaoComponent,
    RadioButtonComponent,
    SelectPeriodoComponent,
    SelectStatusComponent,
    TableHeaderComponent,
    ValidacaoMedicaoComponent,
    ValorAnualComponent,
    ValorMensalComponent,
  ],
  exports: [
    // Angular core modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,

    // Third-party modules
    Ng2SmartTableModule,
    NgxMaskModule,
    NgxEchartsModule,
    MatTableModule,
    ChartModule,

    // Nebular modules
    NbAccordionModule,
    NbActionsModule,
    NbAlertModule,
    NbAutocompleteModule,
    NbButtonGroupModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbDialogModule,
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
    NbToastrModule,
    NbToggleModule,
    NbTooltipModule,
    NbTreeGridModule,
    NbUserModule,
    NbWindowModule,

    // Shared components
    AjudaOperacaoComponent,
    CustomRegistrationComponent,
    TableHeaderComponent,
  ],
})
export class SharedModule {}
