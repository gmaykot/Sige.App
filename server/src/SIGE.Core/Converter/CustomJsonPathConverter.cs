using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System.Reflection;
using System.Text.RegularExpressions;

namespace SIGE.Core.Converter
{
    public class CustomJsonPathConverter : JsonConverter
    {
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var jo = JObject.Load(reader);
            var targetObj = Activator.CreateInstance(objectType);

            foreach (PropertyInfo prop in objectType.GetProperties().Where(p => p.CanRead && p.CanWrite))
            {
                var att = prop.GetCustomAttributes(true).OfType<JsonPropertyAttribute>().FirstOrDefault();

                var jsonPath = att != null ? att.PropertyName : prop.Name;

                if (serializer.ContractResolver is DefaultContractResolver resolver)
                    jsonPath = resolver.GetResolvedPropertyName(jsonPath);

                if (!Regex.IsMatch(jsonPath, @"^[a-zA-Z0-9_.-]+$"))
                    throw new InvalidOperationException("JProperties of JsonPathConverter can have only letters, " +
                        "numbers, underscores, hiffens and dots but name was '" + jsonPath + "'.");

                var token = jo.SelectToken(jsonPath);
                if (token != null && token.Type != JTokenType.Null)
                {
                    object value = token.ToObject(prop.PropertyType, serializer);
                    prop.SetValue(targetObj, value, null);
                }
            }

            return targetObj;
        }

        public override bool CanConvert(Type objectType) =>
            objectType.GetCustomAttributes(true).OfType<CustomJsonPathConverter>().Any();

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var main = new JObject();

            var properties = value.GetType().GetRuntimeProperties().Where(p => p.CanRead && p.CanWrite);

            foreach (PropertyInfo prop in properties)
            {
                var att = prop.GetCustomAttributes(true).OfType<JsonPropertyAttribute>().FirstOrDefault();
                var attIgnore = prop.GetCustomAttributes(true).OfType<JsonIgnoreAttribute>().FirstOrDefault();
                if (attIgnore == null)
                {
                    var jsonPath = att != null ? att.PropertyName : prop.Name;

                    if (serializer.ContractResolver is DefaultContractResolver resolver)
                        jsonPath = resolver.GetResolvedPropertyName(jsonPath);

                    var nesting = jsonPath.Split('.');
                    var lastLevel = main;

                    for (int i = 0; i < nesting.Length; i++)
                    {
                        if (i == nesting.Length - 1)
                        {
                            var objValue = prop.GetValue(value);
                            lastLevel[nesting[i]] = objValue != null ? JToken.FromObject(prop.GetValue(value)) : null;
                        }
                        else
                        {
                            if (lastLevel[nesting[i]] == null)
                            {
                                lastLevel[nesting[i]] = new JObject();
                            }

                            lastLevel = (JObject)lastLevel[nesting[i]];
                        }
                    }
                }
            }

            serializer.Serialize(writer, main);
        }
    }

}
