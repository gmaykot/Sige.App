import { Injectable } from "@angular/core";
import { IRelatorioMedicao, IValoresMedicao, IFaturamentoMedicao, IValoresMedicaoAnalitico } from "../../data/relatorio-medicao";

@Injectable({ providedIn: "root" })
export class CalculoEconomiaService {
  private relatorio: IRelatorioMedicao;
  private consumoTotal: number = 0;
  private multiplicadorPerda: number = 1.03;

  public calcular(relatorio: IRelatorioMedicao) : IValoresMedicao
  {
    if (!relatorio)
      return null;

    this.relatorio = relatorio
    this.calculaConsumoTotal();
    var ret: IValoresMedicao = {
        valorProduto: this.calculaValorProduto(),
        faturarLongoPrazo: this.faturarLongoPrazo(),
        comprarCurtoPrazo: this.comprarCurtoPrazo(),
        venderCurtoPrazo: this.venderCurtoPrazo(),
        takeMinimo: this.calculaTakeMinimo(),
        takeMaximo: this.calculaTakeMaximo(),
        dentroTake: this.dentroTake(),
        valorPerdas: this.calculaValorPerdas(),
        valorConsumoTotal: this.consumoTotal,
        resultadoFaturamento: this.resultadoFaturamento(),
    };
    return ret;
  } 
  
  public calcularAnalitico(relatorio: IRelatorioMedicao) : IValoresMedicaoAnalitico[]
  {
    if (!relatorio)
      return null;
    try {      
      var retorno: IValoresMedicaoAnalitico[] = [];      
      var valores = this.calcular(relatorio);
      var total3Porcento = this.relatorio.totalMedido*1.03;
      relatorio.valoresAnaliticos.forEach(val => {
        if (!val.totalMedido || val.totalMedido == null)
          val.totalMedido = 0;
        var unitario3Porcento = +(val.totalMedido*(3/100))+val.totalMedido;
        var total = this.calculaConsumoTotalUnitario(val.totalMedido, val.proinfa);
        var totalComTake = (total/this.consumoTotal)*valores.resultadoFaturamento.quantidade;
        var valorProduto = totalComTake * relatorio.valorUnitarioKwh;
        var totalIcms = this.calculaIcmsUnitario(totalComTake, valorProduto);
        var totalNota = valorProduto + totalIcms;
        var ret: IValoresMedicaoAnalitico = {
          numCnpj: val.numCnpj,
          descEmpresa: val.descEmpresa,
          descEndereco: val.descEndereco,
          quantidade: totalComTake,
          unidade: "MWh",
          valorUnitario: relatorio.valorUnitarioKwh,
          valorICMS: totalIcms,
          valorProduto: valorProduto,
          valorNota: totalNota,
          comprarCurtoPrazo: this.curtoPrazoUnitario(total3Porcento, unitario3Porcento, valores.comprarCurtoPrazo),
          venderCurtoPrazo: this.curtoPrazoUnitario(total3Porcento, unitario3Porcento, valores.venderCurtoPrazo),
        };
        
        retorno.push(ret);
      });      
      } catch (error) {
    }

    return retorno;
  } 

  private calculaValorPerdas()
  {
    return (this.relatorio.totalMedido*this.multiplicadorPerda)/1000;
  }

  private calculaIcms() {
    return (
      this.faturarLongoPrazo() *
        (this.relatorio.valorUnitarioKwh /
          ((100 - this.relatorio.icms) / 100)) -
      this.calculaValorProduto()
    );
  }

  private calculaIcmsUnitario(consumoTotal: number, valorProduto: number) {
    return (
      consumoTotal *
        (this.relatorio.valorUnitarioKwh /
          ((100 - this.relatorio.icms) / 100)) - valorProduto
    );
  }

  private calculaValorProduto() {
    return this.faturarLongoPrazo() * this.relatorio.valorUnitarioKwh;
  }

  private calculaTakeMinimo() {
    var energiaContratada = +this.relatorio.energiaContratada;
    var takeMinimo = +this.relatorio?.takeMinimo;

    return energiaContratada - energiaContratada * (takeMinimo / 100);
  }

  private calculaTakeMaximo() {
    var energiaContratada = +this.relatorio.energiaContratada;
    var takeMaximo = +this.relatorio?.takeMaximo;

    return energiaContratada + energiaContratada * (takeMaximo / 100);
  }

  private dentroTake() {
    var takeMinimo = this.calculaTakeMinimo();
    var takeMaximo = this.calculaTakeMaximo();
    var totalMedido = +this.consumoTotal;

    return totalMedido >= takeMinimo && totalMedido <= takeMaximo ? true : false;
  }

  private faturarLongoPrazo() {
    var take = this.dentroTake();
    if (take == true) return this.consumoTotal;
    if (this.consumoTotal < this.calculaTakeMinimo())
      return this.calculaTakeMinimo();
    
    return this.calculaTakeMaximo();
  }

  private comprarCurtoPrazo() {
    var take = this.dentroTake();
    if (take == false) 
    {
      var faturarLongoPrazo = this.faturarLongoPrazo();
      if (this.consumoTotal > faturarLongoPrazo)
        return this.consumoTotal - this.calculaTakeMaximo();
      return 0.0;
    }
    
    return 0.0;
  }

  private venderCurtoPrazo() {
    var take = this.dentroTake();
    if (take == false) {
      var faturarLongoPrazo = this.faturarLongoPrazo();
      if (this.consumoTotal < faturarLongoPrazo)
        return faturarLongoPrazo - this.consumoTotal;
      
      return 0.0;
    }
    return 0.0;
  }

  private resultadoFaturamento()
  {
    var faturamento: IFaturamentoMedicao =
    {
      faturamento: 'Longo Prazo',
      quantidade: this.faturarLongoPrazo(),
      unidade: 'MWh',
      valorUnitario: this.relatorio.valorUnitarioKwh,
      valorICMS: this.calculaIcms(),
      valorProduto: this.calculaValorProduto(),
      valorNota: this.calculaIcms()+this.calculaValorProduto()
    }

    return faturamento;
  }

  private calculaConsumoTotal()
  {
    var total = +this.relatorio.totalMedido/1000.0;
    var proinfa = +this.relatorio.proinfa;
    this.consumoTotal = (total*1.03)-proinfa;
  }

  public calculaConsumoTotalUnitario(totalMedidoKWh: number, proinfa: number): number
  {
    var total = +totalMedidoKWh/1000.0;
    var proinfa = +proinfa;
    return (total*1.03)-proinfa;
  }

  public curtoPrazoUnitario(totalGeral: number, totalUnitario: number, valorGeral:number): number
  {
    if (valorGeral > 0)
      return (totalUnitario/totalGeral)*valorGeral;
    return 0.0;
  }
}
