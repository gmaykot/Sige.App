using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;

namespace SIGE.Core.Converter
{
    public class ETipoBandeiraConverter : ValueConverter<ETipoBandeira, string>
    {
        public ETipoBandeiraConverter(ConverterMappingHints mappingHints = null)
            : base(
                  v => v.GetStringValue(),
                  v => Enum.Parse<ETipoBandeira>(v)
              )
        { }
    }
}
