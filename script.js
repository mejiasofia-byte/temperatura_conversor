const temperatureInput = document.getElementById("temperature");
const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const swapButton = document.getElementById("swap-button");
const clearButton = document.getElementById("clear-button");
const resultValue = document.getElementById("result-value");
const resultFormula = document.getElementById("result-formula");
const errorMessage = document.getElementById("error-message");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const resultCard = document.querySelector(".result-card");

const unitSymbols = {
  celsius: "°C",
  fahrenheit: "°F",
  kelvin: "K",
};

const absoluteZero = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0,
};

function toCelsius(value, unit) {
  switch (unit) {
    case "celsius":
      return value;
    case "fahrenheit":
      return (value - 32) * (5 / 9);
    case "kelvin":
      return value - 273.15;
    default:
      return NaN;
  }
}

function fromCelsius(value, unit) {
  switch (unit) {
    case "celsius":
      return value;
    case "fahrenheit":
      return value * (9 / 5) + 32;
    case "kelvin":
      return value + 273.15;
    default:
      return NaN;
  }
}

function convertTemperature(value, sourceUnit, targetUnit) {
  if (sourceUnit === targetUnit) return value;

  const celsius = toCelsius(value, sourceUnit);
  return fromCelsius(celsius, targetUnit);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";

  const rounded = Math.round(value * 100) / 100;

  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 2,
  }).format(rounded);
}

function getTemperatureCategory(value, unit) {
  const celsius = toCelsius(value, unit);

  if (celsius <= 10) {
    return {
      className: "cold",
      text: "Temperatura fría",
    };
  }

  if (celsius >= 30) {
    return {
      className: "hot",
      text: "Temperatura caliente",
    };
  }

  return {
    className: "mild",
    text: "Temperatura templada",
  };
}

function updateStatus(value, unit) {
  const category = getTemperatureCategory(value, unit);

  statusDot.className = `status-dot ${category.className}`;
  statusText.textContent = category.text;
}

function showError(message) {
  errorMessage.textContent = message;
  temperatureInput.setAttribute("aria-invalid", "true");

  resultValue.textContent = "—";
  resultFormula.textContent = "Corrige el valor para continuar";

  statusDot.className = "status-dot neutral";
  statusText.textContent = "Valor inválido";
}

function clearError() {
  errorMessage.textContent = "";
  temperatureInput.removeAttribute("aria-invalid");
}

function animateResult() {
  resultCard.classList.remove("animate");
  void resultCard.offsetWidth;
  resultCard.classList.add("animate");
}

function updateConversion() {
  const rawValue = temperatureInput.value.trim();

  if (rawValue === "") {
    clearError();
    resultValue.textContent = "—";
    resultFormula.textContent = "La conversión aparecerá aquí";
    statusDot.className = "status-dot neutral";
    statusText.textContent = "Ingresa una temperatura para comenzar";
    return;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    showError("Ingresa un valor numérico válido.");
    return;
  }

  const sourceUnit = fromUnit.value;
  const targetUnit = toUnit.value;

  if (value < absoluteZero[sourceUnit]) {
    showError(
      `El valor mínimo permitido en ${unitSymbols[sourceUnit]} es ${absoluteZero[sourceUnit]} ${unitSymbols[sourceUnit]}.`
    );
    return;
  }

  clearError();

  const converted = convertTemperature(value, sourceUnit, targetUnit);

  resultValue.textContent = `${formatNumber(converted)} ${unitSymbols[targetUnit]}`;
  resultFormula.textContent =
    `${formatNumber(value)} ${unitSymbols[sourceUnit]} = ` +
    `${formatNumber(converted)} ${unitSymbols[targetUnit]}`;

  updateStatus(converted, targetUnit);
  animateResult();
}

function swapUnits() {
  const currentFrom = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = currentFrom;
  updateConversion();
}

function clearAll() {
  temperatureInput.value = "";
  fromUnit.value = "celsius";
  toUnit.value = "fahrenheit";
  clearError();

  resultValue.textContent = "—";
  resultFormula.textContent = "La conversión aparecerá aquí";
  statusDot.className = "status-dot neutral";
  statusText.textContent = "Ingresa una temperatura para comenzar";

  temperatureInput.focus();
}

temperatureInput.addEventListener("input", updateConversion);
fromUnit.addEventListener("change", updateConversion);
toUnit.addEventListener("change", updateConversion);
swapButton.addEventListener("click", swapUnits);
clearButton.addEventListener("click", clearAll);

document.getElementById("converter-form").addEventListener("submit", (event) => {
  event.preventDefault();
});

updateConversion();
