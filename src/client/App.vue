<script setup lang="ts">
import { computed, ref, watch } from "vue";

type TemperatureUnit = "kelvin" | "celsius" | "fahrenheit";

interface TemperatureResult {
  kelvin: number;
  celsius: number;
  fahrenheit: number;
}

interface ConvertResponse {
  result?: TemperatureResult;
  kelvin?: number;
  celsius?: number;
  fahrenheit?: number;
  error?: string;
}

const unitLabels: Record<TemperatureUnit, string> = {
  celsius: "Celsius",
  fahrenheit: "Fahrenheit",
  kelvin: "Kelvin"
};

const unitSymbols: Record<TemperatureUnit, string> = {
  celsius: "&deg;C",
  fahrenheit: "&deg;F",
  kelvin: "K"
};

const selectedUnit = ref<TemperatureUnit>("celsius");
const temperature = ref("20");
const result = ref<TemperatureResult | null>(null);
const error = ref("");
const isLoading = ref(false);

const selectedLabel = computed(() => unitLabels[selectedUnit.value]);
const canConvert = computed(() => temperature.value.trim().length > 0 && !isLoading.value);

watch([selectedUnit, temperature], () => {
  error.value = "";
});

async function convertTemperature() {
  const value = Number(temperature.value.replace(",", "."));

  if (!Number.isFinite(value)) {
    result.value = null;
    error.value = "Vul een geldig getal in.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const params = new URLSearchParams({ [selectedUnit.value]: String(value) });
    const response = await fetch(`/convert?${params.toString()}`);
    const body = (await response.json()) as ConvertResponse;

    if (!response.ok) {
      result.value = null;
      error.value = body.error ?? "De conversie is niet gelukt.";
      return;
    }

    result.value = body.result ?? {
      kelvin: Number(body.kelvin),
      celsius: Number(body.celsius),
      fahrenheit: Number(body.fahrenheit)
    };
  } catch {
    result.value = null;
    error.value = "Kan de conversieservice niet bereiken.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main class="page-shell">
    <section class="converter-panel" aria-labelledby="page-title">
      <div class="intro">
        <p class="eyebrow">Fahrenheit Converter Service</p>
        <h1 id="page-title">Temperatuurconverter</h1>
        <p class="lede">Reken snel om tussen Celsius, Fahrenheit en Kelvin.</p>
      </div>

      <form class="converter-form" @submit.prevent="convertTemperature">
        <label class="field">
          <span>Temperatuur</span>
          <input
            v-model="temperature"
            inputmode="decimal"
            type="text"
            autocomplete="off"
            :aria-describedby="error ? 'conversion-error' : undefined"
          />
        </label>

        <label class="field">
          <span>Eenheid</span>
          <select v-model="selectedUnit">
            <option value="celsius">Celsius</option>
            <option value="fahrenheit">Fahrenheit</option>
            <option value="kelvin">Kelvin</option>
          </select>
        </label>

        <button type="submit" :disabled="!canConvert">
          {{ isLoading ? "Converteren..." : `Converteer ${selectedLabel}` }}
        </button>
      </form>

      <p v-if="error" id="conversion-error" class="error" role="alert">{{ error }}</p>

      <div v-if="result" class="results" aria-live="polite">
        <article v-for="unit in Object.keys(unitLabels)" :key="unit" class="result-card">
          <span>{{ unitLabels[unit as TemperatureUnit] }}</span>
          <strong>{{ result[unit as TemperatureUnit] }}</strong>
          <small v-html="unitSymbols[unit as TemperatureUnit]"></small>
        </article>
      </div>
    </section>
  </main>
</template>
