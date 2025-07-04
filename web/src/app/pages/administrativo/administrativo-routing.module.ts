import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsuarioComponent } from './usuario/usuario.component';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';
import { MenuSistemaComponent } from './menu-sistema/menu-sistema.component';
import { GhostComponent } from './ghost/ghost.component';
import { AcompanhamentoEmailComponent } from './acompanhamento-email/acompanhamento-email.component';
import { IntegracaoCceeComponent } from './integracao-ccee/integracao-ccee.component';
import { SAGuard } from '../../@core/guards/SAGuard';

const routes: Routes = [
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'alterar-senha', component: AlterarSenhaComponent },
  { path: 'menu-sistema', component: MenuSistemaComponent, canActivate: [SAGuard] },
  { path: 'ghost', component: GhostComponent, canActivate: [SAGuard] },
  { path: 'acompanhamento-email', component: AcompanhamentoEmailComponent, canActivate: [SAGuard] },
  { path: 'integracao-ccee', component: IntegracaoCceeComponent, canActivate: [SAGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativoRoutingModule {}
