
const options = {
  componentRestrictions: { country: "br" },
};

const inputOrigem = document.querySelector("input.origem");
new google.maps.places.Autocomplete(inputOrigem, options);

const inputDestino = document.querySelector("input.destino");
new google.maps.places.Autocomplete(inputDestino, options);

const resultado = document.querySelector("span.valor");
const divResultadoOK = document.querySelector("div.resultado-ok");
const divResultadoERRO = document.querySelector("div.resultado-erro");
const divMapaContainer = document.querySelector(".mapa-container");

function calculaValor() {
  const diasPorMesInput = document.querySelector("input.diasPorMes");
  if (!inputOrigem.value || !inputDestino.value || !diasPorMesInput.value) {
    alert("Preencha todos os campos!") 
    return
  }  



  const requestIda = {
    origin: inputOrigem.value,
    destination: inputDestino.value,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  const directionsService = new google.maps.DirectionsService();

  directionsService.route(requestIda, function (resultIda, statusIda) {
    if (statusIda === "OK") {
      const qntKmIda = parseFloat((resultIda.routes[0].legs[0].distance.value / 1000).toFixed(1));
      const precoPorKm = 5.00;
      let valorFinal = qntKmIda * precoPorKm;

      const idaVoltaCheckbox = document.getElementById("idaVoltaCheckbox");
      if (idaVoltaCheckbox.checked) {
        const requestVolta = {
          origin: inputDestino.value,
          destination: inputOrigem.value,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        };

        directionsService.route(requestVolta, function (resultVolta, statusVolta) {
          if (statusVolta === "OK") {
            const qntKmVolta = parseFloat((resultVolta.routes[0].legs[0].distance.value / 1000).toFixed(1));
            valorFinal += qntKmVolta * precoPorKm; // Adicionar a distância de volta ao valor final

            const origem = resultIda.routes[0].legs[0].start_address;
            const destino = resultIda.routes[0].legs[0].end_address;

            const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=${encodeURIComponent(
              origem
            )}&markers=${encodeURIComponent(destino)}&key=AIzaSyD2RNrLjrs-5iEu-qPdBoFoRXsUFcTtj4M`;

            const mapaImagem = document.createElement("img");
            mapaImagem.src = staticMapUrl;

            divMapaContainer.innerHTML = "";
            divMapaContainer.appendChild(mapaImagem);

            divResultadoOK.style.display = "block";
            divResultadoERRO.style.display = "none";
          } else {
            divResultadoOK.style.display = "none";
            divResultadoERRO.style.display = "block";
          }

          const diasPorMes = parseInt(diasPorMesInput.value) || 30;
          const valorTotal = valorFinal * diasPorMes;

          resultado.innerHTML = "R$ " + valorTotal.toFixed(2).replace(".", ",");
        });
      } else {
        const origem = resultIda.routes[0].legs[0].start_address;
        const destino = resultIda.routes[0].legs[0].end_address;

        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=${encodeURIComponent(
          origem
        )}&markers=${encodeURIComponent(destino)}&key=AIzaSyD2RNrLjrs-5iEu-qPdBoFoRXsUFcTtj4M`;

        const mapaImagem = document.createElement("img");
        mapaImagem.src = staticMapUrl;

        divMapaContainer.innerHTML = "";
        divMapaContainer.appendChild(mapaImagem);

        divResultadoOK.style.display = "block";
        divResultadoERRO.style.display = "none";

        const diasPorMesInput = document.querySelector("input.diasPorMes");
        const diasPorMes = parseInt(diasPorMesInput.value) || 30;
        const valorTotal = valorFinal * diasPorMes;

        resultado.innerHTML = "R$ " + valorTotal.toFixed(2).replace(".", ",");
      }
    } else {
      divResultadoOK.style.display = "none";
      divResultadoERRO.style.display = "block";
    }
  });

}