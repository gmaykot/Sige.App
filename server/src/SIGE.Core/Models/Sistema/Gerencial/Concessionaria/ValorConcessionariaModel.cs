using SIGE.Core.Enumerators;
using SIGE.Core.Models.Defaults;

namespace SIGE.Core.Models.Sistema.Gerencial.Concessionaria
{
    public class ValorConcessionariaModel : BaseModel
    {
        public Guid ConcessionariaId { get; set; }
        public virtual ConcessionariaModel? Concessionaria { get; set; }
        public required string NumeroResolucao { get; set; }
        public required ESubGrupo SubGrupo { get; set; }
        public DateTime DataUltimoReajuste { get; set; }

        #region Valores THS Verde
        public double KWhPSVerde { get; set; }
        public double KWhFPSVerde { get; set; }
        public double DemVerde { get; set; }
        #endregion

        #region Valores THS Azul
        public double KWhPSAzul { get; set; }
        public double KWhFPSAzul { get; set; }
        public double DemPAzul { get; set; }
        public double DemFPAzul { get; set; }
        #endregion

        #region Valores BT       
        public double KWhBT { get; set; }
        #endregion

        #region Valor Azul Merc. Livre 0% desc       
        public double TusdFPKWhAzul0 { get; set; }
        #endregion

        #region Valor Azul Merc. Livre 50% desc       
        public double CusdFPAzul50 { get; set; }
        #endregion

        #region Valor Azul Merc. Livre 100% desc       
        public double TusdFPAzul100 { get; set; }
        public double TusdPAzul100 { get; set; }
        #endregion

        #region Valor Verde Merc. Livre 0% desc    
        public double TusdPKWhCalcVerde0 { get; set; }
        public double TusdPVerde0 { get; set; }
        #endregion

        #region Valor Verde Merc. Livre 50% desc       
        public double CusdPCalcVerde50 { get; set; }
        #endregion

        #region Valor Verde Merc. Livre 100% desc       
        public double TusdVerde100 { get; set; }
        #endregion
    }
}
