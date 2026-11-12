# Fahrenheit Converter

Een temperatuurconverter met twee API-implementaties: een TypeScript/Express-backend en een ASP.NET Core-backend in C#. De TypeScript-backend wordt gebruikt door de Vue-frontend. Beide API's zetten Kelvin, Celsius en Fahrenheit naar elkaar om.

## Vereisten

- Node.js en npm voor de TypeScript-backend, Vue-frontend en npm-tests.
- .NET 10 SDK voor de C#-backend en de C#-tests.

## TypeScript API en Vue-frontend

Installeer de npm-dependencies vanuit de repositoryroot:

```powershell
npm install
```

### Lokaal ontwikkelen

Start de API en de Vue-frontend elk in een eigen terminal, vanuit de repositoryroot:

```powershell
npm run dev
```

```powershell
npm run dev:client
```

De API luistert standaard op `http://localhost:3000`. De Vite-frontend luistert op `http://127.0.0.1:5173` en stuurt `/convert`-verzoeken door naar de API op poort 3000. Stel `PORT` in om de API-poort te wijzigen. De Vite-proxy gebruikt standaard nog steeds poort 3000.

### Productiebuild en starten

Maak beide builds en start daarna de API:

```powershell
npm run build
npm run build:client
New-Item -ItemType Directory -Force dist-client | Out-Null
Copy-Item -Path src/client/dist-client/* -Destination dist-client -Recurse -Force
npm start
```

`npm run build:client` schrijft de frontend naar `src/client/dist-client`, relatief aan de Vite-root `src/client`. Kopieer de inhoud daarvan naar `dist-client` in de repositoryroot, zoals hierboven, zodat de server de frontend kan vinden. `npm start` voert de gebouwde API uit vanuit `dist` en serveert de frontend uit de rootmap `dist-client` wanneer die bestaat. De API gebruikt standaard poort `3000`; stel `PORT` in om die te wijzigen.

### npm-commando's

Alle npm-scripts uit `package.json`:

| Commando | Functie |
| --- | --- |
| `npm install` | Installeert de dependencies. |
| `npm run dev` | Start de TypeScript API met watcher voor lokale ontwikkeling. |
| `npm run serve:api` | Start de TypeScript API zonder watcher; Playwright gebruikt dit om de API voor end-to-endtests te starten. |
| `npm run dev:client` | Start de Vite-ontwikkelserver voor de Vue-frontend. |
| `npm run build` | Compileert de TypeScript API naar `dist`. |
| `npm run build:client` | Bouwt de Vue-frontend naar `src/client/dist-client`; kopieer de inhoud daarna naar `dist-client` in de repositoryroot om die via de API te serveren. |
| `npm start` | Start de gebouwde TypeScript API vanuit `dist/server/index.js`; voer eerst `npm run build` uit. |
| `npm test` | Voert achtereenvolgens de server-, client- en end-to-endtests uit. |
| `npm run test:server` | Voert de Jest-tests voor de TypeScript-server uit. |
| `npm run test:client` | Voert de Vitest-tests voor de Vue-client uit. |
| `npm run test:e2e` | Voert de Playwright end-to-endtests uit; Playwright start de API en frontend zelf. |

## C# API

De ASP.NET Core-implementatie staat in `src/server_csharp`. Start de API vanuit de repositoryroot:

```powershell
dotnet run --project src/server_csharp/FahrenheitConverter
```

De C#-API gebruikt standaard poort `3000`. Wijzig de poort in PowerShell met:

```powershell
$env:PORT = "5000"
dotnet run --project src/server_csharp/FahrenheitConverter
```

Build de C#-solution en voer de controller-tests uit met:

```powershell
dotnet build src/server_csharp/FahrenheitConverter.slnx
dotnet test src/server_csharp/FahrenheitConverter.slnx
```

De TypeScript- en C#-API's gebruiken standaard dezelfde poort. Start ze daarom niet tegelijk op die poort; stel voor één API een andere `PORT` in.

## Endpoints en documentatie

Beide API-implementaties bieden:

```text
GET /
GET /convert?kelvin=100
GET /convert?celsius=20
GET /convert?fahrenheit=300
```

`GET /` geeft een korte gebruiksaanwijzing met conversievoorbeelden terug.

Geef precies één temperatuurparameter mee. Een succesvolle conversie retourneert de temperatuur in alle drie eenheden, bijvoorbeeld:

```json
{
  "kelvin": 293.15,
  "celsius": 20,
  "fahrenheit": 68
}
```

Ongeldige invoer en temperaturen onder het absolute nulpunt geven een `400`-response. De C#-API weigert daarnaast waarden boven `100000`.

Beide API's bieden interactieve Swagger-documentatie op `http://localhost:3000/api-docs` en de OpenAPI-specificatie op `http://localhost:3000/openapi.json` (pas de poort aan als `PORT` is gewijzigd).
