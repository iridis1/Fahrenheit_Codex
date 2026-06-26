import request from "supertest";
import { createApp } from "./app.js";

const app = createApp();

describe("GET /convert", () => {
  it("geeft 200 en geconverteerde temperaturen terug voor Celsius", async () => {
    const response = await request(app).get("/convert").query({ celsius: 20 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      kelvin: 293.15,
      celsius: 20,
      fahrenheit: 68
    });
  });

  it("geeft 400 als er geen temperatuur is meegegeven", async () => {
    const response = await request(app).get("/convert");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Geef precies een temperatuur mee: kelvin, celsius of fahrenheit."
    });
  });

  it("geeft 400 als er meerdere temperatuureenheden zijn meegegeven", async () => {
    const response = await request(app).get("/convert").query({ celsius: 20, kelvin: 293.15 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Geef precies een temperatuur mee: kelvin, celsius of fahrenheit."
    });
  });

  it("geeft 400 als de temperatuur geen getal is", async () => {
    const response = await request(app).get("/convert").query({ celsius: "warm" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "celsius moet een geldig getal zijn."
    });
  });

  it("geeft 400 als de temperatuur lager is dan het absolute nulpunt", async () => {
    const response = await request(app).get("/convert").query({ kelvin: -1 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "kelvin mag niet lager zijn dan het absolute nulpunt."
    });
  });
});

describe("overige routes", () => {
  it("geeft 200 voor de root-route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "Gebruik /convert met kelvin, celsius of fahrenheit."
    });
  });

  it("geeft 200 voor de OpenAPI-specificatie", async () => {
    const response = await request(app).get("/openapi.json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      openapi: "3.0.3",
      info: {
        title: "Fahrenheit Converter Service"
      }
    });
  });

  it("geeft 301 voor Swagger zonder slash", async () => {
    const response = await request(app).get("/api-docs");

    expect(response.status).toBe(301);
  });

  it("geeft 404 voor onbekende routes", async () => {
    const response = await request(app).get("/bestaat-niet");

    expect(response.status).toBe(404);
  });
});
