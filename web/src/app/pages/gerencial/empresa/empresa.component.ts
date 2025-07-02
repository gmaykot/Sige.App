import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { FormBuilder, Validators } from "@angular/forms";
import { UF } from "../../../@core/data/estados";
import { EmpresaService } from "../../../@core/services/gerencial/empresa.service";
import { IEmpresa } from "../../../@core/data/empresa";
import { IResponseInterface } from "../../../@core/data/response.interface";
import { NbDialogService, NbIconConfig, NbLayoutScrollService, NbTabsetComponent } from "@nebular/theme";
import { CustomDeleteConfirmationComponent } from "../../../@shared/custom-component/custom-delete-confirmation.component";
import { IAgenteMedicao } from "../../../@core/data/agente-medicao";
import { IPontoMedicao } from "../../../@core/data/ponto-medicao";
import { AgenteMedicaoComponent } from "../../../@shared/custom-component/agente-medicao.component";
import { PontoMedicaoComponent } from "../../../@shared/custom-component/ponto-medicao.component";
import { MedicaoService } from "../../../@core/services/geral/medicao.service";
import { AgenteMedicaoService } from "../../../@core/services/gerencial/agente-medicao.service";
import { PontoMedicaoService } from "../../../@core/services/gerencial/ponto-medicao.service";
import { EmpresaConfigSettings } from "./empresa.config.settings";
import { IContato } from "../../../@core/data/contato";
import { ContatoComponent } from "../../../@shared/custom-component/contato.component";
import { ContatoService } from "../../../@core/services/gerencial/contato.service";
import { CepService } from "../../../@core/services/util/cep.service";
import { ICep } from "../../../@core/data/cep";
import { AlertService } from "../../../@core/services/util/alert.service";
import { IDropDown } from "../../../@core/data/drop-down";
import { SessionStorageService } from "../../../@core/services/util/session-storage.service";
import { ConcessionariaService } from "../../../@core/services/gerencial/concessionaria.service";
import { ETipoErroResponse } from "../../../@core/enum/tipo-erro-response";

@Component({
  selector: "ngx-empresa",
  templateUrl: "./empresa.component.html",
  styleUrls: ["./empresa.component.scss"],
})
export class EmpresaComponent extends EmpresaConfigSettings implements OnInit{
  @ViewChild('tabset') tabset: NbTabsetComponent;

  disabledIconConfig: NbIconConfig = { icon: 'trash-2-outline', pack: 'eva' };
  cceeIconConfig: NbIconConfig = { icon: 'globe-2-outline', pack: 'eva' };
  agentes: Array<IAgenteMedicao> = [];
  pontos: Array<IPontoMedicao> = [];
  contatos = [];
  concessionarias = [];
  empresasMatriz: IDropDown[] = [];
  
  public loading = true;
  public edit = false;
  public selected = false;
  estados: any;
  cepSelected: any;
  public control = this.formBuilder.group({
    id: "",
    gestorId: "",
    empresaMatrizId: "",
    ativo: false,
    tipoFilial: false,
    cnpj: ["", Validators.required],
    inscricaoEstadual: "",
    nome: ["", Validators.required],
    nomeFantasia: ["", Validators.required],
    dadosCtaUc: "",
    fonteEnergia: "",
    logradouro: "",
    cidade: "",
    estado: ["", Validators.required],
    submercado: "",
    conexao: "",
    cep: "",
    bairro: "",
    responsavelGestor: "",
  });
  source: LocalDataSource = new LocalDataSource();
  sourceContato: LocalDataSource = new LocalDataSource();
  sourceAgenteMedicao: LocalDataSource = new LocalDataSource();
  sourcePontoMedicao: LocalDataSource = new LocalDataSource();
  public habilitaOperacoes: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private cepService: CepService,
    private dialogService: NbDialogService,
    private contatoService: ContatoService,
    private medicaoService: MedicaoService,
    private concessionariaService: ConcessionariaService,
    private agenteMedicaoService: AgenteMedicaoService,
    private pontoMedicaoService: PontoMedicaoService,
    private alertService: AlertService,
    private scroolService: NbLayoutScrollService
  ) {
    super();
    this.estados = UF;
  }
  async ngOnInit(): Promise<void> {
    this.habilitaOperacoes = SessionStorageService.habilitaOperacoes();
    await this.getConcessionarias();
    await this.getEmpresas();
  }
 
  public isFilial(){
    return this.control.value.tipoFilial;
  }

  async getConcessionarias() {
    this.loading = true;
    await this.concessionariaService
      .getDropDown()
      .then((response: IResponseInterface<IDropDown[]>) => {
        if (response.success) {
          this.concessionarias = response.data;
        }                
        this.loading = false;
      });
  }

  async getAgentesMedicao(empresaId){
    this.loading = true;
    await this.medicaoService
      .getAgentes(empresaId)
      .then((response: IResponseInterface<IAgenteMedicao[]>) => {
        this.agentes = response.data;
        this.sourceAgenteMedicao.load(response.data);
        this.getPontosMedicao(response.data);
      });
      this.loading = false;
  }
  
  getPontosMedicao(listaAgentes: IAgenteMedicao[]){
    this.pontos = [];
    listaAgentes.forEach(agente => agente.pontosMedicao.forEach(ponto => {
      ponto.agenteMedicao = agente.nome;
      this.pontos.push(ponto);
    }));    
    this.sourcePontoMedicao.load(this.pontos);
  }

  async getEmpresas() {
    this.loading = true;
    await this.empresaService
      .get()
      .then((response: IResponseInterface<IEmpresa[]>) => {
        if (response.success) {
          this.source.load(response.data);
          response.data.filter(e => e.empresaMatrizId == null || e.empresaMatrizId == '').map(e => this.empresasMatriz.push({ id: e.id, descricao: e.nomeFantasia}))
          //this.empresasMatriz = this.empresasMatriz.sort((a, b) => a.descricao.localeCompare(b.descricao));  
        } else {
          this.source.load([]);
        }
        this.loading = false;
      });      
  }

  private getEmpresa(): IEmpresa {
    const empresa = (this.control.value as IEmpresa);
    empresa.agentesMedicao = this.agentes;
    empresa.agentesMedicao.forEach(agente => {
      agente.pontosMedicao = this.pontos.filter(a => a.agenteMedicaoId == agente.id);
    });
    return empresa;
  }

  onSelectAgente(event): void {    
    this.agentesChecked[0] = event.data;
    this.onAgenteEdit();
  }

  onSelectPonto(event): void {    
    this.pontosChecked[0] = event.data;
    this.onPontoEdit();
  }

  onSelect(event): void {    
    this.limparFormulario();
    const emp = event.data as IEmpresa;
    this.cepSelected = emp.cep;
    this.control = this.formBuilder.group({
      id: emp.id,
      gestorId: emp.gestorId,
      empresaMatrizId: emp.empresaMatrizId,
      tipoFilial: emp.empresaMatrizId != null && emp.empresaMatrizId != '',
      ativo: emp.ativo,
      cnpj: emp.cnpj,
      inscricaoEstadual: emp.inscricaoEstadual,
      nome: emp.nome,
      nomeFantasia: emp.nomeFantasia,
      dadosCtaUc: emp.dadosCtaUc,
      fonteEnergia: emp.fonteEnergia,
      logradouro: emp.logradouro,
      cidade: emp.cidade,
      estado: emp.estado,
      submercado: emp.subMercado,
      conexao: emp.conexao,
      cep: emp.cep,
      bairro: emp.bairro,
      responsavelGestor: emp.responsavelGestor
    });
    this.getAgentesMedicao(emp.id);
    this.contatos = emp.contatos ? emp.contatos : [];
    this.sourceContato.load(this.contatos);
    this.scroolService.scrollTo(0,0);
    this.edit = true;
    this.selected = true;
  }

  async onCepSelect(): Promise<void> {
    if (this.cepSelected.length == 8)
    {
      await this.cepService.get(this.cepSelected).then((response: ICep) => {
        const emp = this.control.value as IEmpresa;
        this.control = this.formBuilder.group({
          id: emp.id,
          gestorId: emp.gestorId,
          empresaMatrizId: emp.empresaMatrizId,
          tipoFilial: emp.empresaMatrizId != null && emp.empresaMatrizId != '',
          ativo: emp.ativo,
          cnpj: emp.cnpj,
          inscricaoEstadual: emp.inscricaoEstadual,
          nome: emp.nome,
          nomeFantasia: emp.nomeFantasia,
          dadosCtaUc: emp.dadosCtaUc,
          fonteEnergia: emp.fonteEnergia,
          logradouro: response.logradouro,
          cidade: response.localidade,
          estado: response.uf,
          bairro: response.bairro,
          submercado: emp.subMercado,
          conexao: emp.conexao,
          cep: emp.cep,
          responsavelGestor: emp.responsavelGestor
        });
      });
    }
  }

  onClose(): void {
  }

  limparFormulario(): void {
    this.sourceAgenteMedicao = new LocalDataSource();
    this.sourcePontoMedicao = new LocalDataSource();
    this.sourceContato = new LocalDataSource();
    this.control.reset();
    this.edit = false;
    this.selected = false;
    this.cepSelected = '';
  }

  async onDeleteConfirm() {
    this.dialogService
      .open(CustomDeleteConfirmationComponent)
      .onClose.subscribe(async (excluir) => {
        if (excluir) {
          await this.empresaService.delete(this.getEmpresa().id).then(async (res: IResponseInterface<any>) => {
            if (res.success){
              this.limparFormulario();
              await this.getEmpresas();
              this.alertService.showSuccess("Empresa excluído com sucesso."); 
            } else 
            {
              res.errors.map((x) => this.alertService.showError(x.value));
            }
          }).catch((res) => {
            this.alertService.showError("Não foi possível excluir a empresa.");
          });
        }
      });
  }

  private async changeEmpresa() {
    const empresa = this.getEmpresa();
    if (empresa.id == null || empresa.id == "") {
      await this.post(empresa);
    } else {
      await this.put(empresa);
    }
    this.edit = true;
    this.selected = true;
  }

  private async post(empresa: IEmpresa) {
    empresa.agentesMedicao = [];
    await this.empresaService.post(empresa).then(async (res: IResponseInterface<IEmpresa>) =>
    {
      this.onSelect(res);
      await this.getEmpresas();
      this.alertService.showSuccess("Empresa cadastrada com sucesso."); 
    });
  }

  private async put(empresa: IEmpresa) {
    await this.empresaService.put(empresa).then();
    {
      await this.getEmpresas();
      
      this.alertService.showSuccess("Empresa alterada com sucesso."); 
    }
  }

  onSubmit(): void {
    if (this.control.valid) this.changeEmpresa();
    else this.alertService.showWarning("Os campos obrigatórios não foram preenchidos.");
  }

  async onAgenteConfirm() {
    const empresa = this.getEmpresa();
    this.dialogService
      .open(AgenteMedicaoComponent, {
        context: { agente: { empresaId: empresa.id  } as IAgenteMedicao },
      })
      .onClose.subscribe(async (agente) => {
        if (agente) {
          this.agenteMedicaoService.post(agente).then(async (res: IResponseInterface<IAgenteMedicao>) =>
          {
            agente.id = res.data.id
            this.agentes = this.agentes.filter(a => a.id != agente.id);
            this.agentes.push(agente);
            this.sourceAgenteMedicao.load(this.agentes);         
            this.alertService.showSuccess("Agente cadastrado com sucesso.");
          });
        }
      });
      this.agentesChecked =  [];
  }

  async onPontoConfirm() {
    this.dialogService
    .open(PontoMedicaoComponent, { context: { ponto: {} as IPontoMedicao, agentes: await this.sourceAgenteMedicao.getAll(), concessionarias: this.concessionarias } })
    .onClose.subscribe(async (ponto) => {
        if (ponto) {
          this.pontoMedicaoService.post(ponto).then(async (res: IResponseInterface<IPontoMedicao>) =>
          {
            ponto.id = res.data.id
            this.pontos.push(ponto);
            this.sourcePontoMedicao.load(this.pontos);             
            this.alertService.showSuccess("Ponto cadastrado com sucesso.");
          });
        }
      });
      this.pontosChecked = [];
  }
   
  async onAgenteEdit() {
    if(this.agentesChecked.length > 0){
      this.dialogService
      .open(AgenteMedicaoComponent, { context: { agente: this.agentesChecked[0]} })
      .onClose.subscribe(async (agenteEditado) => {
        if (agenteEditado) {   
          this.agenteMedicaoService.put(agenteEditado).then()
          const index = this.agentes.findIndex(p => p.id === agenteEditado.id);
          if (index !== -1) {
            this.agentes[index] = agenteEditado;
          } else {
            this.agentes.push(agenteEditado);
          }   
          this.sourceAgenteMedicao.load(this.agentes);          
          this.alertService.showSuccess("Agente alterado com sucesso.");
        }
      });
      this.agentesChecked =  [];
    }    
  }

  onEdit() {
    this.limparFormulario();
    this.edit = !this.edit;
  }

  async onPontoEdit() {
    if (this.pontosChecked.length > 0){
      this.dialogService
      .open(PontoMedicaoComponent, { context: { ponto: this.pontosChecked[0], agentes: await this.sourceAgenteMedicao.getAll(), concessionarias: this.concessionarias }, })
      .onClose.subscribe(async (pontoEditado) => {
        if (pontoEditado) {   
          await this.pontoMedicaoService.put(pontoEditado);
          const index = this.pontos.findIndex(p => p.id === pontoEditado.id);
          if (index !== -1) {
            this.pontos[index] = pontoEditado;
          } else {
            this.pontos.push(pontoEditado);
          }          
          this.sourcePontoMedicao.load(this.pontos);          
          this.alertService.showSuccess("Ponto alterado com sucesso.");
        }
      });
      this.pontosChecked = [];
    }
  } 

  async onAgenteDelete() {
    if (this.agentesChecked.length === 0) return;
  
    const confirm = await this.dialogService
      .open(CustomDeleteConfirmationComponent, {
        context: {
          mesage: `Deseja realmente excluir os ${this.agentesChecked.length} agentes de medição selecionados?`,
        },
      })
      .onClose.toPromise();
  
    if (!confirm) return;
  
    for (const agente of this.agentesChecked) {
      const res = await this.agenteMedicaoService.delete(agente.id);
  
      if (res.success) {
        this.removeAgenteDaLista(agente);
        this.alertService.showSuccess(`Agente ${agente.nome} excluído com sucesso.`);
      } else {
        const cascadeError = res.errors.find(
          (x) => x.key === ETipoErroResponse.DeleteCascadeError.toString()
        );
  
        if (cascadeError && SessionStorageService.isSuperUsuario()) {
          const confirmarExclusaoLogica = await this.dialogService
            .open(CustomDeleteConfirmationComponent, {
              context: {
                mesage: `ATENÇÃO!!! Deseja realmente excluir logicamente o registro? ${cascadeError.value}`,
              },
            })
            .onClose.toPromise();
  
          if (confirmarExclusaoLogica) {
            agente.dataExclusao = new Date().toISOString();
            const putRes = await this.agenteMedicaoService.put(agente);
  
            if (putRes.success) {
              this.removeAgenteDaLista(agente);
              this.alertService.showSuccess(`Agente ${agente.nome} excluído com sucesso.`);
            } else {
              putRes.errors.forEach((x) =>
                this.alertService.showError(`Agente ${agente.nome} - ${x.value}`)
              );
            }
          }
        } else {
          res.errors.forEach((x) =>
            this.alertService.showError(`Agente ${agente.nome} - ${x.value}`)
          );
        }
      }
    }
  }
  
  private removeAgenteDaLista(agente: IAgenteMedicao) {
    this.agentes = this.agentes.filter(a => a.id !== agente.id);
    this.sourceAgenteMedicao.load(this.agentes);
    this.agentesChecked = [];    
  }
  
  private removePontoDaLista(ponto: IPontoMedicao) {
    this.pontos = this.pontos.filter((a) => a.id !== ponto.id);
    this.sourcePontoMedicao.load(this.pontos);
    this.pontosChecked = [];
  }

  async onPontoDelete() {
    if (this.pontosChecked.length === 0) return;
  
    const confirm = await this.dialogService
      .open(CustomDeleteConfirmationComponent, {
        context: {
          mesage: `Deseja realmente excluir os ${this.pontosChecked.length} pontos de medição selecionados?`,
        },
      })
      .onClose.toPromise();
  
    if (!confirm) return;
  
    for (const ponto of this.pontosChecked) {
      const res = await this.pontoMedicaoService.delete(ponto.id);
  
      if (res.success) {
        this.removePontoDaLista(ponto);
        this.alertService.showSuccess(`Ponto ${ponto.nome} excluído com sucesso.`);
      } else {
        const cascadeError = res.errors.find(
          (x) => x.key === ETipoErroResponse.DeleteCascadeError.toString()
        );
  
        if (cascadeError && SessionStorageService.isSuperUsuario()) {
          const confirmarExclusaoLogica = await this.dialogService
            .open(CustomDeleteConfirmationComponent, {
              context: {
                mesage: `ATENÇÃO!!! Deseja realmente excluir logicamente o registro? ${cascadeError.value}`,
              },
            })
            .onClose.toPromise();
  
          if (confirmarExclusaoLogica) {
            ponto.dataExclusao = new Date().toISOString();
            const putRes = await this.pontoMedicaoService.put(ponto);
  
            if (putRes.success) {
              this.removePontoDaLista(ponto);
              this.alertService.showSuccess(`Ponto ${ponto.nome} excluído com sucesso.`);
            } else {
              putRes.errors.forEach((x) =>
                this.alertService.showError(`Ponto ${ponto.nome} - ${ponto.codigo}: ${x.value}`)
              );
            }
          }
        } else {
          res.errors.forEach((x) =>
            this.alertService.showError(`Ponto ${ponto.nome} - ${ponto.codigo}: ${x.value}`)
          );
        }
      }
    }    
  }
  

  onContatoConfirm(){
    const empresa = this.getEmpresa();
    this.dialogService
    .open(ContatoComponent, { context: { contato: { empresaId: empresa.id, fornecedorId: null } as IContato }, })
    .onClose.subscribe(async (contato) => {
      if (contato) {   
        await this.contatoService.post(contato).then(async (res: IResponseInterface<IContato>) =>
        {
          contato.id = res.data.id;
          this.contatos = this.contatos.filter(a => a.id != contato.id);
          this.contatos.push(contato);
          this.sourceContato.load(this.contatos);   
          this.alertService.showSuccess("Contato cadastrado com sucesso.");
          this.getEmpresas();
        });   
      }
    });
    this.contatosChecked = [];
  }

  onContatoEdit(){
    if (this.contatosChecked.length > 0){
      this.dialogService
      .open(ContatoComponent, { context: { contato: this.contatosChecked[0] }, })
      .onClose.subscribe(async (contato) => {
        if (contato) {   
          contato.empresaId = this.getEmpresa().id;
          contato.fornecedorId = null;
          await this.contatoService.put(contato).then()
          {
            this.contatos = this.contatos.filter(a => a.id != contato.id);
            this.contatos.push(contato);
            this.sourceContato.load(this.contatos);   
            this.alertService.showSuccess("Contato aterado com sucesso.");
            this.getEmpresas();
          }  
        }
      });
      this.contatosChecked = [];
    }
  }
  
  onContatoDelete(){
    if (this.contatosChecked.length > 0){
      this.dialogService
      .open(CustomDeleteConfirmationComponent, { context: { mesage: 'Deseja realmente excluir os contatos selecionados?'} })
      .onClose.subscribe(async (excluir) => {
        if (excluir){                    
          this.contatosChecked.forEach(async contato => {
            await this.contatoService.delete(contato.id).then()
            {              
              this.contatos = this.contatos.filter(a => a.id != contato.id);
              this.sourceContato.load(this.contatos);         
              this.contatosChecked = [];    
              this.getEmpresas(); 
            };            
          });
          this.alertService.showSuccess("Contatos excluídos com sucesso.");
        }
      });          
    }
  }
}
