namespace SIGE.Core.Models.Dto.Gerencial.Concessionaria
{
    public class CalculoValoresConcessionariaDto : ValorConcessionariaDto
    {
        #region Valores THS Verde
        public virtual double KWhPUVerde
        {
            get { return KWhPSVerde; }
        }
        public virtual double KWhFPUVerde
        {
            get { return KWhFPSVerde; }
        }
        public virtual double DemUIPVerde
        {
            get { return DemVerde * 2; }
        }
        #endregion

        #region Valores THS Azul
        public virtual double KWhPUAzul
        {
            get { return KWhPSAzul; }
        }
        public virtual double KWhFPUAzul
        {
            get { return KWhFPSAzul; }
        }
        public virtual double DemUIPAzul
        {
            get { return DemPAzul * 2; }
        }
        public virtual double DemUIFPAzul
        {
            get { return DemFPAzul * 2; }
        }

        #endregion

        #region Valor Azul Merc. Livre 0% desc       
        public virtual double TusdPKWhAzul0
        {
            get { return TusdFPKWhAzul0; }
        }
        public virtual double TusdPAzul0
        {
            get { return DemPAzul; }
        }
        public virtual double TusdFPAzul0
        {
            get { return DemFPAzul; }
        }
        #endregion

        #region Valor Azul Merc. Livre 50% desc       
        public virtual double CusdPAzul50
        {
            get { return CusdFPAzul50; }
        }
        public virtual double TusdFPAzul50
        {
            get { return DemFPAzul * 0.5; }
        }
        public virtual double TusdPAzul50
        {
            get { return DemPAzul * 0.5; }
        }
        #endregion

        #region Valor Azul Merc. Livre 100% desc       
        public virtual double TusdFPKwhAzul100
        {
            get { return CusdFPAzul50; }
        }
        public virtual double TusdPKwhAzul100
        {
            get { return CusdFPAzul50; }
        }
        #endregion

        #region Valor Verde Merc. Livre 0% desc    
        public virtual double TusdFPKWhVerde0
        {
            get { return CusdFPVerde50; }
        }
        public virtual double TusdPKWhVerde0
        {
            get { return CusdPVerde50; }
        }
        public virtual double TusdPFPVerde0
        {
            get { return DemFPAzul; }
        }
        #endregion

        #region Valor Verde Merc. Livre 50% desc       
        public virtual double CusdPVerde50
        {
            get { return (CusdPCalcVerde50 - CusdFPVerde50) / 2 + CusdFPVerde50; }
        }
        public virtual double CusdFPVerde50
        {
            get { return CusdFPAzul50; }
        }
        public virtual double TusdVerde50
        {
            get { return TusdFPAzul50; }
        }
        #endregion

        #region Valor Verde Merc. Livre 100% desc       
        public virtual double CusdPVerde100
        {
            get { return TusdPKwhAzul100; }
        }
        public virtual double CusdFPVerde100
        {
            get { return TusdFPKwhAzul100; }
        }
        #endregion
    }
}
