import { TemperatureConverter } from "./temperature";

const temperatureConverter = new TemperatureConverter();

describe("convertTemperature", () => {
  it("converteert Celsius naar Kelvin en Fahrenheit", () => {
    expect(temperatureConverter.convertTemperature("celsius", 20)).toEqual({
      kelvin: 293.15,
      celsius: 20,
      fahrenheit: 68
    });
  });

  it("converteert Kelvin naar Celsius en Fahrenheit", () => {
    expect(temperatureConverter.convertTemperature("kelvin", 100)).toEqual({
      kelvin: 100,
      celsius: -173.15,
      fahrenheit: -279.67
    });
  });

  it("converteert Fahrenheit naar Kelvin en Celsius", () => {
    expect(temperatureConverter.convertTemperature("fahrenheit", 300)).toEqual({
      kelvin: 422.04,
      celsius: 148.89,
      fahrenheit: 300
    });
  });

  it("geeft het absolute nulpunt correct terug", () => {
    expect(temperatureConverter.convertTemperature("kelvin", 0)).toEqual({
      kelvin: 0,
      celsius: -273.15,
      fahrenheit: -459.67
    });
  });

  it("rondt temperaturen af op maximaal twee cijfers achter de punt", () => {
    const result = temperatureConverter.convertTemperature("fahrenheit", 1);

    expect(getFractionDigitCount(result.kelvin)).toBeLessThanOrEqual(2);
    expect(getFractionDigitCount(result.celsius)).toBeLessThanOrEqual(2);
    expect(getFractionDigitCount(result.fahrenheit)).toBeLessThanOrEqual(2);
    expect(result).toEqual({
      kelvin: 255.93,
      celsius: -17.22,
      fahrenheit: 1
    });
  });
});

describe("isBelowAbsoluteZero", () => {
  it("weigert waarden lager dan het absolute nulpunt", () => {
    expect(temperatureConverter.isBelowAbsoluteZero("kelvin", -0.01)).toBe(true);
    expect(temperatureConverter.isBelowAbsoluteZero("celsius", -273.16)).toBe(true);
    expect(temperatureConverter.isBelowAbsoluteZero("fahrenheit", -459.68)).toBe(true);
  });

  it("accepteert waarden op of boven het absolute nulpunt", () => {
    expect(temperatureConverter.isBelowAbsoluteZero("kelvin", 0)).toBe(false);
    expect(temperatureConverter.isBelowAbsoluteZero("celsius", -273.15)).toBe(false);
    expect(temperatureConverter.isBelowAbsoluteZero("fahrenheit", -459.67)).toBe(false);
    expect(temperatureConverter.isBelowAbsoluteZero("celsius", 20)).toBe(false);
  });
});

function getFractionDigitCount(value: number): number {
  return value.toString().split(".")[1]?.length ?? 0;
}
