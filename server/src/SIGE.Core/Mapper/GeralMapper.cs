using AutoMapper;
using SIGE.Core.Models.Dto.Administrativo.Usuario;
using SIGE.Core.Models.Dto.Geral;
using SIGE.Core.Models.Dto.Geral.RelatorioMedicao;
using SIGE.Core.Models.Sistema.Administrativo;
using SIGE.Core.Models.Sistema.Geral;
using SIGE.Core.Models.Sistema.Geral.Medicao;

namespace SIGE.Core.Mapper
{
    public class GeralMapper : Profile
    {
        public GeralMapper()
        {
            CreateMap<TokenModel, TokenDto> ().ReverseMap();

            CreateMap<RelatorioMedicaoModel, RelatorioMedicaoDto> ().ReverseMap();

            CreateMap<dynamic, FaturamentoCoenelDto>();

            CreateMap<FaturamentoCoenelModel, FaturamentoCoenelDto>()
                .ForMember(dst => dst.DescPontoMedicao, map => map.MapFrom(src => GetPontoMedicaoDescricao(src.PontoMedicao)))
                .ForMember(dst => dst.DescEmpresa, map => map.MapFrom(src => GetEmpresaDescricao(src.PontoMedicao)))
                .ForMember(dst => dst.EmpresaId, map => map.MapFrom(src => GetEmpresaId(src.PontoMedicao))).ReverseMap();
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

        private Guid GetEmpresaId(PontoMedicaoModel? pontoMedicao)
        {
            return pontoMedicao?.AgenteMedicao?.Empresa?.Id ?? Guid.Empty;
        }
    }
}
