export type TemperatureUnit = "kelvin" | "celsius" | "fahrenheit";

export interface TemperatureResult {
  kelvin: number;
  celsius: number;
  fahrenheit: number;
}

const absoluteZeroByUnit: Record<TemperatureUnit, number> = {
  kelvin: 0,
  celsius: -273.15,
  fahrenheit: -459.67
};

export function convertTemperature(unit: TemperatureUnit, value: number): TemperatureResult {
  const celsius = toCelsius(unit, value);

  return {
    kelvin: round(celsius + 273.15),
    celsius: round(celsius),
    fahrenheit: round((celsius * 9) / 5 + 32)
  };
}

export function isBelowAbsoluteZero(unit: TemperatureUnit, value: number): boolean {
  return value < absoluteZeroByUnit[unit];
}

function toCelsius(unit: TemperatureUnit, value: number): number {
  switch (unit) {
    case "kelvin":
      return value - 273.15;
    case "fahrenheit":
      return ((value - 32) * 5) / 9;
    case "celsius":
      return value;
  }
}

function round(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
