import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  constructor(private fb: FormBuilder) { }

  // Método genérico que cria o FormGroup baseado no nome da interface
  createFormGroup<T>(typeName: string): FormGroup {
    const formGroup: any = {};

    // Obtém os valores padrões com base no nome da interface
    const defaultValues = defaultValuesMap[typeName];

    if (!defaultValues) {
      throw new Error(`Valores padrão para o tipo ${typeName} não foram encontrados.`);
    }

    // Cria os FormControls automaticamente
    Object.keys(defaultValues).forEach((key) => {
      formGroup[key] = new FormControl(defaultValues[key][0], defaultValues[key][1]);
    });
    return this.fb.group(formGroup);
  }

  createFormGroupObject<T>(typeName: string, defaults: T): FormGroup {
    const formGroup: any = {};

    // Obtém os valores padrões com base no nome da interface
    const defaultValues = defaultValuesMap[typeName];
    if (!defaultValues) {
      throw new Error(`Valores padrão para o tipo ${typeName} não foram encontrados.`);
    }
    Object.keys(defaultValues).forEach(key => {
      formGroup[key] = new FormControl(defaults[key], defaultValues[key][1]);
    });

    return this.fb.group(formGroup);
  }
}

type DefaultValues<T> = {
  [K in keyof T]: any;
};

const defaultValuesMap: { [key: string]: DefaultValues<any> } = {
  TarifaAplicacao: {
    id: ['', null],
    descConcessionaria: ['', null],
    concessionariaId: ['', [Validators.required]],
    numeroResolucao: ['', [Validators.required]],
    subGrupo: [0, [Validators.required]],
    segmento: [0, [Validators.required]],
    dataUltimoReajuste: [null, [Validators.required]],
    kwPonta: [0, [Validators.required]],
    kwForaPonta: [0, [Validators.required]],
    kWhPontaTUSD: [0, [Validators.required]],
    kWhForaPontaTUSD: [0, [Validators.required]],
    kWhPontaTE: [0, [Validators.required]],
    kWhForaPontaTE: [0, [Validators.required]],
    reatKWhPFTE: [0, [Validators.required]],
    ativo: [true, [Validators.required]]
  },
  Usuario: {
    id: ['', null],
    nome: ['', [Validators.required]],
    apelido: ['', [Validators.required]],
    email: ['', [Validators.required]],
    tipoPerfil: ['', [Validators.required]],
    senha: ['', [Validators.required]],
    contraSenha: ['', [Validators.required]],
    menusUsuario: [[], null],
    ativo: [true, null],
  },
  Concessionaria: {
    id: ['', null],
    gestorId: ['', null],
    nome: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    ativo: [true, null]
  },
  ImpostoConcessionaria: {
    id: ['', null],
    concessionariaId: ['', null],
    descConcessionaria: ['', null],
    mesReferencia: ['', [Validators.required]],
    valorPis: [0, [Validators.required]],
    valorCofins: [0, [Validators.required]],
    ativo: [true, null]
  },
  FaturamentoCoenel: {
    id: ['', null],
    descEmpresa: ['', null],
    pontoMedicaoId: ['', [Validators.required]],
    descPontoMedicao: ['', null],
    vigenciaInicial: ['', [Validators.required]],
    vigenciaFinal: ['', null],
    valorFixo: [0, [Validators.required]],
    qtdeSalarios: [0, [Validators.required]],
    porcentagem: [0, [Validators.required]],
    ativo: [true, null]
  },
  SalarioMinimo: {
    id: ['', null],
    vigenciaInicial: ['', [Validators.required]],
    vigenciaFinal: ['', null],
    valor: [0, [Validators.required]],
    ativo: [true, null]
  },
  BandeiraTarifariaVigente: {
    id: ['', null],
    bandeiraTarifariaId: ['', [Validators.required]],
    mesReferencia: ['', [Validators.required]],
    bandeira: [0, [Validators.required]],
    ativo: [true, null]
  },
  LancamentosMensais: {
    id: ['', null],
    pontoMedicaoId: ['', [Validators.required]],
    ativo: [true, null]
  }
};