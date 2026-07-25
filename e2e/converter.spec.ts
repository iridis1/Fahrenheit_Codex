import { expect, test } from "@playwright/test";

test.describe("temperatuurconverter", () => {
  test("toont de converter en rekent Celsius om", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Temperatuurconverter" })).toBeVisible();
    await expect(page.getByText("Reken snel om tussen Celsius, Fahrenheit en Kelvin.")).toBeVisible();

    await page.getByRole("textbox", { name: "Temperatuur" }).fill("20");
    await page.getByRole("combobox", { name: "Eenheid" }).selectOption("celsius");
    await page.getByRole("button", { name: "Converteer Celsius" }).click();

    await expect(page.locator(".result-card").filter({ hasText: "Celsius" })).toContainText("20");
    await expect(page.locator(".result-card").filter({ hasText: "Fahrenheit" })).toContainText("68");
    await expect(page.locator(".result-card").filter({ hasText: "Kelvin" })).toContainText("293.15");
  });

  test("accepteert een komma als decimaalteken", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("textbox", { name: "Temperatuur" }).fill("21,5");
    await page.getByRole("combobox", { name: "Eenheid" }).selectOption("celsius");
    await page.getByRole("button", { name: "Converteer Celsius" }).click();

    await expect(page.locator(".result-card").filter({ hasText: "Celsius" })).toContainText("21.5");
    await expect(page.locator(".result-card").filter({ hasText: "Fahrenheit" })).toContainText("70.7");
    await expect(page.locator(".result-card").filter({ hasText: "Kelvin" })).toContainText("294.65");
  });

  test("toont frontend-validatie voor ongeldige invoer", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("textbox", { name: "Temperatuur" }).fill("warm");
    await page.getByRole("button", { name: "Converteer Celsius" }).click();

    await expect(page.getByRole("alert")).toHaveText("Vul een geldig getal in.");
    await expect(page.locator(".result-card")).toHaveCount(0);
  });

  test("toont backend-fouten in de interface", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("textbox", { name: "Temperatuur" }).fill("-1");
    await page.getByRole("combobox", { name: "Eenheid" }).selectOption("kelvin");
    await page.getByRole("button", { name: "Converteer Kelvin" }).click();

    await expect(page.getByRole("alert")).toHaveText("kelvin mag niet lager zijn dan het absolute nulpunt.");
    await expect(page.locator(".result-card")).toHaveCount(0);
  });
});
