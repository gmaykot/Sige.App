import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderComponent } from './custom-component/table-header/table-header.component';
import { CustomRegistrationComponent } from './custom-component/custom-registration/custom-registration.component';
import { NbCardModule } from '@nebular/theme';
import { NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbActionsModule } from '@nebular/theme';

@NgModule({
  declarations: [TableHeaderComponent, CustomRegistrationComponent],
  imports: [CommonModule, NbCardModule, NbSpinnerModule, Ng2SmartTableModule, NbActionsModule],
  exports: [TableHeaderComponent, CustomRegistrationComponent]
})
export class SharedModule {}
