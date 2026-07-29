using System.Text.Json;
using FahrenheitConverter.Api;
using Microsoft.OpenApi;

var port = int.TryParse(Environment.GetEnvironmentVariable("PORT"), out var parsedPort)
    ? parsedPort
    : 3000;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls($"http://localhost:{port}");
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddSingleton<TemperatureConverter>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Fahrenheit Converter Service",
        Version = "1.0.0",
        Description = "Web service for temperature conversions between Kelvin, Celsius, and Fahrenheit."
    });
    options.OperationFilter<ConvertEndpointOperationFilter>();
});

var app = builder.Build();

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

app.MapControllers();

app.Run();
