using System.Text.Json.Nodes;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace FahrenheitConverter.Api;

public sealed class ConvertEndpointOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (!string.Equals(context.ApiDescription.RelativePath, "convert", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        operation.Parameters =
        [
            CreateTemperatureParameter("kelvin", 100, "Temperatuur in Kelvin."),
            CreateTemperatureParameter("celsius", 20, "Temperatuur in Celsius."),
            CreateTemperatureParameter("fahrenheit", 300, "Temperatuur in Fahrenheit.")
        ];
    }

    private static OpenApiParameter CreateTemperatureParameter(
        string name,
        double example,
        string description) =>
        new()
        {
            Name = name,
            In = ParameterLocation.Query,
            Required = false,
            Schema = new OpenApiSchema
            {
                Type = JsonSchemaType.Number
            },
            Example = JsonValue.Create(example),
            Description = description
        };
}
