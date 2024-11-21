using System.Net;

namespace SIGE.Core.Extensions
{
    public static class HttpStatusCodeExtensions
    {
        public static bool IsHttpSuccessCode(this HttpStatusCode code)
        {
            var codeNumber = code.GetHashCode();
            return codeNumber is >= 200 and <= 299;
        }

        public static bool IsHttpClientErrorCode(this HttpStatusCode code)
        {
            var codeNumber = code.GetHashCode();
            return codeNumber is >= 400 and <= 499;
        }

        public static bool IsHttpServerErrorCode(this HttpStatusCode code)
        {
            var codeNumber = code.GetHashCode();
            return codeNumber is >= 500 and <= 599;
        }

        public static bool Is(this HttpStatusCode code, HttpStatusCode compare) => code == compare;
    }
}
