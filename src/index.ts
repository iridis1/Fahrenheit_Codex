import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const app = createApp(port);

app.listen(port, () => {
  console.log(`Temperature converter service draait op http://localhost:${port}`);
});
