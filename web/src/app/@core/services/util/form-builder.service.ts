import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EnergiaAcumuladaControl } from '../../../pages/gerencial/energia-acumulada/energia-acumulada.service';
import { TarifaAplicacaoControl } from '../../../pages/gerencial/tarifa-aplicacao/tarifa-aplicacao.service';
import { SalarioMinimoControl } from '../../../pages/gerencial/salario-minimo/salario-minimo.service';

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

const defaultValuesMap: { [key: string]: DefaultValues<any> } = {  
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
  },
  EnergiaAcumulada: EnergiaAcumuladaControl,
  TarifaAplicacao: TarifaAplicacaoControl,
  SalarioMinimo: SalarioMinimoControl
};