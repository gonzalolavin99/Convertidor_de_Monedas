 // Endpoint de las tasas de cambio
 const apiURL = "https://mindicador.cl/api/";

 // Elementos del DOM
 const montoInput = document.querySelector("#montoInput");
 const btnConvertir = document.querySelector("#btnConvertir");
 const montoConvertido = document.querySelector("#montoConvertido");
 const tipoDeMoneda = document.querySelector("#monedasParaConvertir");
//Variable global para que las funciones tengan  acceso a ella.
 let data = "";

 // Función para obtener las tasas de cambio
 async function getIndicador() {
    try {
        const res = await fetch(apiURL);
        data = await res.json(); // Asignar a la variable global data
        console.log(data);
        // Luego de obtener los datos, habilitar el botón de conversión
        btnConvertir.disabled = false;
    } catch (error) {
        alert("Error al conseguir los datos de conversión: " + error.message);
    }
}

 // Llamar a la función para obtener las tasas de cambio
 getIndicador();
 btnConvertir.disabled = true;


 // Función para realizar la conversión de moneda
 function convertirMoneda() {
     var monto = parseFloat(montoInput.value);

     if (isNaN(monto)) {
         alert("Por favor ingrese un monto");
         return;
     }

     var moneda = tipoDeMoneda.value;

     if (moneda === "dolar") {
         const tasaCambioDolar = data.dolar.valor;
         const montoConvertidoDolar = monto / tasaCambioDolar;
         montoConvertido.textContent = `${montoConvertidoDolar.toFixed(2)} USD`;
         
     } else if (moneda === "euro") {
         const tasaCambioEuro = data.euro.valor;
         const montoConvertidoEuro = monto / tasaCambioEuro;
         montoConvertido.textContent = `${montoConvertidoEuro.toFixed(2)} EUR`;
     } else {
         alert("Por favor, seleccione una moneda para convertir.");
     }
 }

 btnConvertir.addEventListener("click", convertirMoneda);