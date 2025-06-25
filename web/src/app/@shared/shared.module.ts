import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from './custom-component/table-header/table-header.component';
import { CustomRegistrationComponent } from './custom-component/custom-registration/custom-registration.component';
import { NbButtonGroupModule, NbButtonModule, NbCardModule } from '@nebular/theme';
import { NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbActionsModule } from '@nebular/theme';
import { AjudaOperacaoComponent } from './custom-component/ajuda-operacao/ajuda-operacao.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TableHeaderComponent, CustomRegistrationComponent, AjudaOperacaoComponent],
  imports: [CommonModule, NbCardModule, NbSpinnerModule, Ng2SmartTableModule, NbActionsModule, RouterModule, NbButtonGroupModule, NbButtonModule],
  exports: [TableHeaderComponent, CustomRegistrationComponent]
})
export class SharedModule {}
