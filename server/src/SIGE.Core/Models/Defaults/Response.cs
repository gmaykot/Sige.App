using SIGE.Core.Extensions;
using System.Net;
using JPA = Newtonsoft.Json.JsonPropertyAttribute;

namespace SIGE.Core.Models.Defaults
{
    public class Response
    {
        [JPA(Order = -6)] public bool Success { get; private set; }
        [JPA(Order = -5)] public HttpStatusCode Status { get; private set; }
        [JPA(Order = -4)] public dynamic Data { get; private set; } = null!;
        [JPA(Order = -3)] public string Message { get; private set; }
        [JPA(Order = -2)] public ICollection<KeyValuePair<string, string>> Errors { get; private set; } = new List<KeyValuePair<string, string>>();

        //[HideValueOnLog]
        //[J(Order = -1, NullValueHandling = NullValueHandling.Ignore)]
        //public RequestLog? Logs { get; private set; }

        public Response()
        {
            Success = true;
            Status = HttpStatusCode.OK;
            Message = string.Empty;
        }

        public Response(Response res)
        {
            Success = res.Success;
            Status = res.Status;
            Message = res.Message;
            Errors = res.Errors;
        }

        public Response(HttpStatusCode status)
        {
            Success = status.IsHttpSuccessCode();
            Status = status;
            Message = string.Empty;
        }

        public Response(HttpStatusCode status, dynamic data)
        {
            Success = status.IsHttpSuccessCode();
            Status = status;
            Data = data;
            Message = string.Empty;
        }

        public Response(HttpStatusCode status, string message)
        {
            Success = status.IsHttpSuccessCode();
            Status = status;
            Message = message;
        }

        public Response MapFrom(Response source)
        {
            Success = source.Success;
            Status = source.Status;
            Message = source.Message;
            Errors = source.Errors;
            return this;
        }

        public Response SetStatus(HttpStatusCode status)
        {
            Success = status.GetHashCode() is >= 200 and <= 299;
            Status = status;
            return this;
        }

        public Response SetOk() => SetStatus(HttpStatusCode.OK);

        public Response SetCreated() => SetStatus(HttpStatusCode.Created);

        public Response SetNoContent() => SetStatus(HttpStatusCode.NoContent);

        public Response SetBadRequest() => SetStatus(HttpStatusCode.BadRequest);

        public Response SetUnauthorized() => SetStatus(HttpStatusCode.Unauthorized);

        public Response SetNotFound() => SetStatus(HttpStatusCode.NotFound);

        public Response SetUnprocessableEntity() => SetStatus(HttpStatusCode.UnprocessableEntity);

        public Response SetInternalServerError() => SetStatus(HttpStatusCode.InternalServerError);

        public Response SetServiceUnavailable() => SetStatus(HttpStatusCode.ServiceUnavailable);

        public Response SetMessage(string message)
        {
            Message = message;
            return this;
        }

        public Response SetData(dynamic data)
        {
            Data = data;
            return this;
        }

        public Response AddError(string key, string value)
        {
            Errors.Add(new KeyValuePair<string, string>(key, value));
            return this;
        }

        public new Response AddError(Enum anyEnum, string value)
        {
            AddError(anyEnum.GetDescription(), value);
            return this;
        }

        //public Response SetLogs(RequestLog logs)
        //{
        //    Logs = logs;
        //    return this;
        //}
    }

    public class Response<T> : Response// where T : new()
    {
        [JPA(Order = -4)] public new T Data { get; private set; } = default!;

        public Response() : base() { }

        public Response(T data) : base() => Data = data;

        public Response(Response res) : base(res) { }

        public Response(HttpStatusCode status) : base(status) { }

        public Response(HttpStatusCode status, T data) : base(status) => Data = data;

        public Response(HttpStatusCode status, string message) : base(status, message) { }

        public new Response<T> MapFrom(Response source)
        {
            base.MapFrom(source);
            return this;
        }

        public new Response<T> SetStatus(HttpStatusCode status)
        {
            base.SetStatus(status);
            return this;
        }

        public new Response<T> SetOk() => SetStatus(HttpStatusCode.OK);

        public new Response<T> SetCreated() => SetStatus(HttpStatusCode.Created);

        public new Response<T> SetNoContent() => SetStatus(HttpStatusCode.NoContent);

        public new Response<T> SetBadRequest() => SetStatus(HttpStatusCode.BadRequest);

        public new Response<T> SetUnauthorized() => SetStatus(HttpStatusCode.Unauthorized);

        public new Response<T> SetNotFound() => SetStatus(HttpStatusCode.NotFound);

        public new Response<T> SetUnprocessableEntity() => SetStatus(HttpStatusCode.UnprocessableEntity);

        public new Response<T> SetInternalServerError() => SetStatus(HttpStatusCode.InternalServerError);

        public new Response<T> SetServiceUnavailable() => SetStatus(HttpStatusCode.ServiceUnavailable);

        public new Response<T> SetMessage(string message)
        {
            base.SetMessage(message);
            return this;
        }

        public Response<T> NewDataIfNull()
        {
            var data = (T?)Activator.CreateInstance(typeof(T));
            Data ??= data ?? Data;
            return this;
        }

        public Response<T> SetData(T data)
        {
            Data = data;
            return this;
        }

        public T GetData(T data)
        {
            Data = data;
            return Data;
        }

        public new Response<T> AddError(string key, string value)
        {
            base.AddError(key, value);
            return this;
        }
        //public new Response<T> SetLogs(RequestLog logs)
        //{
        //    base.SetLogs(logs);
        //    return this;
        //}
    }
}
