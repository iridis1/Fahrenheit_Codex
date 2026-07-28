namespace FahrenheitConverter.Api;

public readonly record struct TemperatureUnit(string QueryName)
{
    public static readonly TemperatureUnit Kelvin = new("kelvin");
    public static readonly TemperatureUnit Celsius = new("celsius");
    public static readonly TemperatureUnit Fahrenheit = new("fahrenheit");
}
