# Fahrenheit Converter Service - C# backend

ASP.NET Core version of the TypeScript/Express backend for temperature conversions between Kelvin, Fahrenheit, and Celsius.

Swagger/OpenAPI is provided by `Swashbuckle.AspNetCore`.

## Development

```powershell
dotnet run
```

By default, the service runs on port `3000`. Use `PORT` to change this:

```powershell
$env:PORT=5000
dotnet run
```

## Build

```powershell
dotnet build
```

## Swagger

After startup, the interactive Swagger documentation is available at:

```text
http://localhost:3000/api-docs
```

The OpenAPI specification is available at:

```text
http://localhost:3000/openapi.json
```

## Endpoint

```text
GET /convert?kelvin=100
GET /convert?celsius=20
GET /convert?fahrenheit=300
```

Example:

```json
{
  "kelvin": 293.15,
  "celsius": 20,
  "fahrenheit": 68
}
```

Values below absolute zero return a `400` error response.
