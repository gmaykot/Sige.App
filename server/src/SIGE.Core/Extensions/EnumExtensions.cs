using SIGE.Core.Attributes;
using System.ComponentModel;

namespace SIGE.Core.Extensions
{
    public static class EnumExtensions
    {
        public static string GetStringValue<TEnum>(this TEnum value) where TEnum : Enum
        {
            Type type = value.GetType();
            string name = Enum.GetName(type, value);
            if (name != null)
            {
                var field = type.GetField(name);
                if (field != null)
                {
                    if (Attribute.GetCustomAttribute(field, typeof(StringValueAttribute)) is StringValueAttribute attribute)
                    {
                        return attribute.Value;
                    }
                }
            }
            return value.ToString();
        }

        public static string GetDescription(this Enum anyEnum)
        {
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

        public static string GetSiglaDescription(this Enum anyEnum)
        {
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

        public static string GetSigla(this Enum anyEnum)
        {
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
    }
}
