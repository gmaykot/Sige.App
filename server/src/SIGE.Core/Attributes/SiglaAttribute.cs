using System.Diagnostics.CodeAnalysis;

namespace SIGE.Core.Attributes
{
    [AttributeUsage(AttributeTargets.All)]
    public class SiglaAttribute : Attribute
    {
        public static readonly SiglaAttribute Default = new SiglaAttribute();

        public SiglaAttribute() : this(string.Empty, string.Empty)
        {
        }
        public SiglaAttribute(string sigla, string descricao)
        {
            Siglavalue = sigla;
            DescricaoValue = descricao;
        }

        public virtual string Descricao => DescricaoValue;
        public virtual string Sigla => Siglavalue;

        protected string DescricaoValue { get; set; }
        protected string Siglavalue { get; set; }

        public override bool Equals([NotNullWhen(true)] object? obj) =>
            obj is SiglaAttribute other && other.Descricao == Descricao;

        public override int GetHashCode() => Descricao?.GetHashCode() ?? 0;

        public override bool IsDefaultAttribute() => Equals(Default);
    }
}
