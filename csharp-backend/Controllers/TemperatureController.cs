using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace FahrenheitConverter.Api.Controllers;

[ApiController]
[Route("")]
public sealed class TemperatureController : ControllerBase
{
    private static readonly TemperatureUnit[] Units =
    [
        TemperatureUnit.Kelvin,
        TemperatureUnit.Celsius,
        TemperatureUnit.Fahrenheit
    ];

    private readonly TemperatureConverter _temperatureConverter;

    public TemperatureController(TemperatureConverter temperatureConverter)
    {
        _temperatureConverter = temperatureConverter;
    }

    [HttpGet("convert", Name = "ConvertTemperature")]
    [ProducesResponseType<TemperatureResult>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status400BadRequest)]
    public IActionResult Convert()
    {
        var providedUnits = Units
            .Where(unit => Request.Query.ContainsKey(unit.QueryName))
            .ToArray();

        if (providedUnits.Length != 1)
        {
            return BadRequest(new ErrorResponse(
                "Geef precies een temperatuur mee: kelvin, celsius of fahrenheit."));
        }

        var unit = providedUnits[0];
        var rawValue = Request.Query[unit.QueryName];

        if (rawValue.Count > 1)
        {
            return BadRequest(new ErrorResponse($"Gebruik maar een waarde voor {unit.QueryName}."));
        }

        if (!TryReadNumber(rawValue, out var value))
        {
            return BadRequest(new ErrorResponse($"{unit.QueryName} moet een geldig getal zijn."));
        }

        if (value > 100000)
        {
            return BadRequest(new ErrorResponse("Waarde it te groot."));
        }

        if (_temperatureConverter.IsBelowAbsoluteZero(unit, value))
        {
            return BadRequest(new ErrorResponse(
                $"{unit.QueryName} mag niet lager zijn dan het absolute nulpunt."));
        }

        return Ok(_temperatureConverter.ConvertTemperature(unit, value));
    }

    [HttpGet("")]
    public IActionResult GetInfo() =>
        new JsonResult(new
        {
            message = "Gebruik /convert met kelvin, celsius of fahrenheit.",
            examples = new[] { "/convert?kelvin=100", "/convert?celsius=20", "/convert?fahrenheit=300" }
        });

    private static bool TryReadNumber(StringValues rawValue, out double value)
    {
        var rawText = rawValue.Count == 0 ? null : rawValue[0];
        return double.TryParse(
            rawText,
            NumberStyles.Float,
            CultureInfo.InvariantCulture,
            out value)
            && double.IsFinite(value);
    }
}

public sealed record ErrorResponse(string Error);
