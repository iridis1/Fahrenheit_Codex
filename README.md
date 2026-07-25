# Fahrenheit Converter Service

TypeScript/Express-webservice voor temperatuurconversies tussen Kelvin, Fahrenheit en Celsius.

## Installeren

```powershell
npm.cmd install
```

## Ontwikkelen

Start de API:

```powershell
npm.cmd run dev
```

Start de Vue-front-end in een tweede terminal:

```powershell
npm.cmd run dev:client
```

De front-end draait standaard op:

```text
http://127.0.0.1:5173
```

## Build en starten

```powershell
npm.cmd run build
npm.cmd run build:client
npm.cmd start
```

Standaard draait de service op poort `3000`. Gebruik `PORT` om dit te wijzigen.

## Testen

```powershell
npm.cmd test
```

## Swagger

Na het starten is de interactieve Swagger-documentatie beschikbaar op:

```text
http://localhost:3000/api-docs
```

De OpenAPI-specificatie staat op:

```text
http://localhost:3000/openapi.json
```

## Endpoint

```text
GET /convert?kelvin=100
GET /convert?celsius=20
GET /convert?fahrenheit=300
```

Voorbeeld:

```json
{
  "kelvin": 293.15,
  "celsius": 20,
  "fahrenheit": 68
}
```

Waarden lager dan het absolute nulpunt geven een `400`-foutmelding terug.
