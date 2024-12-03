import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';
import { NgxMaskModule } from 'ngx-mask';

registerLocaleData(localePt);

import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbButtonModule,
} from '@nebular/theme';
import { registerLocaleData } from '@angular/common';
import { BandeiraTarifariaVigenteComponent } from './@shared/custom-component/bandeira-tarifaria-vigente/bandeira-tarifaria-vigente.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(), 
    NbDialogModule.forRoot(),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NbButtonModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    {
    provide: LOCALE_ID,
    useValue: 'pt-BR',
    },
    {
    provide: DEFAULT_CURRENCY_CODE,
    useValue: 'BRL',
    },
],
  bootstrap: [AppComponent],
})
export class AppModule {
}

