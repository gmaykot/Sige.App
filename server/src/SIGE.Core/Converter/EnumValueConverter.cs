using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

public class EnumValueConverter<TEnum> : ValueConverter<TEnum, string> where TEnum : struct, Enum
{
    public EnumValueConverter()
        : base(
            enumValue => enumValue.ToString(),
            stringValue => (TEnum)Enum.Parse(typeof(TEnum), stringValue))
    {
    }
}
