import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { NgxLoginComponent } from './@core/pages/login/login.component';
import { LoginGuard } from './@core/guards/LoginGuard';

export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesdModule),
  },
  {
    path: 'gerencial',
    loadChildren: () => import('./pages/gerencial/gerencial.module').then(m => m.GerencialModule),
  },
  {
    path: 'geral',
    loadChildren: () => import('./pages/geral/geral.module').then(m => m.GeralModule),
  },
  {
    path: 'administrativo',
    loadChildren: () => import('./pages/administrativo/administrativo.module').then(m => m.AdministrativoModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    canActivate: [LoginGuard],
    children: [
      { path: '', component: NgxLoginComponent },
      { path: 'login', component: NbLoginComponent },
      { path: 'register', component: NbRegisterComponent },
      { path: 'logout', component: NbLogoutComponent },
      { path: 'request-password', component: NbRequestPasswordComponent },
      { path: 'reset-password', component: NbResetPasswordComponent },
    ],
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
