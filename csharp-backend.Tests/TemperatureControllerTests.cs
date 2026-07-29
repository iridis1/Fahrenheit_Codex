using FahrenheitConverter.Api.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FahrenheitConverter.Api.Tests;

public sealed class TemperatureControllerTests
{
    [Theory]
    [InlineData("kelvin", "293.15", 293.15, 20, 68)]
    [InlineData("celsius", "20", 293.15, 20, 68)]
    [InlineData("fahrenheit", "68", 293.15, 20, 68)]
    public void Convert_ReturnsConvertedTemperatures(
        string unit,
        string value,
        double expectedKelvin,
        double expectedCelsius,
        double expectedFahrenheit)
    {
        var controller = CreateController(new QueryString($"?{unit}={value}"));

        var result = Assert.IsType<OkObjectResult>(controller.Convert());
        var temperature = Assert.IsType<TemperatureResult>(result.Value);

        Assert.Equal(expectedKelvin, temperature.Kelvin);
        Assert.Equal(expectedCelsius, temperature.Celsius);
        Assert.Equal(expectedFahrenheit, temperature.Fahrenheit);
    }

    [Fact]
    public void Convert_ReturnsBadRequestWhenNoTemperatureIsProvided()
    {
        var controller = CreateController(QueryString.Empty);

        var result = Assert.IsType<BadRequestObjectResult>(controller.Convert());
        var error = Assert.IsType<ErrorResponse>(result.Value);

        Assert.Equal("Provide exactly one temperature value: kelvin, celsius, or fahrenheit.", error.Error);
    }

    [Fact]
    public void Convert_ReturnsBadRequestWhenMultipleTemperaturesAreProvided()
    {
        var controller = CreateController(new QueryString("?kelvin=293.15&celsius=20"));

        var result = Assert.IsType<BadRequestObjectResult>(controller.Convert());
        var error = Assert.IsType<ErrorResponse>(result.Value);

        Assert.Equal("Provide exactly one temperature value: kelvin, celsius, or fahrenheit.", error.Error);
    }

    [Fact]
    public void Convert_ReturnsBadRequestWhenTemperatureValueIsRepeated()
    {
        var controller = CreateController(new QueryString("?celsius=20&celsius=21"));

        var result = Assert.IsType<BadRequestObjectResult>(controller.Convert());
        var error = Assert.IsType<ErrorResponse>(result.Value);

        Assert.Equal("Use only one value for celsius.", error.Error);
    }

    [Fact]
    public void Convert_ReturnsBadRequestWhenTemperatureIsNotNumeric()
    {
        var controller = CreateController(new QueryString("?fahrenheit=hot"));

        var result = Assert.IsType<BadRequestObjectResult>(controller.Convert());
        var error = Assert.IsType<ErrorResponse>(result.Value);

        Assert.Equal("fahrenheit must be a valid number.", error.Error);
    }

    [Fact]
    public void Convert_ReturnsBadRequestWhenTemperatureIsTooHigh()
    {
        var controller = CreateController(new QueryString("?kelvin=100001"));

        var result = Assert.IsType<BadRequestObjectResult>(controller.Convert());
        var error = Assert.IsType<ErrorResponse>(result.Value);

        Assert.Equal("Value is too high.", error.Error);
    }

    [Fact]
    public void Convert_ReturnsBadRequestWhenTemperatureIsBelowAbsoluteZero()
    {
        var controller = CreateController(new QueryString("?celsius=-273.16"));

        var result = Assert.IsType<BadRequestObjectResult>(controller.Convert());
        var error = Assert.IsType<ErrorResponse>(result.Value);

        Assert.Equal("celsius cannot be below absolute zero.", error.Error);
    }

    [Fact]
    public void GetInfo_ReturnsUsageMessageAndExamples()
    {
        var controller = CreateController(QueryString.Empty);

        var result = Assert.IsType<JsonResult>(controller.GetInfo());
        var value = result.Value;
        Assert.NotNull(value);

        var valueType = value.GetType();

        var message = Assert.IsType<string>(valueType.GetProperty("message")?.GetValue(value));
        var examples = Assert.IsType<string[]>(valueType.GetProperty("examples")?.GetValue(value));

        Assert.Equal("Use /convert with kelvin, celsius, or fahrenheit.", message);
        Assert.Equal(
            ["/convert?kelvin=100", "/convert?celsius=20", "/convert?fahrenheit=300"],
            examples);
    }

    private static TemperatureController CreateController(QueryString queryString)
    {
        var httpContext = new DefaultHttpContext();
        httpContext.Request.QueryString = queryString;

        return new TemperatureController(new TemperatureConverter())
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            }
        };
    }
}
