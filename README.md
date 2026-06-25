# Fahrenheit Converter Service

TypeScript/Express-webservice voor temperatuurconversies tussen Kelvin, Fahrenheit en Celsius.

## Installeren

```powershell
npm.cmd install
```

## Ontwikkelen

```powershell
npm.cmd run dev
```

## Build en starten

```powershell
npm.cmd run build
npm.cmd start
```

Standaard draait de service op poort `3000`. Gebruik `PORT` om dit te wijzigen.

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
