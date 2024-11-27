namespace SIGE.Core.Models.Dto.Gerencial.Concessionaria
{
    public class AnaliseViabilidadeDto
    {
        public Guid? ConcessionariaId { get; set; }
        public double PchKWhFornecedorZero { get; set; }
        public double PchKWhFornecedorCinquenta { get; set; }
        public double PchKWhFornecedorCem { get; set; }
        public double EncConexao { get; set; }
        public double EssEncServicoSist { get; set; }
        public double DemPta { get; set; }
        public double DemFPta { get; set; }
        public double KWhPta { get; set; }
        public double KWhFPta { get; set; }
        public virtual double KWhPFP
        {
            get { return (KWhFPta + KWhPta) / 1000; }
        }
    }
}
