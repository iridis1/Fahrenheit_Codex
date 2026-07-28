namespace FahrenheitConverter.Api;

public sealed record TemperatureResult(double Kelvin, double Celsius, double Fahrenheit);

public sealed class TemperatureConverter
{
    private readonly IReadOnlyDictionary<TemperatureUnit, double> _absoluteZeroByUnit =
        new Dictionary<TemperatureUnit, double>
        {
            [TemperatureUnit.Kelvin] = 0,
            [TemperatureUnit.Celsius] = -273.15,
            [TemperatureUnit.Fahrenheit] = -459.67
        };

    public TemperatureResult ConvertTemperature(TemperatureUnit unit, double value)
    {
        var celsius = ToCelsius(unit, value);

        return new TemperatureResult(
            Kelvin: Round(celsius + 273.15),
            Celsius: Round(celsius),
            Fahrenheit: Round((celsius * 9) / 5 + 32));
    }

    public bool IsBelowAbsoluteZero(TemperatureUnit unit, double value) =>
        value < _absoluteZeroByUnit[unit];

    private static double ToCelsius(TemperatureUnit unit, double value)
    {
        if (unit == TemperatureUnit.Kelvin)
        {
            return value - 273.15;
        }

        if (unit == TemperatureUnit.Fahrenheit)
        {
            return ((value - 32) * 5) / 9;
        }

        return value;
    }

    private static double Round(double value) =>
        Math.Round(value, 2, MidpointRounding.AwayFromZero);
}
