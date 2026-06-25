import express, { type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { convertTemperature, type TemperatureUnit } from "./temperature.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const units: TemperatureUnit[] = ["kelvin", "celsius", "fahrenheit"];

const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Fahrenheit Converter Service",
    version: "1.0.0",
    description: "Webservice voor temperatuurconversies tussen Kelvin, Celsius en Fahrenheit."
  },
  servers: [
    {
      url: `http://localhost:${port}`
    }
  ],
  paths: {
    "/convert": {
      get: {
        summary: "Converteer temperatuur",
        description: "Geef precies een queryparameter mee: kelvin, celsius of fahrenheit.",
        parameters: [
          {
            name: "kelvin",
            in: "query",
            required: false,
            schema: { type: "number", example: 100 },
            description: "Temperatuur in Kelvin."
          },
          {
            name: "celsius",
            in: "query",
            required: false,
            schema: { type: "number", example: 20 },
            description: "Temperatuur in Celsius."
          },
          {
            name: "fahrenheit",
            in: "query",
            required: false,
            schema: { type: "number", example: 300 },
            description: "Temperatuur in Fahrenheit."
          }
        ],
        responses: {
          "200": {
            description: "Conversie succesvol.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["kelvin", "celsius", "fahrenheit"],
                  properties: {
                    kelvin: { type: "number", example: 293.15 },
                    celsius: { type: "number", example: 20 },
                    fahrenheit: { type: "number", example: 68 }
                  }
                }
              }
            }
          },
          "400": {
            description: "Ongeldige of ontbrekende queryparameter.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["error"],
                  properties: {
                    error: { type: "string", example: "Geef precies een temperatuur mee: kelvin, celsius of fahrenheit." }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

app.get("/openapi.json", (_req: Request, res: Response) => {
  res.json(openApiDocument);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

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
