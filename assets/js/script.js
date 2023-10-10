const apiURL = "https://mindicador.cl/api/";

const montoInput = document.querySelector("#montoInput");
const btnConvertir = document.querySelector("#btnConvertir");
const montoConvertido = document.querySelector("#montoConvertido");
const tipoDeMoneda = document.querySelector("#monedasParaConvertir");

let data = {};
let selectedCurrencyData = {}; // Almacenar los datos de la moneda seleccionada
let myChart = null; // Inicializamos myChart a null

async function getIndicador() {
    try {
        const res = await fetch(apiURL);
        data = await res.json();
        btnConvertir.disabled = false;
    } catch (error) {
        alert("Error al conseguir los datos de conversión: " + error.message);
    }
}

async function crearGrafica() {
    try {
        // Utiliza los datos de la moneda seleccionada
        const currencyData = selectedCurrencyData;

        // Obtener las fechas y valores de las tasas para la moneda seleccionada
        const labels = Object.keys(currencyData.fecha).slice(0, 10).reverse(); // Obtener las últimas 10 fechas
        const data = labels.map((label) => currencyData.fecha[label]);

        const datasets = [
            {
                label: `${tipoDeMoneda.value.toUpperCase()} a CLP`,
                borderColor: "rgb(255, 99, 132)",
                data: data,
            },
        ];

        return { labels, datasets };
    } catch (error) {
        alert("Error al obtener los datos de la API: " + error.message);
    }
}

async function renderGrafica() {
    const tasa = await crearGrafica();
    const config = {
        type: "line",
        data: {
            labels: tasa.labels,
            datasets: tasa.datasets,
        },
    };
    const chartCanvas = document.getElementById("myChart");
    chartCanvas.style.backgroundColor = "white";

    // Destruye el gráfico anterior si existe
    if (myChart) {
        myChart.destroy();
    }

    // Crea un nuevo gráfico
    myChart = new Chart(chartCanvas, config);
}

async function convertirMoneda() {
    var monto = parseFloat(montoInput.value);

    if (isNaN(monto)) {
        alert("Por favor ingrese un monto");
        return;
    }

    var moneda = tipoDeMoneda.value;
    selectedCurrencyData = data[moneda]; // Actualiza los datos de la moneda seleccionada

    if (!selectedCurrencyData) {
        alert("No se encontraron datos para la moneda seleccionada.");
        return;
    }

    // Actualiza el gráfico con los nuevos datos
    renderGrafica();

    if (moneda === "dolar") {
        const tasaCambioDolar = selectedCurrencyData.valor;
        const montoConvertidoDolar = monto / tasaCambioDolar;
        montoConvertido.textContent = `${montoConvertidoDolar.toFixed(2)} USD`;
    } else if (moneda === "euro") {
        const tasaCambioEuro = selectedCurrencyData.valor;
        const montoConvertidoEuro = monto / tasaCambioEuro;
        montoConvertido.textContent = `${montoConvertidoEuro.toFixed(2)} EUR`;
    } else {
        alert("Por favor, seleccione una moneda para convertir.");
    }
}

btnConvertir.addEventListener("click", convertirMoneda);

// Llamar a la función para obtener las tasas de cambio después de definir los eventos
getIndicador();
btnConvertir.disabled = true;
