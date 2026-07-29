namespace FahrenheitConverter.Api;

public enum TemperatureUnit
{
    Kelvin,
    Celsius,
    Fahrenheit
}

public static class TemperatureUnitExtensions
{
    public static string GetQueryName(this TemperatureUnit unit) =>
        unit switch
        {
            TemperatureUnit.Kelvin => "kelvin",
            TemperatureUnit.Celsius => "celsius",
            TemperatureUnit.Fahrenheit => "fahrenheit",
            _ => throw new System.ArgumentOutOfRangeException(nameof(unit), unit, null)
        };
}
