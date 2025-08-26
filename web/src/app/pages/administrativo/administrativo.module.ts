import { NgModule } from '@angular/core';
import { SharedModule } from '../../@shared/shared.module';

import { AdministrativoRoutingModule } from './administrativo-routing.module';
import { UsuarioComponent } from './usuario/usuario.component';
import { AlterarSenhaComponent } from './alterar-senha/alterar-senha.component';
import { MenuSistemaComponent } from './menu-sistema/menu-sistema.component';
import { GhostComponent } from './ghost/ghost.component';
import { AcompanhamentoEmailComponent } from './acompanhamento-email/acompanhamento-email.component';
import { IntegracaoCceeComponent } from './integracao-ccee/integracao-ccee.component';
import { MenuUsuarioComponent } from '../../@shared/custom-component/menu-usuario/menu-usuario.component';

@NgModule({
  declarations: [
    UsuarioComponent,
    AlterarSenhaComponent,
    MenuSistemaComponent,
    MenuUsuarioComponent,
    GhostComponent,
    AcompanhamentoEmailComponent,
    IntegracaoCceeComponent,
  ],
  imports: [
    SharedModule,
    AdministrativoRoutingModule,
  ],
})
export class AdministrativoModule {}