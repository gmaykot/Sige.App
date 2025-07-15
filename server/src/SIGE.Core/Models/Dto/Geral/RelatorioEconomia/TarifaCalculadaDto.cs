// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

namespace SIGE.Core.Models.Dto.Geral.RelatorioEconomia {
    public class TarifaCalculadaDto {
        public double? ICMS { get; set; }
        public double? PIS { get; set; }
        public double? Cofins { get; set; }
        public double? Proinfa { get; set; }
        public double? PercentualTUSD { get; set; }
        public double? TotalPercentualTUSD { get; set; }

        public double? BandeiraAdicional { get; set; }

        public double? KWPonta { get; set; }
        public double? KWForaPonta { get; set; }
        public double? KWhPontaTUSD { get; set; }
        public double? KWhForaPontaTUSD { get; set; }
        public double? KWhPontaTE { get; set; }
        public double? KWhForaPontaTE { get; set; }
        public double? ReatKWhPFTE { get; set; }


        public double? BandeiraAdicionalComImposto {
            get => CalculoBaseComImposto(BandeiraAdicional);
        }

        public double? KWPontaComImposto {
            get => CalculoBaseComImposto(KWPonta);
        }

        public double? KWForaPontaComImposto {
            get => CalculoBaseComImposto(KWForaPonta);
        }

        public double? KWForaPontaSemICMS {
            get => CalculoBaseSemICMS(KWForaPonta);
        }

        public double? KWPontaSemICMS {
            get => CalculoBaseSemICMS(KWPonta);
        }

        public double? KWhPontaTUSDComImposto {
            get => CalculoBaseComImposto(KWhPontaTUSD);
        }

        public double? KWhPontaTUSDCalculadoComImposto {
            get {
                var fatorTusd = (100 - PercentualTUSD * 100) / 100;
                var total = ((KWhPontaTUSDComImposto - KWhForaPontaTUSDComImposto) * fatorTusd) + KWhForaPontaTUSDComImposto;
                return total;
            }
        }

        public double? KWhForaPontaTUSDCalculadoComImposto {
            get {
                if (TotalPercentualTUSD == 0)
                    return KWForaPontaComImposto;

                var fatorTusd = TotalPercentualTUSD - PercentualTUSD * 100;
                var total = (KWForaPontaComImposto * 1) * (fatorTusd + TotalPercentualTUSD);
                return total / 100;
            }
        }

        public double? KWhForaPontaTUSDNaoConsumidaCalculadoComImposto {
            get {
                if (TotalPercentualTUSD == 0)
                    return KWForaPontaComImposto;

                var fatorTusd = TotalPercentualTUSD - PercentualTUSD * 100;
                var total = (KWForaPontaSemICMS * 1) * (fatorTusd + TotalPercentualTUSD);
                return total / 100;
            }
        }

        public double? KWhForaPontaTUSDComImposto {
            get => CalculoBaseComImposto(KWhForaPontaTUSD);
        }

        public double? KWhPontaTEComImposto {
            get => CalculoBaseComImposto(KWhPontaTE);
        }

        public double? KWhForaPontaTEComImposto {
            get => CalculoBaseComImposto(KWhForaPontaTE);
        }

        public double? ReatKWhPFTEComImposto {
            get => CalculoBaseComImposto(ReatKWhPFTE);
        }

        public double? CalculoBaseComImposto(double? valor) =>
            (valor / BaseCofinsCalculado()) / BaseICMS();

        public double? CalculoBaseSemICMS(double? valor) =>
            valor / ((100 - (PIS + Cofins)) / 100);

        public double? BaseCofins() =>
            PIS + Cofins;

        public double? BaseCofinsCalculado() =>
            (100 - BaseCofins()) / 100;

        public double? BaseICMS() =>
            (100 - ICMS) / 100;
    }
}
