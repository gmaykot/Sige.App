﻿using AutoMapper;
using SIGE.Core.Models.Dto.Gerencial;
using SIGE.Core.Models.Dto.Gerencial.BandeiraTarifaria;
using SIGE.Core.Models.Sistema.Gerencial;
using SIGE.Core.Models.Sistema.Gerencial.BandeiraTarifaria;

namespace SIGE.Core.Mapper
{
    public class GerencialMapper : Profile
    {
        public GerencialMapper()
        {
            CreateMap<BandeiraTarifariaDto, BandeiraTarifariaModel>().ReverseMap();
            CreateMap<BandeiraTarifariaVigenteDto, BandeiraTarifariaVigenteModel>().ReverseMap();
            CreateMap<SalarioMinimoDto, SalarioMinimoModel>().ReverseMap();

            CreateMap<TarifaAplicacaoDto, TarifaAplicacaoModel>().ReverseMap();
            CreateMap<TarifaAplicacaoModel, TarifaAplicacaoDto>()
                .ForMember(dst => dst.DescConcessionaria, 
                           map => map.MapFrom(src => src.Concessionaria != null ? src.Concessionaria.Nome : string.Empty));
        }
    }
}
