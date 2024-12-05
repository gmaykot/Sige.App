namespace SIGE.Core.Models.Dto.Administrativo.Dashboard
{
    public class ContratoFinalizadoDashboardDto
    {
        public required string NumContrato { get; set; }
        public required string DescGrupoEmpresas { get; set; }
        public required DateTime VigenciaInicial { get; set; }
        public required DateTime VigenciaFinal { get; set; }
    }
}
