export type TemperatureUnit = "kelvin" | "celsius" | "fahrenheit";

export interface TemperatureResult {
  kelvin: number;
  celsius: number;
  fahrenheit: number;
}

export class TemperatureConverter {
  private readonly maxDigitsAfterDecimalPoint = 2;

  private readonly absoluteZeroByUnit: Record<TemperatureUnit, number> = {
    kelvin: 0,
    celsius: -273.15,
    fahrenheit: -459.67
  };

  convertTemperature(unit: TemperatureUnit, value: number): TemperatureResult {
    const celsius = this.toCelsius(unit, value);

    return {
      kelvin: this.roundToMaxTwoDigitsAfterDecimalPoint(celsius + 273.15),
      celsius: this.roundToMaxTwoDigitsAfterDecimalPoint(celsius),
      fahrenheit: this.roundToMaxTwoDigitsAfterDecimalPoint((celsius * 9) / 5 + 32)
    };
  }

  isBelowAbsoluteZero(unit: TemperatureUnit, value: number): boolean {
    return value < this.absoluteZeroByUnit[unit];
  }

  private toCelsius(unit: TemperatureUnit, value: number): number {
    switch (unit) {
      case "kelvin":
        return value - 273.15;
      case "fahrenheit":
        return ((value - 32) * 5) / 9;
      case "celsius":
        return value;
    }
  }

  private roundToMaxTwoDigitsAfterDecimalPoint(value: number): number {
    const factor = 10 ** this.maxDigitsAfterDecimalPoint;

    return Math.round((value + Number.EPSILON) * factor) / factor;
  }
}
