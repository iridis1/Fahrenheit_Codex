import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App.vue";

describe("Temperatuurconverter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("toont het formulier met Celsius als standaard eenheid", () => {
    const wrapper = mount(App);

    expect(wrapper.get("h1").text()).toBe("Temperatuurconverter");
    expect(wrapper.get("input").element.value).toBe("20");
    expect((wrapper.get("select").element as HTMLSelectElement).selectedOptions[0].text).toBe("Celsius");
    expect(wrapper.get("button").text()).toBe("Converteer Celsius");
  });

  it("verstuurt de invoer en toont de conversieresultaten", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        result: { kelvin: 293.15, celsius: 20, fahrenheit: 68 }
      })
    });
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mount(App);

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledWith("/convert?celsius=20");
    expect(wrapper.find(".results").exists()).toBe(true);
    expect(wrapper.findAll(".result-card").map((card) => card.text())).toEqual([
      "Celsius20°C",
      "Fahrenheit68°F",
      "Kelvin293.15K"
    ]);
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it("toont een validatiefout voor ongeldige invoer zonder fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const wrapper = mount(App);

    await wrapper.get("input").setValue("abc");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(wrapper.get('[role="alert"]').text()).toBe("Vul een geldig getal in.");
  });

  it("toont de foutmelding van de API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Temperatuur lager dan absoluut nulpunt." })
      })
    );
    const wrapper = mount(App);

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toBe("Temperatuur lager dan absoluut nulpunt.");
    expect(wrapper.find(".results").exists()).toBe(false);
  });
});
