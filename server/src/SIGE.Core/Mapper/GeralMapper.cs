using AutoMapper;
using SIGE.Core.Models.Dto.FaturmentoCoenel;
using SIGE.Core.Models.Dto.RelatorioEconomia;
using SIGE.Core.Models.Sistema.Faturamento;
using SIGE.Core.Models.Sistema.Medicao;
using SIGE.Core.Models.Sistema.RelatorioEconomia;

namespace SIGE.Core.Mapper
{
    public class GeralMapper : Profile
    {
        public GeralMapper()
        {
            CreateMap<RelatorioEconomiaModel, RelatorioEconomiaDto> ().ReverseMap();

            CreateMap<FaturamentoCoenelModel, FaturamentoCoenelDto>()
                .ForMember(dst => dst.DescPontoMedicao, map =>
                    map.MapFrom(src => GetPontoMedicaoDescricao(src.PontoMedicao)))
                .ForMember(dst => dst.DescEmpresa, map =>
                    map.MapFrom(src => GetEmpresaDescricao(src.PontoMedicao))).ReverseMap();
        }

        private string GetPontoMedicaoDescricao(PontoMedicaoModel? pontoMedicao)
        {
            if (pontoMedicao == null)
                return string.Empty;

            return $"{pontoMedicao.Nome} ({pontoMedicao.Codigo})";
        }

        private string GetEmpresaDescricao(PontoMedicaoModel? pontoMedicao)
        {
            return pontoMedicao?.AgenteMedicao?.Empresa?.NomeFantasia ?? string.Empty;
        }
    }
}
