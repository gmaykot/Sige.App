import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AlertService } from '../../../@core/services/util/alert.service';
import { SessionStorageService } from '../../../@core/services/util/session-storage.service';
import { UsuarioService } from '../../../@core/services/administrativo/usuario.service';
import { IUsuarioSenha, Usuario } from '../../../@core/data/usuario';
import { IResponseInterface } from '../../../@core/data/response.interface';

@Component({
  selector: 'ngx-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit{
  public habilitaOperacoes: boolean = false;
  public loading = false;
  public control = this.formBuilder.group({
    id: "",
    senhaAntiga: ["", Validators.required],
    novaSenha: ["", Validators.required],
    novaSenhaRepetir: ["", Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private usuarioService: UsuarioService
  ) 
  {    
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
  }
  
  ngOnInit(): void {
  }

  limparFormulario(): void {
    this.control.reset();
  }

  private getUsuarioSenha(): IUsuarioSenha {
    var usuario = this.control.value as IUsuarioSenha;
    usuario.id = SessionStorageService.getUsuarioId();
    return usuario;
  }

  async onSubmit(){
    var usuarioSenha = this.getUsuarioSenha();
    if (this.control.value.novaSenha === this.control.value.novaSenhaRepetir)
    {
      await this.usuarioService.alterarSenha(usuarioSenha).then(async (res: IResponseInterface<any>) =>
      {
        if (res.success){
          this.limparFormulario();
          this.alertService.showSuccess("Senha alterada com sucesso!"); 
        } else 
        {
          res.errors.map((x) => this.alertService.showError(x.value));
        }
      }).catch((res) => {
        this.alertService.showError("Não foi possível alterar a senha.");
      });
    } else {
      this.alertService.showError("As senhas não conferem, favor rever os campos 'Nova Senha' e 'Repetir Senha'.");
    }
  }
}
