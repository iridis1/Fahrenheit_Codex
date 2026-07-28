using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using FahrenheitConverter.Api;
using Microsoft.Extensions.Primitives;
using Microsoft.OpenApi;

var port = int.TryParse(Environment.GetEnvironmentVariable("PORT"), out var parsedPort)
    ? parsedPort
    : 3000;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls($"http://localhost:{port}");
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddSingleton<TemperatureConverter>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Fahrenheit Converter Service",
        Version = "1.0.0",
        Description = "Webservice voor temperatuurconversies tussen Kelvin, Celsius en Fahrenheit."
    });
    options.OperationFilter<ConvertEndpointOperationFilter>();
});

var app = builder.Build();
var units = new[] { TemperatureUnit.Kelvin, TemperatureUnit.Celsius, TemperatureUnit.Fahrenheit };

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/api-docs")
    {
        context.Response.Redirect("/api-docs/", permanent: true);
        return;
    }

    if (context.Request.Path == "/openapi.json")
    {
        context.Request.Path = "/openapi/v1.json";
    }

    await next();
});

app.UseSwagger(options =>
{
    options.RouteTemplate = "openapi/{documentName}.json";
});
app.UseSwaggerUI(options =>
{
    options.RoutePrefix = "api-docs";
    options.SwaggerEndpoint("/openapi.json", "Fahrenheit Converter Service v1");
});

app.MapGet("/convert", (HttpRequest request, TemperatureConverter temperatureConverter) =>
{
    var providedUnits = units
        .Where(unit => request.Query.ContainsKey(unit.QueryName))
        .ToArray();

    if (providedUnits.Length != 1)
    {
        return Results.BadRequest(new ErrorResponse(
            "Geef precies een temperatuur mee: kelvin, celsius of fahrenheit."));
    }

    var unit = providedUnits[0];
    var rawValue = request.Query[unit.QueryName];

    if (rawValue.Count > 1)
    {
        return Results.BadRequest(new ErrorResponse($"Gebruik maar een waarde voor {unit.QueryName}."));
    }

    if (!TryReadNumber(rawValue, out var value))
    {
        return Results.BadRequest(new ErrorResponse($"{unit.QueryName} moet een geldig getal zijn."));
    }

    if (temperatureConverter.IsBelowAbsoluteZero(unit, value))
    {
        return Results.BadRequest(new ErrorResponse(
            $"{unit.QueryName} mag niet lager zijn dan het absolute nulpunt."));
    }

    return Results.Ok(temperatureConverter.ConvertTemperature(unit, value));
})
.WithName("ConvertTemperature")
.WithSummary("Converteer temperatuur")
.WithDescription("Geef precies een queryparameter mee: kelvin, celsius of fahrenheit.")
.Produces<TemperatureResult>()
.Produces<ErrorResponse>(StatusCodes.Status400BadRequest);

app.MapGet("/", () => Results.Json(new
{
    message = "Gebruik /convert met kelvin, celsius of fahrenheit.",
    examples = new[] { "/convert?kelvin=100", "/convert?celsius=20", "/convert?fahrenheit=300" }
}));

app.Run();

static bool TryReadNumber(StringValues rawValue, out double value)
{
    var rawText = rawValue.Count == 0 ? null : rawValue[0];
    return double.TryParse(
        rawText,
        NumberStyles.Float,
        CultureInfo.InvariantCulture,
        out value)
        && double.IsFinite(value);
}

public sealed record ErrorResponse(string Error);

[JsonConverter(typeof(TemperatureUnitJsonConverter))]
public readonly record struct TemperatureUnit(string QueryName)
{
    public static readonly TemperatureUnit Kelvin = new("kelvin");
    public static readonly TemperatureUnit Celsius = new("celsius");
    public static readonly TemperatureUnit Fahrenheit = new("fahrenheit");
}

public sealed class TemperatureUnitJsonConverter : JsonConverter<TemperatureUnit>
{
    public override TemperatureUnit Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options) =>
        new(reader.GetString() ?? string.Empty);

    public override void Write(
        Utf8JsonWriter writer,
        TemperatureUnit value,
        JsonSerializerOptions options) =>
        writer.WriteStringValue(value.QueryName);
}
