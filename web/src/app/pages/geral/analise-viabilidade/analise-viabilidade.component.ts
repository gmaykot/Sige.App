import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormBuilder } from '@angular/forms';
import { IConcessionaria } from '../../../@core/data/concessionarias';
import { ConcessionariaService } from '../../../@core/services/gerencial/concessionaria.service';
import { IResponseInterface } from '../../../@core/data/response.interface';
import { IEmpresa } from '../../../@core/data/empresa';
import { EmpresaService } from '../../../@core/services/gerencial/empresa.service';
import { settingsAnaliseViabilidade, settingsAnaliseViabilidadeResponse } from '../../../@shared/table-config/analise.viabilidade.config';
import { LocalDataSource } from 'ng2-smart-table';
import { IFaturaEnergia } from '../../../@core/data/fatura.energia';
import { MockFatura } from '../../../@core/mock/mock-fatura-energia';
import { IAnaliseViabilidade } from '../../../@core/data/analise-viabilidade';
import { AnailseViabilidadeService } from '../../../@core/services/geral/analise-viabilidade.service';

@Component({
  selector: 'ngx-analise-viabilidade',
  templateUrl: './analise-viabilidade.component.html',
  styleUrls: ['./analise-viabilidade.component.scss']
})
export class AnaliseViabilidadeComponent implements OnInit{
  concessionarias?: IConcessionaria[];
  faturasEnergia?: IFaturaEnergia[] = [];
  empresas?: IEmpresa[];
  settings = settingsAnaliseViabilidade;
  settingsResponseAzul = settingsAnaliseViabilidadeResponse;
  settingsResponseVerde = settingsAnaliseViabilidadeResponse;
  source: LocalDataSource = new LocalDataSource();
  sourceResponseAzul: LocalDataSource = new LocalDataSource();
  sourceResponseVerde: LocalDataSource = new LocalDataSource();
  response: any[];
  public passo1 = this.formBuilder.group({
    id: '',
    clienteId: '08dc0c82-a098-4a41-812f-7097e7f2de4a',
    concessionariaId: '08dbf64e-6ad3-4033-85d1-29b31d4dea85',
    tipoThs: '',
    tipoConexao: '1',
  });

  public passo2 = this.formBuilder.group({
    pchKWhFornecedorZero: 0.13,
    pchKWhFornecedorCinquenta: 0.18,
    pchKWhFornecedorCem: 0.30,
    encConexao: 50,
    essEncServicoSist: 500,
    demPta: 0,
    demFPta: 0,
    kWhPta: 0,
    kWhFPta: 0,
  });
  
  constructor(private formBuilder: FormBuilder, private concessionariaService: ConcessionariaService, private empresaService: EmpresaService, private analiseViabilidadeService: AnailseViabilidadeService) {
  }

  async ngOnInit() {
    await this.getConcessionarias(); 
    await this.getEmpresas();
    this.iniciaTabela();
  }
  
  async getEmpresas()
  {
    await this.empresaService.get()
    .then( (response: IResponseInterface<IEmpresa[]>) =>
    {
      this.empresas = response.data;
    });   
  }

  iniciaTabela()
  {
    this.faturasEnergia = MockFatura;
    this.source.load(this.faturasEnergia);
    let media = this.faturasEnergia.find(fat => fat.id === 1);
    this.passo2.controls.demPta.setValue(media.demandaPta);
    this.passo2.controls.demFPta.setValue(media.demandaFpta);
    this.passo2.controls.kWhPta.setValue(media.kwhPta);
    this.passo2.controls.kWhFPta.setValue(media.kwhFpta);
  }

  async getConcessionarias()
  {
    await this.concessionariaService.get()
    .then( (response: IResponseInterface<IConcessionaria[]>) =>
    {
      this.concessionarias = response.data;
    });   
  }
  onSelect(event): void {
  }

  onCreate(event): void {
    let val = (event.newData as IFaturaEnergia);
    event.confirm.resolve();
    let total = this.faturasEnergia.find(fat => fat.id === 0);
    let media = this.faturasEnergia.find(fat => fat.id === 1);
    total.kwhFpta += Number(val.kwhFpta);
    media.kwhFpta = total.kwhFpta/(this.faturasEnergia.length-1);
  }

  async onClickAnalisar(): Promise<void> {
    
    var analise: IAnaliseViabilidade = {
      clienteId: this.passo1.controls.clienteId.value,
      concessionariaId: this.passo1.controls.concessionariaId.value,
      pchKWhFornecedorZero: this.passo2.controls.pchKWhFornecedorZero.value,
      pchKWhFornecedorCinquenta: this.passo2.controls.pchKWhFornecedorCinquenta.value,
      pchKWhFornecedorCem: this.passo2.controls.pchKWhFornecedorCem.value,
      encConexao: this.passo2.controls.encConexao.value,
      essEncServicoSist: this.passo2.controls.essEncServicoSist.value,
      demPta: this.passo2.controls.demPta.value,
      demFPta: this.passo2.controls.demFPta.value,
      kWhPta: this.passo2.controls.kWhPta.value,
      kWhFPta: this.passo2.controls.kWhFPta.value
    };
    await this.analiseViabilidadeService.post(analise)
    .then( (response: any) =>
    {
      var data: IAnaliseViabilidade[] = response.data;
      this.sourceResponseAzul.load(data.filter(d => d.tipoSegmento.indexOf('Azul') > 0));
      this.sourceResponseVerde.load(data.filter(d => d.tipoSegmento.indexOf('Verde') > 0));
    });  
  }
}
