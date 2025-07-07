import { IAgenteMedicao } from "../../../@core/data/agente-medicao";
import { IContato } from "../../../@core/data/contato";
import { IPontoMedicao } from "../../../@core/data/ponto-medicao";
import { SEGMENTO, TIPO_CONEXAO } from "../../../@core/enum/status-contrato";
import { CheckboxComponent } from "../../../@shared/custom-component/checkbox-component";
import { settingsEmpresa } from "../../../@shared/table-config/empresa.config";

export class EmpresaConfigSettings {
    contatosChecked: Array<IContato> = [];
    agentesChecked: Array<IAgenteMedicao> = [];
    pontosChecked: Array<IPontoMedicao> = []; 
    settings = settingsEmpresa;

    settingsAgentes = {
    delete: {
      deleteButtonContent: '<i class="nb-edit"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: '',
        type: 'custom',
        width: '8px',
        class: 'checkbox',
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance)=>{
          instance.event.subscribe(row => {
            this.onCheckAgentes(row);
          });
        },
        filter: {
          width: '8px',
          type: 'custom',
          class: 'checkbox',
          component: CheckboxComponent
        }
      },
      nome: {
        title: "Nome",
        type: "string",
      },
      codigoAgente: {
        title: "Código Agente",
        type: "string",
      },
      codigoPerfilAgente: {
        title: "Código Perfil",
        type: "string",
      },
      ativo: {
        title: "Ativo",
        type: "string",
        valuePrepareFunction: (value) => { return value == true ? 'SIM' : 'NÃO'},
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
      columnTitle: "",
    },
    hideSubHeader: true,
    noDataMessage: 'Nenhum registro encontrado.'
  };

  settingsPontos = {
    delete: {
      deleteButtonContent: '<i class="nb-edit"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: '',
        type: 'custom',
        width: '8px',
        class: 'checkbox',
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance)=>{
          instance.event.subscribe(row => {
            this.onCheckPontos(row);
          });
        },
        filter: {
          width: '8px',
          type: 'custom',
          class: 'checkbox',
          component: CheckboxComponent
        }
      },
      nome: {
        title: "Nome",
        type: "string",
      },
      codigo: {
        title: "Código Ponto",
        type: "string",
      },
      agenteMedicao: {
        title: "Agente Medição",
        type: "string",
      },
      descConcessionaria: {
        title: "Concessionária",
        type: "string",
      },
      segmento: {
        title: "Segmento",
        type: "string",
        valuePrepareFunction: (value) => { return SEGMENTO.filter(a => a.id == value)[0].desc },
      },
      conexao: {
        title: "Conexão",
        type: "string",
        valuePrepareFunction: (value) => { return TIPO_CONEXAO.filter(a => a.id == value)[0].desc },
      },
      ativo: {
        title: "Ativo",
        type: "string",
        valuePrepareFunction: (value) => { return value == true ? 'SIM' : 'NÃO'},
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: "right",
      columnTitle: "",
    },
    hideSubHeader: true,
    noDataMessage: 'Nenhum registro encontrado.'
  };

  onCheckAgentes(data)
  {
    if (data.value) {
      this.agentesChecked.push(data.data);
    } else {
      this.agentesChecked = this.agentesChecked.filter(a => a.id != data.data.id);
    }
  }

  onCheckPontos(data)
  {
    if (data.value) {
      this.pontosChecked.push(data.data);
    } else {
      this.pontosChecked = this.pontosChecked.filter(a => a.id != data.data.id);
    }
  }

  settingsContato = {
    columns: {
      id: {
        title: "",
        type: "custom",
        width: "8px",
        class: "checkbox",
        renderComponent: CheckboxComponent,
        onComponentInitFunction: (instance) => {
          instance.event.subscribe((row) => {
            this.onCheckContato(row);
          });
        },
      },
      nome: {
        title: "Nome",
        type: "string",
      },
      telefone: {
        title: "Telefone",
        type: "string",
      },
      email: {
        title: "Email",
        type: "string",
      },
      cargo: {
        title: "Setor / Área",
        type: "string",
      }
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: "right",
    },
    hideSubHeader: true,
    noDataMessage: "Nenhum registro encontrado.",
  };

  onCheckContato(data) {
    if (data.value) {
      this.contatosChecked.push(data.data);
    } else {
      this.contatosChecked = this.contatosChecked.filter(
        (a) => a.id != data.data.id
      );
    }
  }
}