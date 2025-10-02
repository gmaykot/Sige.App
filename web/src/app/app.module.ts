import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { SharedModule } from './@shared/shared.module';

import {
  NbSidebarModule,
  NbMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbButtonModule,
  NbActionsModule,
  NbCardModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxMaskModule } from 'ngx-mask';
import { AuthInterceptor } from './@core/guards/auth-interceptos';

registerLocaleData(localePt);

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        // Infraestrutura e tema
        CoreModule.forRoot(),
        ThemeModule.forRoot(),
        SharedModule,
        // Bibliotecas externas e Nebular
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbDatepickerModule.forRoot(),
        NbDialogModule.forRoot(),
        NbActionsModule,
        NbButtonModule,
        NbCardModule,
        NbSpinnerModule,
        Ng2SmartTableModule,
        NgxMaskModule.forRoot()], providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}