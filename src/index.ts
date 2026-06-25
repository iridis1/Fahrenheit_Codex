import express, { type Request, type Response } from "express";
import { convertTemperature, type TemperatureUnit } from "./temperature.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const units: TemperatureUnit[] = ["kelvin", "celsius", "fahrenheit"];

app.get("/convert", (req: Request, res: Response) => {
  const providedUnits = units.filter((unit) => req.query[unit] !== undefined);

  if (providedUnits.length !== 1) {
    return res.status(400).json({
      error: "Geef precies een temperatuur mee: kelvin, celsius of fahrenheit."
    });
  }

  const unit = providedUnits[0];
  const rawValue = req.query[unit];

  if (Array.isArray(rawValue)) {
    return res.status(400).json({
      error: `Gebruik maar een waarde voor ${unit}.`
    });
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    return res.status(400).json({
      error: `${unit} moet een geldig getal zijn.`
    });
  }

  return res.json(convertTemperature(unit, value));
});

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Gebruik /convert met kelvin, celsius of fahrenheit.",
    examples: ["/convert?kelvin=100", "/convert?celsius=20", "/convert?fahrenheit=300"]
  });
});

app.listen(port, () => {
  console.log(`Temperature converter service draait op http://localhost:${port}`);
});
