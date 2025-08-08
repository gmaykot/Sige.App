using System.ComponentModel;
using SIGE.Core.Attributes;
using SIGE.Core.Enumerators;

namespace SIGE.Core.Extensions {
    public static class EnumExtensions {
        public static string GetStringValue<TEnum>(this TEnum value) where TEnum : Enum {
            Type type = value.GetType();
            string name = Enum.GetName(type, value);
            if (name != null) {
                var field = type.GetField(name);
                if (field != null) {
                    if (Attribute.GetCustomAttribute(field, typeof(StringValueAttribute)) is StringValueAttribute attribute) {
                        return attribute.Value;
                    }
                }
            }
            return value.ToString();
        }

        public static string GetDescription(this Enum anyEnum) {
            if (anyEnum == null)
                return string.Empty;
            var member = anyEnum.GetType().GetMember(anyEnum.ToString()).FirstOrDefault();

            if (member == null)
                return string.Empty;
            var attr = member.GetCustomAttributes(typeof(DescriptionAttribute), false).FirstOrDefault();

            if (attr == null)
                return string.Empty;
            if (attr != null) return ((DescriptionAttribute)attr).Description;

            return anyEnum.ToString();
        }

        public static string GetSiglaDescription(this Enum anyEnum) {
            if (anyEnum == null)
                return string.Empty;
            var member = anyEnum.GetType().GetMember(anyEnum.ToString()).FirstOrDefault();

            if (member == null)
                return string.Empty;
            var attr = member.GetCustomAttributes(typeof(SiglaAttribute), false).FirstOrDefault();

            if (attr == null)
                return string.Empty;
            if (attr != null) return ((SiglaAttribute)attr).Descricao;

            return anyEnum.ToString();
        }

        /// <summary>
        /// Retorna o valor numérico do enum como string.
        /// Exemplo: MyEnum.Value1 (com valor 5) retorna "5".
        /// </summary>
        public static string GetValueString(this Enum anyEnum) {
            if (anyEnum == null)
                return string.Empty;

            // Converte o enum para int e depois para string
            return Convert.ToInt32(anyEnum).ToString();
        }

        public static string GetSigla(this Enum anyEnum) {
            if (anyEnum == null)
                return string.Empty;
            var member = anyEnum.GetType().GetMember(anyEnum.ToString()).FirstOrDefault();

            if (member == null)
                return string.Empty;
            var attr = member.GetCustomAttributes(typeof(SiglaAttribute), false).FirstOrDefault();

            if (attr == null)
                return string.Empty;
            if (attr != null) return ((SiglaAttribute)attr).Sigla;

            return anyEnum.ToString();
        }

        public static T GetByIndex<T>(int index) {
            var values = Enum.GetValues(typeof(T));
            if (index < 0 || index >= values.Length)
                throw new ArgumentOutOfRangeException(nameof(index), "Index is out of range for the enum.");

            return (T)values.GetValue(index)!;
        }

        public static int GetValorTipoEnergia(this ETipoEnergia tipoEnergia) {

            return tipoEnergia switch {
                ETipoEnergia.I0_LP => 0,
                ETipoEnergia.I1_LP => 100,
                ETipoEnergia.I5_LP => 50,
                ETipoEnergia.CONVENCIONAL_LP => 0,
                _ => 0,
            };
        }

        public static int ToInt(this Enum value) {
            return Convert.ToInt32(value);
        }

        public static string ToCharString(this Enum value) {
            return ((char)value.ToInt()).ToString();
        }
    }
}
