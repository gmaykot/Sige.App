import { NgModule } from '@angular/core';
import { SharedModule } from '../@shared/shared.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PagesRoutingModule
  ],
  declarations: [
    PagesComponent
  ],
  exports: [
  ]
})
export class PagesdModule { }
