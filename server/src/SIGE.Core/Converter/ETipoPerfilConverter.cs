using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SIGE.Core.Enumerators;
using SIGE.Core.Extensions;

namespace SIGE.Core.Converter
{
    public class ETipoPerfilConverter : ValueConverter<ETipoPerfil, string>
    {
        public ETipoPerfilConverter(ConverterMappingHints mappingHints = null)
            : base(
                  v => v.GetStringValue(),
                  v => Enum.Parse<ETipoPerfil>(v)
              )
        { }
    }
}
