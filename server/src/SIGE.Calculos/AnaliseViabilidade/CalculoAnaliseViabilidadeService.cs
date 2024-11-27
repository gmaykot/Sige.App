using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;
using SIGE.Core.Models.Defaults;
using SIGE.Core.Models.Dto.Gerencial.Concessionaria;

namespace SIGE.Calculos.AnaliseViabilidade
{
    public class CalculoAnaliseViabilidadeService : ICalculoAnaliseViabilidadeService
    {
        public Response CalculaMercadoCativoAzul(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest)
        {
            var demPonta = analiseViabilidadeRequest.DemPta * valorConcessionaria.DemPAzul;
            var demFPonta = analiseViabilidadeRequest.DemFPta * valorConcessionaria.DemFPAzul;
            var kwhPta = analiseViabilidadeRequest.KWhPta * valorConcessionaria.KWhPSAzul;
            var kwhFPta = analiseViabilidadeRequest.KWhFPta * valorConcessionaria.KWhFPSAzul;
            var total = demPonta + demFPonta + kwhPta + kwhFPta;
            var totalAno = (total * 12) / 12 * 12;
            var mediaMes = totalAno / 12;

            var res = new CalculoAnaliseDto
            {
                TipoSegmento = ETipoSegmento.AZUL_CATIVO.GetDescription(),
                DemPonta = demPonta,
                DemFPonta = demFPonta,
                KWhPonta = kwhPta,
                KWhFPonta = kwhFPta,
                Total = total,
                TotalAno = (total * 12) / 12 * 12,
                MediaMes = totalAno / 12,
                MediaMesMwh = mediaMes / analiseViabilidadeRequest.KWhPFP
            };
            var ret = new Response();
            return ret.SetOk().SetData(res);
        }

        public Response CalculaMercadoCativoVerde(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest)
        {
            var demFPonta = analiseViabilidadeRequest.DemFPta * valorConcessionaria.DemVerde;
            var kwhPta = analiseViabilidadeRequest.KWhPta * valorConcessionaria.KWhPSVerde;
            var kwhFPta = analiseViabilidadeRequest.KWhFPta * valorConcessionaria.KWhFPSVerde;
            var total = demFPonta + kwhPta + kwhFPta;
            var totalAno = (total * 12) / 12 * 12;
            var mediaMes = totalAno / 12;

            var res = new CalculoAnaliseDto
            {
                TipoSegmento = ETipoSegmento.VERDE_CATIVO.GetDescription(),
                DemFPonta = demFPonta,
                KWhPonta = kwhPta,
                KWhFPonta = kwhFPta,
                Total = total,
                TotalAno = (total * 12) / 12 * 12,
                MediaMes = totalAno / 12,
                MediaMesMwh = mediaMes / analiseViabilidadeRequest.KWhPFP
            };

            var ret = new Response();
            return ret.SetOk().SetData(res);
        }

        public Response CalculaMercadoLivreAzulCem(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest)
        {
            var cusdPta = analiseViabilidadeRequest.KWhPta * valorConcessionaria.TusdPKwhAzul100;
            var cusdFPta = analiseViabilidadeRequest.KWhFPta * valorConcessionaria.TusdFPKwhAzul100;
            var kwPtaFornecedor = analiseViabilidadeRequest.KWhPta * analiseViabilidadeRequest.PchKWhFornecedorCem;
            var kwFPtaFornecedor = analiseViabilidadeRequest.KWhFPta * analiseViabilidadeRequest.PchKWhFornecedorCem;
            var total = cusdPta + cusdFPta + kwPtaFornecedor + kwFPtaFornecedor + analiseViabilidadeRequest.EncConexao + analiseViabilidadeRequest.EssEncServicoSist;

            var totalAno = (total * 12) / 12 * 12;
            var mediaMes = totalAno / 12;

            var res = new CalculoAnaliseDto
            {
                TipoSegmento = ETipoSegmento.AZUL_CEM.GetDescription(),
                EncConexao = analiseViabilidadeRequest.EncConexao,
                EssEncServicoSist = analiseViabilidadeRequest.EssEncServicoSist,
                CusdPonta = cusdPta,
                CusdFPonta = cusdFPta,
                KWhPonta = kwPtaFornecedor,
                KWhFPonta = kwFPtaFornecedor,
                Total = total,
                TotalAno = (total * 12) / 12 * 12,
                MediaMes = totalAno / 12,
                MediaMesMwh = mediaMes / analiseViabilidadeRequest.KWhPFP
            };

            var ret = new Response();
            return ret.SetOk().SetData(res);
        }

        public Response CalculaMercadoLivreAzulCinquenta(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest)
        {
            var cusdPta = analiseViabilidadeRequest.KWhPta * valorConcessionaria.CusdPAzul50;
            var cusdFPta = analiseViabilidadeRequest.KWhFPta * valorConcessionaria.CusdFPAzul50;
            var tusdPta = analiseViabilidadeRequest.DemPta * valorConcessionaria.TusdPAzul50;
            var tusdFPta = analiseViabilidadeRequest.DemFPta * valorConcessionaria.TusdFPAzul50;
            var kwPtaFornecedor = analiseViabilidadeRequest.KWhPta * analiseViabilidadeRequest.PchKWhFornecedorCinquenta;
            var kwFPtaFornecedor = analiseViabilidadeRequest.KWhFPta * analiseViabilidadeRequest.PchKWhFornecedorCinquenta;
            var total = cusdPta + cusdFPta + tusdPta + tusdFPta + kwPtaFornecedor + kwFPtaFornecedor + analiseViabilidadeRequest.EncConexao + analiseViabilidadeRequest.EssEncServicoSist;

            var totalAno = (total * 12) / 12 * 12;
            var mediaMes = totalAno / 12;

            var res = new CalculoAnaliseDto
            {
                TipoSegmento = ETipoSegmento.AZUL_CINQUENTA.GetDescription(),
                EncConexao = analiseViabilidadeRequest.EncConexao,
                EssEncServicoSist = analiseViabilidadeRequest.EssEncServicoSist,
                CusdPonta = cusdPta,
                CusdFPonta = cusdFPta,
                TusdPonta = tusdPta,
                TusdFPonta = tusdFPta,
                KWhPonta = kwPtaFornecedor,
                KWhFPonta = kwFPtaFornecedor,
                Total = total,
                TotalAno = (total * 12) / 12 * 12,
                MediaMes = totalAno / 12,
                MediaMesMwh = mediaMes / analiseViabilidadeRequest.KWhPFP
            };

            var ret = new Response();
            return ret.SetOk().SetData(res);
        }

        public Response CalculaMercadoLivreAzulZero(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest)
        {
            var cusdPta = analiseViabilidadeRequest.KWhPta * valorConcessionaria.TusdPKWhAzul0;
            var cusdFPta = analiseViabilidadeRequest.KWhFPta * valorConcessionaria.TusdFPKWhAzul0;
            var tusdPta = analiseViabilidadeRequest.DemPta * valorConcessionaria.TusdPAzul0;
            var tusdFPta = analiseViabilidadeRequest.DemFPta * valorConcessionaria.TusdFPAzul0;
            var kwPtaFornecedor = analiseViabilidadeRequest.KWhPta * analiseViabilidadeRequest.PchKWhFornecedorZero;
            var kwFPtaFornecedor = analiseViabilidadeRequest.KWhFPta * analiseViabilidadeRequest.PchKWhFornecedorZero;
            var total = cusdPta + cusdFPta + tusdPta + tusdFPta + kwPtaFornecedor + kwFPtaFornecedor + analiseViabilidadeRequest.EncConexao + analiseViabilidadeRequest.EssEncServicoSist;

            var totalAno = (total * 12) / 12 * 12;
            var mediaMes = totalAno / 12;

            var res = new CalculoAnaliseDto
            {
                TipoSegmento = ETipoSegmento.AZUL_ZERO.GetDescription(),
                EncConexao = analiseViabilidadeRequest.EncConexao,
                EssEncServicoSist = analiseViabilidadeRequest.EssEncServicoSist,
                CusdPonta = cusdPta,
                CusdFPonta = cusdFPta,
                TusdPonta = tusdPta,
                TusdFPonta = tusdFPta,
                KWhPonta = kwPtaFornecedor,
                KWhFPonta = kwFPtaFornecedor,
                Total = total,
                TotalAno = (total * 12) / 12 * 12,
                MediaMes = totalAno / 12,
                MediaMesMwh = mediaMes / analiseViabilidadeRequest.KWhPFP
            };

            var ret = new Response();
            return ret.SetOk().SetData(res);
        }

        public Response CalculaMercadoLivreVerdeCem(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest)
        {
            var cusdFPta = analiseViabilidadeRequest.KWhFPta * valorConcessionaria.CusdFPVerde100;
            var cusdPta = analiseViabilidadeRequest.KWhPta * valorConcessionaria.CusdPVerde100;
            var kwPtaFornecedor = analiseViabilidadeRequest.KWhPta * analiseViabilidadeRequest.PchKWhFornecedorCem;
            var kwFPtaFornecedor = analiseViabilidadeRequest.KWhFPta * analiseViabilidadeRequest.PchKWhFornecedorCem;
            var total = cusdFPta + cusdPta + kwPtaFornecedor + kwFPtaFornecedor + analiseViabilidadeRequest.EncConexao + analiseViabilidadeRequest.EssEncServicoSist;

            var totalAno = (total * 12) / 12 * 12;
            var mediaMes = totalAno / 12;

            var res = new CalculoAnaliseDto
            {
                TipoSegmento = ETipoSegmento.VERDE_CEM.GetDescription(),
                EncConexao = analiseViabilidadeRequest.EncConexao,
                EssEncServicoSist = analiseViabilidadeRequest.EssEncServicoSist,
                CusdFPonta = cusdFPta,
                CusdPonta = cusdPta,
                KWhPonta = kwPtaFornecedor,
                KWhFPonta = kwFPtaFornecedor,
                Total = total,
                TotalAno = (total * 12) / 12 * 12,
                MediaMes = totalAno / 12,
                MediaMesMwh = mediaMes / analiseViabilidadeRequest.KWhPFP
            };

            var ret = new Response();
            return ret.SetOk().SetData(res);
        }

        public Response CalculaMercadoLivreVerdeCinquenta(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest)
        {
            var cusdFPta = analiseViabilidadeRequest.KWhFPta * valorConcessionaria.CusdFPVerde50;
            var cusdPta = analiseViabilidadeRequest.KWhPta * valorConcessionaria.CusdPVerde50;
            var tusdPFPta = analiseViabilidadeRequest.DemFPta * valorConcessionaria.TusdVerde50;
            var kwPtaFornecedor = analiseViabilidadeRequest.KWhPta * analiseViabilidadeRequest.PchKWhFornecedorCinquenta;
            var kwFPtaFornecedor = analiseViabilidadeRequest.KWhFPta * analiseViabilidadeRequest.PchKWhFornecedorCinquenta;

            var total = cusdFPta + cusdPta + tusdPFPta + kwPtaFornecedor + kwFPtaFornecedor + analiseViabilidadeRequest.EncConexao + analiseViabilidadeRequest.EssEncServicoSist;

            var totalAno = (total * 12) / 12 * 12;
            var mediaMes = totalAno / 12;

            var res = new CalculoAnaliseDto
            {
                TipoSegmento = ETipoSegmento.VERDE_CINQUENTA.GetDescription(),
                EncConexao = analiseViabilidadeRequest.EncConexao,
                EssEncServicoSist = analiseViabilidadeRequest.EssEncServicoSist,
                CusdPonta = cusdPta,
                CusdFPonta = cusdFPta,
                TusdPFPonta = tusdPFPta,
                KWhPonta = kwPtaFornecedor,
                KWhFPonta = kwFPtaFornecedor,
                Total = total,
                TotalAno = (total * 12) / 12 * 12,
                MediaMes = totalAno / 12,
                MediaMesMwh = mediaMes / analiseViabilidadeRequest.KWhPFP
            };

            var ret = new Response();
            return ret.SetOk().SetData(res);
        }

        public Response CalculaMercadoLivreVerdeZero(CalculoValoresConcessionariaDto valorConcessionaria, AnaliseViabilidadeDto analiseViabilidadeRequest)
        {
            var cusdFPta = analiseViabilidadeRequest.KWhFPta * valorConcessionaria.TusdPKWhVerde0;
            var cusdPta = analiseViabilidadeRequest.KWhPta * valorConcessionaria.TusdFPKWhVerde0;
            var tusdPFPta = analiseViabilidadeRequest.DemFPta * valorConcessionaria.TusdPFPVerde0;
            var kwPtaFornecedor = analiseViabilidadeRequest.KWhPta * analiseViabilidadeRequest.PchKWhFornecedorZero;
            var kwFPtaFornecedor = analiseViabilidadeRequest.KWhFPta * analiseViabilidadeRequest.PchKWhFornecedorZero;
            var total = cusdFPta + cusdPta + tusdPFPta + kwPtaFornecedor + kwFPtaFornecedor + analiseViabilidadeRequest.EncConexao + analiseViabilidadeRequest.EssEncServicoSist;

            var totalAno = (total * 12) / 12 * 12;
            var mediaMes = totalAno / 12;

            var res = new CalculoAnaliseDto
            {
                TipoSegmento = ETipoSegmento.VERDE_ZERO.GetDescription(),
                EncConexao = analiseViabilidadeRequest.EncConexao,
                EssEncServicoSist = analiseViabilidadeRequest.EssEncServicoSist,
                CusdFPonta = cusdFPta,
                CusdPonta = cusdPta,
                TusdPFPonta = tusdPFPta,
                KWhPonta = kwPtaFornecedor,
                KWhFPonta = kwFPtaFornecedor,
                Total = total,
                TotalAno = (total * 12) / 12 * 12,
                MediaMes = totalAno / 12,
                MediaMesMwh = mediaMes / analiseViabilidadeRequest.KWhPFP
            };

            var ret = new Response();
            return ret.SetOk().SetData(res);
        }
    }
}
