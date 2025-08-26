import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe, DecimalPipe } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Angular and Third-party modules
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NgxMaskModule } from "ngx-mask";
import { NgxEchartsModule } from "ngx-echarts";
import { MatTableModule } from "@angular/material/table";
import { ChartModule } from "angular2-chartjs";

// Nebular modules
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
} from "@nebular/theme";

// Shared components
import { AjudaOperacaoComponent } from "./custom-component/ajuda-operacao/ajuda-operacao.component";
import { AgenteMedicaoComponent } from "./custom-component/agente-medicao.component";
import { AlertComponent } from "./custom-component/alert-component/alert-component";
import { AutoCompleteComponent } from "./custom-component/auto-complete/auto-complete.component";
import { BandeiraTarifariaVigenteComponent } from "./custom-component/bandeira-tarifaria-vigente/bandeira-tarifaria-vigente.component";
import { ChartjsBarComponent } from "./charts/chartjs-bar.component";
import { EchartsBarComponent } from "./charts/echarts-bar.component";
import { EchartsPieComponent } from "./charts/echarts-pie.component";
import { CheckboxComponent } from "./custom-component/checkbox-component";
import { ContatoComponent } from "./custom-component/contato.component";
import { ListaContatoComponent } from "./custom-component/contato/contato.subcomponent";
import { CustomDeleteConfirmationComponent } from "./custom-component/custom-delete-confirmation.component";
import { CustomRegistrationComponent } from "./custom-component/custom-registration/custom-registration.component";
import { DateInputComponent } from "./custom-component/date-input/date-input.component";
import { DeleteActionLinkComponent } from "./custom-component/delete-action-link/delete-action-link.component";
import { EditMedicaoComponent } from "./custom-component/edit-medicao/edit-medicao.component";
import { EnvioEmailComponent } from "./custom-component/envio-email/envio-email.component";
import { DateFilterComponent } from "./custom-component/filters/date-filter.component";
import { GrupoEmpresaComponent } from "./custom-component/grupo-empresa.component";
import { HistoricoMedicaoComponent } from "./custom-component/historico-medicao.component";
import { ImpostoConcessionariaComponent } from "./custom-component/imposto-concessionaria/imposto-concessionaria.component";
import { MedicaoCurtoPrazoComponent } from "./custom-component/medicao-curto-prazo/medicao-curto-prazo.component";
import { PontoMedicaoComponent } from "./custom-component/ponto-medicao.component";
import { RadioButtonComponent } from "./custom-component/radiobutton-component";
import { SelectPeriodoComponent } from "./custom-component/select-periodo.component";
import { SelectStatusComponent } from "./custom-component/select-status.component";
import { TableHeaderComponent } from "./custom-component/table-header/table-header.component";
import { ValidacaoMedicaoComponent } from "./custom-component/validacao-medicao/validacao-medicao/validacao-medicao.component";
import { ValorAnualComponent } from "./custom-component/valor-anual.component";
import { ValorMensalComponent } from "./custom-component/valor-mensal.component";

// Pipes and Services
import { ThemeModule } from "../@theme/theme.module";
import { MoedaParentesesPipe } from "../@core/pipe/moeda-parenteses.pipe";
import { AlertService } from "../@core/services/util/alert.service";
import { CapitalizePipe } from "../@theme/pipes";
import { RelatorioMedicaoPdfService } from "../pages/geral/relatorio-medicao/relatorio-medicao-pdf.service";
import { StatusIconComponent } from "./custom-component/status-icon/status-icon.component";
import { ChartRendererComponent } from "./charts/chart-renderer.component";
import { NumberEditorComponent } from "./custom-component/number-editor.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,

    Ng2SmartTableModule,
    NgxMaskModule.forRoot(),
    NgxEchartsModule,
    MatTableModule,
    ChartModule,

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
    AjudaOperacaoComponent,
    AgenteMedicaoComponent,
    AlertComponent,
    AutoCompleteComponent,
    BandeiraTarifariaVigenteComponent,
    ChartjsBarComponent,
    EchartsBarComponent,
    EchartsPieComponent,
    CheckboxComponent,
    ContatoComponent,
    ListaContatoComponent,
    CustomDeleteConfirmationComponent,
    CustomRegistrationComponent,
    DateInputComponent,
    DeleteActionLinkComponent,
    EditMedicaoComponent,
    EnvioEmailComponent,
    DateFilterComponent,
    GrupoEmpresaComponent,
    HistoricoMedicaoComponent,
    ImpostoConcessionariaComponent,
    MedicaoCurtoPrazoComponent,
    PontoMedicaoComponent,
    RadioButtonComponent,
    SelectPeriodoComponent,
    SelectStatusComponent,
    TableHeaderComponent,
    ValidacaoMedicaoComponent,
    ValorAnualComponent,
    ValorMensalComponent,
    MoedaParentesesPipe,
    StatusIconComponent,
    ChartRendererComponent,
    NumberEditorComponent,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,

    Ng2SmartTableModule,
    NgxMaskModule,
    NgxEchartsModule,
    MatTableModule,
    ChartModule,

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

    AjudaOperacaoComponent,
    CustomRegistrationComponent,
    TableHeaderComponent,
    MoedaParentesesPipe,
    EchartsPieComponent,
    EchartsBarComponent,
    ChartjsBarComponent,
    AutoCompleteComponent,
    StatusIconComponent,
    ListaContatoComponent,
    ChartRendererComponent,
    NumberEditorComponent,
  ],
  entryComponents: [StatusIconComponent],
  providers: [
    DecimalPipe,
    CurrencyPipe,
    CapitalizePipe,
    RelatorioMedicaoPdfService,
    AlertService,
    MoedaParentesesPipe,
  ],
})
export class SharedModule {}
