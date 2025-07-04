import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { GeralGuard } from '../@core/guards/GeralGuard';
import { NotFoundComponent } from '../@core/pages/not-found/not-found.component';
import { UnauthorizedComponent } from '../@core/pages/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [GeralGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('./geral/geral-routing.module').then(m => m.GeralRoutingModule),
      },
      {
        path: '',
        loadChildren: () => import('./gerencial/gerencial-routing.module').then(m => m.GerencialRoutingModule),
      },
      {
        path: '',
        loadChildren: () => import('./administrativo/administrativo-routing.module').then(m => m.AdministrativoRoutingModule),
      },
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule),
      },
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}