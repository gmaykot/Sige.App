using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;

namespace SIGE.Core.Converter
{
    public class ETipoEstadoConverter : ValueConverter<ETipoEstado, string>
    {
        public ETipoEstadoConverter(ConverterMappingHints mappingHints = null)
            : base(
                  v => v.GetStringValue(),
                  v => Enum.Parse<ETipoEstado>(v)
              )
        { }
    }
}
