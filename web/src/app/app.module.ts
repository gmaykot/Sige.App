/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
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
  NbListModule
} from '@nebular/theme';
import { registerLocaleData } from '@angular/common';

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

